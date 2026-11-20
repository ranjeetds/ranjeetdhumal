import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Badge, Empty, Notice, PageHeader, Section, buttonClass, fieldClass, quietClass } from "@/components/ui"
import { formatDay, formatWhen, label, ROLE_LABEL, SOURCE_LABEL, STATUS_LABEL, one } from "@/lib/format"
import { bool, isRecord, message, nested, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { can, requireUser } from "@/lib/session"
import {
  assignIssue,
  commentOnIssue,
  followIssue,
  linkIssue,
  reviewIssue,
  transitionIssue,
  uploadFile,
} from "@/server/actions"

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params
  return { title: key }
}

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const { key } = await params
    const query = await searchParams
    const { supabase, profile, permissions } = await requireUser()
    const { data, error } = await supabase
      .from("issues")
      .select("id, key, title, description, status, priority, resident_visible, raiser_name, raised_by, assigned_team, assignee_name, expected_on, resolution_notes, created_at, updated_at, category_id, subcategory_id, categories(name), subcategories(name)")
      .eq("key", key)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!isRecord(data)) notFound()
    const issue = data
    const id = str(issue, "id")
    const [comments, activity, links, documents, actions, files, announcements, transitions, categories, follows] = await Promise.all([
      supabase.from("comments").select("id, parent_id, author_name, author_role, kind, visibility, official, body, created_at").eq("issue_id", id).order("created_at"),
      supabase.from("activity_events").select("id, actor_name, kind, summary, from_value, to_value, created_at").eq("issue_id", id).order("created_at"),
      supabase.from("issue_links").select("related_id, issues:related_id(key, title)").eq("issue_id", id),
      supabase.from("documents").select("id, title").eq("issue_id", id),
      supabase.from("action_items").select("id, body, status, meetings(id, title)").eq("issue_id", id),
      supabase.from("attachments").select("id, file_name, created_at").eq("issue_id", id).order("created_at", { ascending: false }),
      supabase.from("announcements").select("id, title").eq("issue_id", id),
      supabase.from("status_transitions").select("to_status, permission").eq("from_status", str(issue, "status")),
      supabase.from("subcategories").select("id, name, category_id, categories(name)").eq("archived", false).order("sort"),
      supabase.from("issue_follows").select("issue_id").eq("issue_id", id).eq("user_id", profile.id).maybeSingle(),
    ])
    for (const result of [comments, activity, links, documents, actions, files, announcements, transitions, categories]) {
      if (result.error) throw new Error(result.error.message)
    }
    const directory = can(permissions, "members.view") ? await supabase.rpc("member_directory") : { data: [], error: null }
    if (directory.error) throw new Error(directory.error.message)
    const people = records(directory.data)
    const nextStatuses = records(transitions.data)
      .filter((row) => can(permissions, str(row, "permission")))
      .map((row) => str(row, "to_status"))
      .filter((status, index, all) => status && all.indexOf(status) === index)
    const latest = records(activity.data).at(-1)
    const returnPath = `/issues/${key}`

    return (
      <>
        <PageHeader title={str(issue, "title")} lede={str(issue, "key")}>
          <form action={followIssue}>
            <input type="hidden" name="issue_id" value={id} />
            <input type="hidden" name="return" value={returnPath} />
            <button className={quietClass} type="submit">{follows.data ? "Unfollow" : "Follow"}</button>
          </form>
        </PageHeader>
        <Notice error={one(query.error)} notice={one(query.notice)} />

        <Section title="Overview">
          <div className="grid gap-4 rounded-lg border border-line bg-surface p-4 md:grid-cols-2">
            <p className="text-sm leading-6 md:col-span-2">{str(issue, "description")}</p>
            <Fact label="Status"><Badge value={str(issue, "status")} /></Fact>
            <Fact label="Priority"><Badge value={str(issue, "priority")} kind="priority" /></Fact>
            <Fact label="Category">{str(nested(issue, "categories") ?? {}, "name") || "Unknown"}</Fact>
            <Fact label="Topic">{str(nested(issue, "subcategories") ?? {}, "name") || "Not set"}</Fact>
            <Fact label="Raised by">{str(issue, "raiser_name")} · {formatWhen(strNull(issue, "created_at"))}</Fact>
            <Fact label="Assigned">{strNull(issue, "assignee_name") ?? (strNull(issue, "assigned_team") === "developer" ? "Paranjape team" : strNull(issue, "assigned_team") ?? "Unassigned")}</Fact>
            <Fact label="Expected completion">{strNull(issue, "expected_on") ? formatDay(strNull(issue, "expected_on")) : "No date recorded"}</Fact>
            <Fact label="Visible to residents">{bool(issue, "resident_visible") ? "Yes" : "Committee only"}</Fact>
            <Fact label="Latest update">{latest ? `${str(latest, "summary")} ${formatWhen(strNull(latest, "created_at"))}` : "No activity yet."}</Fact>
            {strNull(issue, "resolution_notes") ? <Fact label="Resolution">{str(issue, "resolution_notes")}</Fact> : null}
          </div>
        </Section>

        {can(permissions, "issues.review") || can(permissions, "issues.assign") || nextStatuses.length > 0 ? (
          <Section title="Update the record">
            <div className="grid gap-4 lg:grid-cols-2">
              {nextStatuses.length > 0 ? (
                <form action={transitionIssue} className="space-y-2 rounded-lg border border-line bg-surface p-4">
                  <h3 className="text-sm font-medium">Change status</h3>
                  <input type="hidden" name="issue_id" value={id} />
                  <input type="hidden" name="return" value={returnPath} />
                  <select name="status" className={fieldClass} aria-label="New status">
                    {nextStatuses.map((status) => <option key={status} value={status}>{label(STATUS_LABEL, status)}</option>)}
                  </select>
                  <textarea name="note" className={fieldClass} placeholder="Why this status changed" aria-label="Explanation" />
                  <button className={buttonClass} type="submit">Save status</button>
                </form>
              ) : null}
              {can(permissions, "issues.assign") ? (
                <form action={assignIssue} className="space-y-2 rounded-lg border border-line bg-surface p-4">
                  <h3 className="text-sm font-medium">Assign</h3>
                  <input type="hidden" name="issue_id" value={id} />
                  <input type="hidden" name="return" value={returnPath} />
                  <select name="team" className={fieldClass} defaultValue={strNull(issue, "assigned_team") ?? ""} aria-label="Team">
                    <option value="">No team</option>
                    <option value="committee">Interim committee</option>
                    <option value="developer">Paranjape team</option>
                  </select>
                  <select name="owner" className={fieldClass} aria-label="Owner">
                    <option value="">No individual owner</option>
                    {people.map((person) => <option key={str(person, "id")} value={str(person, "id")}>{str(person, "full_name")}</option>)}
                  </select>
                  <input name="expected_on" type="date" className={fieldClass} aria-label="Expected completion" />
                  <textarea name="note" className={fieldClass} placeholder="Assignment note" aria-label="Assignment note" />
                  <button className={buttonClass} type="submit">Save assignment</button>
                </form>
              ) : null}
              {can(permissions, "issues.review") ? (
                <form action={reviewIssue} className="space-y-2 rounded-lg border border-line bg-surface p-4 lg:col-span-2">
                  <h3 className="text-sm font-medium">Category and visibility</h3>
                  <input type="hidden" name="issue_id" value={id} />
                  <input type="hidden" name="return" value={returnPath} />
                  <select name="subcategory" className={fieldClass} defaultValue={`${str(issue, "category_id")}:${str(issue, "subcategory_id")}`} aria-label="Topic">
                    {records(categories.data).map((row) => {
                      const category = nested(row, "categories")
                      return <option key={str(row, "id")} value={`${str(row, "category_id")}:${str(row, "id")}`}>{str(category ?? {}, "name")} — {str(row, "name")}</option>
                    })}
                  </select>
                  <select name="priority" className={fieldClass} defaultValue={str(issue, "priority")} aria-label="Priority">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm">
                    <input name="resident_visible" type="checkbox" defaultChecked={bool(issue, "resident_visible")} />
                    Visible to residents
                  </label>
                  <button className={quietClass} type="submit">Save review</button>
                </form>
              ) : null}
            </div>
          </Section>
        ) : null}

        <Section title="Conversation">
          {records(comments.data).length === 0 ? <Empty>No comments yet.</Empty> : (
            <ol className="space-y-3">
              {records(comments.data).map((comment) => (
                <li key={str(comment, "id")} className={`rounded-lg border border-line bg-surface p-4 ${strNull(comment, "parent_id") ? "ml-6" : ""}`}>
                  <p className="text-xs text-faint">
                    {str(comment, "author_name")} · {label(ROLE_LABEL, str(comment, "author_role"))} · {formatWhen(strNull(comment, "created_at"))}
                    {bool(comment, "official") ? " · Official update" : ""}
                    {str(comment, "visibility") === "committee" ? " · Committee only" : ""}
                  </p>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-wrap">{str(comment, "body")}</p>
                </li>
              ))}
            </ol>
          )}
          <form action={commentOnIssue} className="mt-4 space-y-2">
            <input type="hidden" name="issue_id" value={id} />
            <input type="hidden" name="return" value={returnPath} />
            <label className="block text-sm" htmlFor="body">Add a comment
              <textarea id="body" name="body" className={`${fieldClass} mt-1 min-h-24`} required />
            </label>
            {people.length > 0 ? (
              <select name="mention" className={fieldClass} aria-label="Mention a member">
                <option value="">Do not mention anyone</option>
                {people.map((person) => <option key={str(person, "id")} value={str(person, "id")}>{str(person, "full_name")}</option>)}
              </select>
            ) : null}
            {can(permissions, "issues.review") ? (
              <select name="visibility" className={fieldClass} aria-label="Who can read this comment">
                <option value="resident">Residents who can see the issue</option>
                <option value="committee">Committee only</option>
              </select>
            ) : null}
            {can(permissions, "issues.official") ? (
              <label className="flex items-center gap-2 text-sm">
                <input name="official" type="checkbox" />
                Mark as an official update
              </label>
            ) : null}
            <button className={buttonClass} type="submit">Post comment</button>
          </form>
        </Section>

        <Section title="Activity">
          <ol className="space-y-3 border-l border-line pl-4">
            {records(activity.data).map((event) => (
              <li key={str(event, "id")}>
                <p className="text-sm">{str(event, "summary")}</p>
                <p className="text-xs text-faint">
                  {str(event, "actor_name")} · {formatWhen(strNull(event, "created_at"))}
                  {strNull(event, "from_value") ? ` · ${label(STATUS_LABEL, strNull(event, "from_value"))} to ${label(STATUS_LABEL, strNull(event, "to_value"))}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Related">
          <div className="grid gap-4 md:grid-cols-2">
            <Related title="Issues" empty="No related issues." rows={records(links.data).map((row) => {
              const related = nested(row, "issues")
              return related ? { href: `/issues/${str(related, "key")}`, label: `${str(related, "key")} ${str(related, "title")}` } : null
            }).filter((row): row is { href: string; label: string } => row !== null)} />
            <Related title="Meetings" empty="No meeting action is linked." rows={records(actions.data).map((row) => {
              const meeting = nested(row, "meetings")
              return meeting ? { href: `/meetings/${str(meeting, "id")}`, label: str(meeting, "title") } : null
            }).filter((row): row is { href: string; label: string } => row !== null)} />
            <Related title="Documents" empty="No documents are linked." rows={records(documents.data).map((row) => ({ href: "/documents", label: str(row, "title") }))} />
            <Related title="Announcements" empty="No announcement is linked." rows={records(announcements.data).map((row) => ({ href: "/announcements", label: str(row, "title") }))} />
            <div>
              <h3 className="mb-2 text-sm font-medium">Files</h3>
              {records(files.data).length === 0 ? <Empty>No files uploaded.</Empty> : (
                <ul className="space-y-1 text-sm">
                  {records(files.data).map((file) => (
                    <li key={str(file, "id")}><a href={`/files/${str(file, "id")}`}>{str(file, "file_name")}</a></li>
                  ))}
                </ul>
              )}
              <form action={uploadFile} className="mt-3 space-y-2">
                <input type="hidden" name="issue_id" value={id} />
                <input type="hidden" name="return" value={returnPath} />
                <input name="file" type="file" aria-label="Upload a supporting file" required />
                <button className={quietClass} type="submit">Upload</button>
              </form>
            </div>
          </div>
          {can(permissions, "issues.review") ? (
            <form action={linkIssue} className="mt-4 flex flex-wrap gap-2">
              <input type="hidden" name="issue_id" value={id} />
              <input type="hidden" name="return" value={returnPath} />
              <input name="related" className={fieldClass} placeholder="Related issue ID" aria-label="Related issue ID" />
              <button className={quietClass} type="submit">Link</button>
            </form>
          ) : null}
          <p className="mt-3 text-xs text-faint">Development milestones stay on the township development page until a confirmed update names one. {label(SOURCE_LABEL, "awaiting_confirmation")} is not a commitment.</p>
        </Section>
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}

function Fact({ label: name, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-sm">
      <span className="block text-xs text-faint">{name}</span>
      {children}
    </p>
  )
}

function Related({ title, rows, empty }: { title: string; rows: { href: string; label: string }[]; empty: string }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      {rows.length === 0 ? <Empty>{empty}</Empty> : (
        <ul className="space-y-1 text-sm">
          {rows.map((row) => <li key={row.href + row.label}><a href={row.href}>{row.label}</a></li>)}
        </ul>
      )}
    </div>
  )
}
