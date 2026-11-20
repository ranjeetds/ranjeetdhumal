import type { Metadata } from "next"
import { Empty, PageHeader, quietClass } from "@/components/ui"
import { formatWhen } from "@/lib/format"
import { message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { requireUser } from "@/lib/session"
import { markRead } from "@/server/actions"

export const metadata: Metadata = { title: "Notifications" }

export default async function NotificationsPage() {
  try {
    const { supabase, profile } = await requireUser()
    const { data, error } = await supabase.from("notifications").select("id, title, body, href, read_at, created_at").eq("user_id", profile.id).order("created_at", { ascending: false }).limit(50)
    if (error) throw new Error(error.message)
    const notes = records(data)
    return (
      <>
        <PageHeader title="Notifications" lede="In-app notices for assignments, official updates, and the discussions you follow. Email delivery is not connected yet.">
          <form action={markRead}><button className={quietClass} type="submit">Mark all read</button></form>
        </PageHeader>
        {notes.length === 0 ? <Empty>No notifications yet.</Empty> : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {notes.map((note) => (
              <li key={str(note, "id")} className="px-4 py-3 text-sm">
                <a href={strNull(note, "href") ?? "/notifications"} className={strNull(note, "read_at") ? "text-muted" : "font-medium"}>{str(note, "title")}</a>
                <p className="text-muted">{str(note, "body")}</p>
                <p className="text-xs text-faint">{formatWhen(strNull(note, "created_at"))}</p>
              </li>
            ))}
          </ul>
        )}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
