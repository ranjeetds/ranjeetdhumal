import type { Metadata } from "next"
import { Badge, Empty, Notice, PageHeader, buttonClass, fieldClass } from "@/components/ui"
import { formatDay, formatWhen, one } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { acknowledge, publishAnnouncement } from "@/server/actions"

export const metadata: Metadata = { title: "Announcements" }

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase, profile, permissions } = await requireUser()
    const { data, error } = await supabase.from("announcements").select("id, title, body, author_name, priority, visibility, published_at, expires_on").order("published_at", { ascending: false })
    if (error) throw new Error(error.message)
    const acks = await supabase.from("announcement_acknowledgements").select("announcement_id").eq("user_id", profile.id)
    if (acks.error) throw new Error(acks.error.message)
    const acknowledged = new Set(records(acks.data).map((row) => str(row, "announcement_id")))
    const today = new Date().toISOString().slice(0, 10)
    return (
      <>
        <PageHeader title="Announcements" lede="Current notices stay at the top. Older ones remain in this list." />
        <Notice error={one(params.error)} notice={one(params.notice)} />
        {records(data).length === 0 ? <Empty>No announcements have been published.</Empty> : (
          <ul className="space-y-3">
            {records(data).map((item) => {
              const expired = strNull(item, "expires_on") !== null && str(item, "expires_on") < today
              return (
                <li key={str(item, "id")} className="rounded-lg border border-line bg-surface p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{str(item, "title")}</h2>
                    <Badge value={str(item, "priority")} kind="priority" />
                    {expired ? <span className="text-xs text-faint">Archived</span> : null}
                    {str(item, "visibility") === "committee" ? <span className="text-xs text-faint">Committee only</span> : null}
                  </div>
                  <p className="mt-1 text-xs text-faint">{str(item, "author_name")} · {formatWhen(strNull(item, "published_at"))}{strNull(item, "expires_on") ? ` · until ${formatDay(strNull(item, "expires_on"))}` : ""}</p>
                  <p className="mt-2 whitespace-pre-wrap leading-6">{str(item, "body")}</p>
                  {str(item, "priority") === "important" && str(item, "visibility") === "resident" ? (
                    <form action={acknowledge} className="mt-3">
                      <input type="hidden" name="id" value={str(item, "id")} />
                      <button className={buttonClass} type="submit" disabled={acknowledged.has(str(item, "id"))}>
                        {acknowledged.has(str(item, "id")) ? "Acknowledged" : "I have read this"}
                      </button>
                    </form>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
        {can(permissions, "announcements.publish") ? (
          <form action={publishAnnouncement} className="mt-6 grid max-w-2xl gap-2">
            <h2 className="text-sm font-semibold">Publish</h2>
            <input name="title" className={fieldClass} required aria-label="Title" placeholder="Title" />
            <textarea name="body" className={`${fieldClass} min-h-24`} required aria-label="Announcement" />
            <select name="priority" className={fieldClass} aria-label="Priority">
              <option value="normal">Normal</option>
              <option value="important">Important — ask residents to acknowledge</option>
            </select>
            <select name="visibility" className={fieldClass} aria-label="Visibility">
              <option value="resident">Residents</option>
              <option value="committee">Committee only</option>
            </select>
            <input name="expires_on" type="date" className={fieldClass} aria-label="Expiry date" />
            <button className={buttonClass} type="submit">Publish</button>
          </form>
        ) : null}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
