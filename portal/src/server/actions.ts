"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { createAdmin } from "@/lib/supabase/admin"
import { isRecord, str } from "@/lib/rows"
import { requireUser } from "@/lib/session"

function clean(message: string): string {
  return message.replace(/^.*ERROR:\s*/i, "").slice(0, 280)
}

function fail(path: string, error: { message: string }): never {
  redirect(`${path}?error=${encodeURIComponent(clean(error.message))}`)
}

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : ""
}

function optionalUuid(value: FormDataEntryValue | null): string | null {
  const raw = text(value)
  if (!raw) return null
  const parsed = z.uuid().safeParse(raw)
  if (!parsed.success) throw new Error("Choose a valid record.")
  return parsed.data
}

function optionalDate(value: FormDataEntryValue | null): string | null {
  const raw = text(value)
  if (!raw) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error("Enter a valid date.")
  return raw
}

function back(formData: FormData, fallback: string): string {
  const path = text(formData.get("return"))
  if (path.startsWith("/") && !path.startsWith("//")) return path
  return fallback
}

async function run(path: string, action: () => PromiseLike<{ error: { message: string } | null }>) {
  try {
    const { error } = await action()
    if (error) fail(path, error)
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }
    const message = error instanceof Error ? error.message : "That could not be saved."
    redirect(`${path}?error=${encodeURIComponent(message)}`)
  }
}

export async function createIssue(formData: FormData) {
  const { supabase } = await requireUser()
  const path = "/issues/new"
  const topic = text(formData.get("subcategory")).split(":")
  await run(path, () =>
    supabase.rpc("create_issue", {
      p_title: text(formData.get("title")),
      p_description: text(formData.get("description")),
      p_category_id: optionalUuid(topic[0] ?? null),
      p_subcategory_id: optionalUuid(topic[1] ?? null),
      p_priority: text(formData.get("priority")) || "normal",
      p_resident_visible: formData.get("resident_visible") === "on",
      p_as_draft: formData.get("draft") === "on",
    }),
  )
  redirect("/issues?notice=The%20issue%20has%20been%20recorded.")
}

export async function transitionIssue(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/issues")
  await run(path, () =>
    supabase.rpc("transition_issue", {
      p_issue_id: optionalUuid(formData.get("issue_id")),
      p_to: text(formData.get("status")),
      p_note: text(formData.get("note")),
    }),
  )
  redirect(`${path}?notice=Status%20updated.`)
}

export async function assignIssue(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/issues")
  await run(path, () =>
    supabase.rpc("assign_issue", {
      p_issue_id: optionalUuid(formData.get("issue_id")),
      p_team: text(formData.get("team")) || null,
      p_owner: optionalUuid(formData.get("owner")),
      p_expected: optionalDate(formData.get("expected_on")),
      p_note: text(formData.get("note")),
    }),
  )
  redirect(`${path}?notice=Assignment%20saved.`)
}

export async function reviewIssue(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/issues")
  const topic = text(formData.get("subcategory")).split(":")
  await run(path, () =>
    supabase.rpc("update_issue_fields", {
      p_issue_id: optionalUuid(formData.get("issue_id")),
      p_category_id: optionalUuid(topic[0] ?? null),
      p_subcategory_id: optionalUuid(topic[1] ?? null),
      p_priority: text(formData.get("priority")) || "normal",
      p_resident_visible: formData.get("resident_visible") === "on",
      p_note: text(formData.get("note")),
    }),
  )
  redirect(`${path}?notice=Review%20saved.`)
}

export async function commentOnIssue(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/issues")
  await run(path, () =>
    supabase.rpc("add_comment", {
      p_issue_id: optionalUuid(formData.get("issue_id")),
      p_body: text(formData.get("body")),
      p_visibility: text(formData.get("visibility")) || "resident",
      p_official: formData.get("official") === "on",
      p_parent: optionalUuid(formData.get("parent")),
      p_mention: optionalUuid(formData.get("mention")),
    }),
  )
  redirect(`${path}?notice=Comment%20added.`)
}

export async function followIssue(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/issues")
  await run(path, () => supabase.rpc("follow_issue", { p_issue_id: optionalUuid(formData.get("issue_id")) }))
  redirect(path)
}

export async function linkIssue(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/issues")
  const raw = text(formData.get("related"))
  let related = z.uuid().safeParse(raw).success ? raw : ""
  if (!related) {
    const found = await supabase.from("issues").select("id").eq("key", raw.toUpperCase()).maybeSingle()
    if (isRecord(found.data)) related = str(found.data, "id")
  }
  if (!related) redirect(`${path}?error=That%20issue%20could%20not%20be%20found.`)
  await run(path, () =>
    supabase.rpc("link_issues", {
      p_issue_id: optionalUuid(formData.get("issue_id")),
      p_related_id: related,
    }),
  )
  redirect(`${path}?notice=Issues%20linked.`)
}

export async function createDiscussion(formData: FormData) {
  const { supabase } = await requireUser()
  let id = ""
  await run("/discussions", async () => {
    const result = await supabase.rpc("create_discussion", {
      p_title: text(formData.get("title")),
      p_body: text(formData.get("body")),
      p_category_id: optionalUuid(formData.get("category")),
      p_visibility: text(formData.get("visibility")) || "resident",
    })
    if (!result.error && typeof result.data === "string") id = result.data
    return result
  })
  redirect(id ? `/discussions/${id}` : "/discussions")
}

export async function postDiscussion(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/discussions")
  await run(path, () =>
    supabase.rpc("add_discussion_post", {
      p_discussion_id: optionalUuid(formData.get("discussion_id")),
      p_body: text(formData.get("body")),
      p_parent: optionalUuid(formData.get("parent")),
    }),
  )
  redirect(`${path}?notice=Comment%20added.`)
}

export async function flagDiscussion(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/discussions")
  await run(path, () =>
    supabase.rpc("set_discussion_flags", {
      p_discussion_id: optionalUuid(formData.get("discussion_id")),
      p_pinned: formData.get("pinned") === "on",
      p_locked: formData.get("locked") === "on",
    }),
  )
  redirect(path)
}

export async function convertDiscussion(formData: FormData) {
  const { supabase } = await requireUser()
  let key = ""
  const path = back(formData, "/discussions")
  await run(path, async () => {
    const result = await supabase.rpc("convert_discussion", {
      p_discussion_id: optionalUuid(formData.get("discussion_id")),
    })
    if (!result.error && typeof result.data === "string") key = result.data
    return result
  })
  redirect(key ? `/issues/${key}` : path)
}

export async function createMeeting(formData: FormData) {
  const { supabase } = await requireUser()
  let id = ""
  await run("/meetings", async () => {
    const result = await supabase.rpc("create_meeting", {
      p_title: text(formData.get("title")),
      p_starts_at: text(formData.get("starts_at")) ? new Date(text(formData.get("starts_at"))).toISOString() : null,
      p_location: text(formData.get("location")),
      p_link: text(formData.get("link")),
    })
    if (!result.error && typeof result.data === "string") id = result.data
    return result
  })
  redirect(id ? `/meetings/${id}` : "/meetings")
}

export async function addAgenda(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/meetings")
  await run(path, () =>
    supabase.rpc("add_agenda_item", {
      p_meeting_id: optionalUuid(formData.get("meeting_id")),
      p_body: text(formData.get("body")),
    }),
  )
  redirect(path)
}

export async function addAction(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/meetings")
  const raw = text(formData.get("issue_id"))
  let issueId: string | null = null
  if (raw) {
    if (z.uuid().safeParse(raw).success) issueId = raw
    else {
      const found = await supabase.from("issues").select("id").eq("key", raw.toUpperCase()).maybeSingle()
      if (!isRecord(found.data)) redirect(`${path}?error=That%20issue%20could%20not%20be%20found.`)
      issueId = str(found.data, "id")
    }
  }
  await run(path, () =>
    supabase.rpc("add_action_item", {
      p_meeting_id: optionalUuid(formData.get("meeting_id")),
      p_body: text(formData.get("body")),
      p_owner: optionalUuid(formData.get("owner")),
      p_expected: optionalDate(formData.get("expected_on")),
      p_issue_id: issueId,
    }),
  )
  redirect(path)
}

export async function updateAction(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/meetings")
  await run(path, () =>
    supabase.rpc("set_action_status", {
      p_action_id: optionalUuid(formData.get("action_id")),
      p_status: text(formData.get("status")),
    }),
  )
  redirect(path)
}

export async function saveMeeting(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/meetings")
  await run(path, () =>
    supabase.rpc("set_meeting_record", {
      p_meeting_id: optionalUuid(formData.get("meeting_id")),
      p_status: text(formData.get("status")) || "draft",
      p_notes: text(formData.get("notes")),
    }),
  )
  redirect(`${path}?notice=Meeting%20record%20saved.`)
}

export async function addDevelopmentUpdate(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/development")
  await run(path, () =>
    supabase.rpc("add_development_update", {
      p_item_id: optionalUuid(formData.get("item_id")),
      p_milestone_id: optionalUuid(formData.get("milestone_id")),
      p_source: text(formData.get("source")) || "awaiting_confirmation",
      p_body: text(formData.get("body")),
      p_status: text(formData.get("status")) || null,
      p_expected: optionalDate(formData.get("expected_on")),
    }),
  )
  redirect(`${path}?notice=Update%20recorded.`)
}

export async function addMilestone(formData: FormData) {
  const { supabase } = await requireUser()
  const path = back(formData, "/development")
  await run(path, () =>
    supabase.rpc("add_milestone", {
      p_item_id: optionalUuid(formData.get("item_id")),
      p_name: text(formData.get("name")),
    }),
  )
  redirect(path)
}

export async function publishAnnouncement(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/announcements", () =>
    supabase.rpc("create_announcement", {
      p_title: text(formData.get("title")),
      p_body: text(formData.get("body")),
      p_priority: text(formData.get("priority")) || "normal",
      p_visibility: text(formData.get("visibility")) || "resident",
      p_expires: optionalDate(formData.get("expires_on")),
      p_issue_id: optionalUuid(formData.get("issue_id")),
    }),
  )
  redirect("/announcements?notice=Announcement%20published.")
}

export async function acknowledge(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/announcements", () =>
    supabase.rpc("acknowledge_announcement", { p_id: optionalUuid(formData.get("id")) }),
  )
  redirect("/announcements")
}

export async function registerDocument(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/documents", () =>
    supabase.rpc("register_document", {
      p_title: text(formData.get("title")),
      p_description: text(formData.get("description")),
      p_category: text(formData.get("category")),
      p_visibility: text(formData.get("visibility")) || "resident",
      p_issue_id: optionalUuid(formData.get("issue_id")),
      p_meeting_id: optionalUuid(formData.get("meeting_id")),
      p_discussion_id: optionalUuid(formData.get("discussion_id")),
      p_development_item_id: optionalUuid(formData.get("development_item_id")),
    }),
  )
  redirect("/documents?notice=Document%20recorded.")
}

export async function updateCorrespondence(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/documents", () =>
    supabase.rpc("update_correspondence", {
      p_id: optionalUuid(formData.get("id")),
      p_sent_on: optionalDate(formData.get("sent_on")),
      p_sender: text(formData.get("sender")),
      p_recipient: text(formData.get("recipient")),
      p_body: text(formData.get("body")),
      p_response_received: formData.get("response_received") === "on",
      p_response_on: optionalDate(formData.get("response_on")),
      p_response_body: text(formData.get("response_body")),
      p_follow_up: text(formData.get("follow_up")) || "not_started",
    }),
  )
  redirect("/documents?notice=Correspondence%20updated.")
}

export async function inviteMember(formData: FormData) {
  const { supabase } = await requireUser()
  let token = ""
  await run("/admin", async () => {
    const result = await supabase.rpc("create_invitation", {
      p_email: text(formData.get("email")),
      p_full_name: text(formData.get("name")),
      p_role: text(formData.get("role")),
    })
    if (!result.error && typeof result.data === "string") token = result.data
    return result
  })
  const link = token ? `/invite/${token}` : ""
  redirect(`/admin?notice=${encodeURIComponent(link ? `Invitation link: ${link}` : "Invitation created.")}`)
}

export async function updateMember(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/admin", () =>
    supabase.rpc("set_member", {
      p_user: optionalUuid(formData.get("user_id")),
      p_role: text(formData.get("role")),
      p_active: formData.get("active") === "on",
      p_plot: text(formData.get("plot")),
      p_phase: text(formData.get("phase")),
    }),
  )
  redirect("/admin?notice=Member%20updated.")
}

export async function addCategory(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/admin", () =>
    supabase.rpc("add_category", {
      p_name: text(formData.get("name")),
      p_prefix: text(formData.get("prefix")),
    }),
  )
  redirect("/admin?notice=Category%20added.")
}

export async function savePreferences(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/account", () =>
    supabase.rpc("save_preferences", {
      p_comments: formData.get("comments") === "on",
      p_status: formData.get("status_changes") === "on",
      p_announcements: formData.get("announcements") === "on",
      p_meetings: formData.get("meetings") === "on",
    }),
  )
  redirect("/account?notice=Preferences%20saved.")
}

export async function markRead(formData: FormData) {
  const { supabase } = await requireUser()
  await run("/notifications", () =>
    supabase.rpc("mark_notifications_read", { p_id: optionalUuid(formData.get("id")) }),
  )
  redirect("/notifications")
}

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
])

export async function uploadFile(formData: FormData) {
  const { supabase, profile } = await requireUser()
  const path = back(formData, "/documents")
  const file = formData.get("file")
  if (!(file instanceof File) || file.size < 1) {
    redirect(`${path}?error=Choose%20a%20file.`)
  }
  if (file.size > 10 * 1024 * 1024 || !ALLOWED_TYPES.has(file.type)) {
    redirect(`${path}?error=Use%20a%20PDF%2C%20image%2C%20or%20Office%20file%20up%20to%2010%20MB.`)
  }
  const admin = createAdmin()
  if (!admin) {
    redirect(`${path}?error=File%20storage%20is%20not%20configured%20on%20the%20server.`)
  }
  const issueId = optionalUuid(formData.get("issue_id"))
  if (issueId) {
    const visible = await supabase.from("issues").select("id").eq("id", issueId).maybeSingle()
    if (visible.error || !visible.data) redirect(`${path}?error=Issue%20not%20found.`)
  }
  const safeName = file.name.replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 80) || "file"
  const storagePath = `${issueId ?? "library"}/${crypto.randomUUID()}/${safeName}`
  const bytes = new Uint8Array(await file.arrayBuffer())
  const uploaded = await admin.storage.from("portal").upload(storagePath, bytes, {
    contentType: file.type,
    upsert: false,
  })
  if (uploaded.error) fail(path, uploaded.error)
  const recorded = await supabase.rpc("record_attachment", {
    p_storage_path: storagePath,
    p_file_name: safeName,
    p_content_type: file.type,
    p_byte_size: file.size,
    p_visibility: text(formData.get("visibility")) || "resident",
    p_issue_id: issueId,
    p_comment_id: null,
    p_document_id: optionalUuid(formData.get("document_id")),
    p_meeting_id: optionalUuid(formData.get("meeting_id")),
    p_discussion_id: optionalUuid(formData.get("discussion_id")),
    p_development_item_id: optionalUuid(formData.get("development_item_id")),
  })
  if (recorded.error) {
    await admin.storage.from("portal").remove([storagePath])
    fail(path, recorded.error)
  }
  void profile
  redirect(`${path}?notice=File%20uploaded.`)
}
