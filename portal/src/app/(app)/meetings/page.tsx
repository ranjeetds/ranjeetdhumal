import type { Metadata } from "next"
import { Badge, Empty, Notice, PageHeader, buttonClass, fieldClass } from "@/components/ui"
import { formatWhen, one } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { createMeeting } from "@/server/actions"

export const metadata: Metadata = { title: "Meetings" }

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase, permissions } = await requireUser()
    const { data, error } = await supabase.from("meetings").select("id, title, starts_at, location, status").order("starts_at", { ascending: false })
    if (error) throw new Error(error.message)
    return (
      <>
        <PageHeader title="Meetings" lede="Agendas, attendance, decisions, and action items." />
        <Notice error={one(params.error)} notice={one(params.notice)} />
        {records(data).length === 0 ? <Empty>No meetings have been scheduled.</Empty> : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {records(data).map((meeting) => (
              <li key={str(meeting, "id")} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <a href={`/meetings/${str(meeting, "id")}`}>
                  <span className="block">{str(meeting, "title")}</span>
                  <span className="text-xs text-faint">{formatWhen(strNull(meeting, "starts_at"))}{strNull(meeting, "location") ? ` · ${str(meeting, "location")}` : ""}</span>
                </a>
                <Badge value={str(meeting, "status")} />
              </li>
            ))}
          </ul>
        )}
        {can(permissions, "meetings.manage") ? (
          <form action={createMeeting} className="mt-6 grid max-w-2xl gap-2">
            <h2 className="text-sm font-semibold">Schedule a meeting</h2>
            <input name="title" className={fieldClass} required aria-label="Title" placeholder="Title" />
            <input name="starts_at" type="datetime-local" className={fieldClass} required aria-label="Date and time" />
            <input name="location" className={fieldClass} aria-label="Location" placeholder="Location" />
            <input name="link" className={fieldClass} aria-label="Meeting link" placeholder="Meeting link" />
            <button className={buttonClass} type="submit">Schedule</button>
          </form>
        ) : null}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
