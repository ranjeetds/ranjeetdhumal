import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Badge, Empty, Notice, PageHeader, Section, buttonClass, fieldClass } from "@/components/ui"
import { formatDay, formatWhen, one } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { isRecord, message, nested, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { addAction, addAgenda, saveMeeting, updateAction } from "@/server/actions"

export const metadata: Metadata = { title: "Meeting" }

export default async function MeetingPage({
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
    const { data, error } = await supabase.from("meetings").select("id, title, starts_at, location, link, status, notes").eq("id", id).maybeSingle()
    if (error) throw new Error(error.message)
    if (!isRecord(data)) notFound()
    const [agenda, actions, people] = await Promise.all([
      supabase.from("agenda_items").select("id, body").eq("meeting_id", id).order("sort"),
      supabase.from("action_items").select("id, body, owner_name, expected_on, status, issue_id, issues(key)").eq("meeting_id", id),
      can(permissions, "members.view") ? supabase.rpc("member_directory") : Promise.resolve({ data: [], error: null }),
    ])
    if (agenda.error) throw new Error(agenda.error.message)
    if (actions.error) throw new Error(actions.error.message)
    if (people.error) throw new Error(people.error.message)
    const path = `/meetings/${id}`
    const manage = can(permissions, "meetings.manage")
    return (
      <>
        <PageHeader title={str(data, "title")} lede={`${formatWhen(strNull(data, "starts_at"))}${strNull(data, "location") ? ` · ${str(data, "location")}` : ""}${strNull(data, "link") ? "" : ""}`} />
        <Notice error={one(query.error)} notice={one(query.notice)} />
        {strNull(data, "link") ? <p className="text-sm"><a href={str(data, "link")}>Meeting link</a></p> : null}
        <Section title="Agenda">
          {records(agenda.data).length === 0 ? <Empty>No agenda items yet.</Empty> : (
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {records(agenda.data).map((item) => <li key={str(item, "id")}>{str(item, "body")}</li>)}
            </ol>
          )}
          {manage ? (
            <form action={addAgenda} className="mt-3 flex gap-2">
              <input type="hidden" name="meeting_id" value={id} />
              <input type="hidden" name="return" value={path} />
              <input name="body" className={fieldClass} required aria-label="Agenda item" placeholder="Agenda item" />
              <button className={buttonClass} type="submit">Add</button>
            </form>
          ) : null}
        </Section>
        <Section title="Decisions and actions">
          {records(actions.data).length === 0 ? <Empty>No actions recorded.</Empty> : (
            <ul className="space-y-2">
              {records(actions.data).map((action) => {
                const issue = nested(action, "issues")
                return (
                  <li key={str(action, "id")} className="rounded-md border border-line bg-surface px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>{str(action, "body")}</span>
                      <Badge value={str(action, "status")} />
                    </div>
                    <p className="mt-1 text-xs text-faint">
                      {strNull(action, "owner_name") ?? "No owner"}
                      {strNull(action, "expected_on") ? ` · ${formatDay(strNull(action, "expected_on"))}` : " · no expected date"}
                      {issue ? ` · ${str(issue, "key")}` : ""}
                    </p>
                    {manage ? (
                      <form action={updateAction} className="mt-2 flex gap-2">
                        <input type="hidden" name="action_id" value={str(action, "id")} />
                        <input type="hidden" name="return" value={path} />
                        <select name="status" className={fieldClass} defaultValue={str(action, "status")} aria-label="Action status">
                          <option value="open">Open</option>
                          <option value="done">Done</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button className={buttonClass} type="submit">Update</button>
                      </form>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
          {manage ? (
            <form action={addAction} className="mt-4 grid max-w-2xl gap-2">
              <input type="hidden" name="meeting_id" value={id} />
              <input type="hidden" name="return" value={path} />
              <textarea name="body" className={fieldClass} required aria-label="Action" placeholder="Action" />
              <select name="owner" className={fieldClass} aria-label="Owner">
                <option value="">No owner yet</option>
                {records(people.data).map((person) => <option key={str(person, "id")} value={str(person, "id")}>{str(person, "full_name")}</option>)}
              </select>
              <input name="expected_on" type="date" className={fieldClass} aria-label="Expected date" />
              <input name="issue_id" className={fieldClass} aria-label="Linked issue key" placeholder="Linked issue, for example INF-001" />
              <button className={buttonClass} type="submit">Add action</button>
            </form>
          ) : null}
        </Section>
        <Section title="Minutes">
          {str(data, "notes") ? <p className="text-sm whitespace-pre-wrap">{str(data, "notes")}</p> : <Empty>Minutes have not been written.</Empty>}
          {manage ? (
            <form action={saveMeeting} className="mt-3 max-w-2xl space-y-2">
              <input type="hidden" name="meeting_id" value={id} />
              <input type="hidden" name="return" value={path} />
              <select name="status" className={fieldClass} defaultValue={str(data, "status")} aria-label="Minutes status">
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="published">Published for residents</option>
              </select>
              <textarea name="notes" className={`${fieldClass} min-h-28`} defaultValue={str(data, "notes")} aria-label="Minutes" />
              <button className={buttonClass} type="submit">Save minutes</button>
            </form>
          ) : null}
        </Section>
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
