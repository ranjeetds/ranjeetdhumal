import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Empty, Notice, PageHeader, buttonClass, fieldClass, quietClass } from "@/components/ui"
import { formatWhen, one } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { bool, isRecord, message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { convertDiscussion, flagDiscussion, postDiscussion } from "@/server/actions"

export const metadata: Metadata = { title: "Discussion" }

export default async function DiscussionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const { id } = await params
    const query = await searchParams
    const { supabase, permissions } = await requireUser()
    const { data, error } = await supabase.from("discussions").select("id, title, body, author_name, pinned, locked, visibility, converted_issue_id, created_at").eq("id", id).maybeSingle()
    if (error) throw new Error(error.message)
    if (!isRecord(data)) notFound()
    const posts = await supabase.from("discussion_posts").select("id, author_name, body, created_at").eq("discussion_id", id).order("created_at")
    if (posts.error) throw new Error(posts.error.message)
    const path = `/discussions/${id}`
    let issueKey = ""
    if (strNull(data, "converted_issue_id")) {
      const issue = await supabase.from("issues").select("key").eq("id", str(data, "converted_issue_id")).maybeSingle()
      if (isRecord(issue.data)) issueKey = str(issue.data, "key")
    }
    return (
      <>
        <PageHeader title={str(data, "title")} lede={`${str(data, "author_name")} · ${formatWhen(strNull(data, "created_at"))}${str(data, "visibility") === "committee" ? " · Committee only" : ""}`} />
        <Notice error={one(query.error)} notice={one(query.notice)} />
        <p className="max-w-2xl text-sm leading-6 whitespace-pre-wrap">{str(data, "body")}</p>
        {issueKey ? <p className="mt-3 text-sm"><a href={`/issues/${issueKey}`}>Opened as {issueKey}</a></p> : null}
        <ol className="mt-6 space-y-3">
          {records(posts.data).length === 0 ? <Empty>No replies yet.</Empty> : records(posts.data).map((post) => (
            <li key={str(post, "id")} className="rounded-lg border border-line bg-surface p-4 text-sm">
              <p className="text-xs text-faint">{str(post, "author_name")} · {formatWhen(strNull(post, "created_at"))}</p>
              <p className="mt-2 whitespace-pre-wrap">{str(post, "body")}</p>
            </li>
          ))}
        </ol>
        {!bool(data, "locked") || can(permissions, "discussions.moderate") ? (
          <form action={postDiscussion} className="mt-4 max-w-2xl space-y-2">
            <input type="hidden" name="discussion_id" value={id} />
            <input type="hidden" name="return" value={path} />
            <textarea name="body" className={`${fieldClass} min-h-24`} required aria-label="Reply" />
            <button className={buttonClass} type="submit">Reply</button>
          </form>
        ) : <p className="mt-4 text-sm text-muted">This discussion is locked.</p>}
        {can(permissions, "discussions.moderate") ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <form action={flagDiscussion}>
              <input type="hidden" name="discussion_id" value={id} />
              <input type="hidden" name="return" value={path} />
              <input type="hidden" name="pinned" value={bool(data, "pinned") ? "" : "on"} />
              <input type="hidden" name="locked" value={bool(data, "locked") ? "on" : ""} />
              <button className={quietClass} type="submit">{bool(data, "pinned") ? "Unpin" : "Pin"}</button>
            </form>
            <form action={flagDiscussion}>
              <input type="hidden" name="discussion_id" value={id} />
              <input type="hidden" name="return" value={path} />
              <input type="hidden" name="pinned" value={bool(data, "pinned") ? "on" : ""} />
              <input type="hidden" name="locked" value={bool(data, "locked") ? "" : "on"} />
              <button className={quietClass} type="submit">{bool(data, "locked") ? "Unlock" : "Lock"}</button>
            </form>
            {!issueKey ? (
              <form action={convertDiscussion}>
                <input type="hidden" name="discussion_id" value={id} />
                <input type="hidden" name="return" value={path} />
                <button className={quietClass} type="submit">Turn into an issue</button>
              </form>
            ) : null}
          </div>
        ) : null}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
