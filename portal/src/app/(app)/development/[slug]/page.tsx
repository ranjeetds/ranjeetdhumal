import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Badge, Empty, Notice, PageHeader, Section, buttonClass, fieldClass } from "@/components/ui"
import { formatDay, formatWhen, one } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { isRecord, message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { addDevelopmentUpdate, addMilestone } from "@/server/actions"

export const metadata: Metadata = { title: "Development area" }

export default async function DevelopmentItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const { slug } = await params
    const query = await searchParams
    const { supabase, permissions } = await requireUser()
    const { data, error } = await supabase.from("development_items").select("id, slug, name, summary, status, information_source, responsible_party, started_on, expected_on, updated_at").eq("slug", slug).maybeSingle()
    if (error) throw new Error(error.message)
    if (!isRecord(data)) notFound()
    const item = data
    const [milestones, updates] = await Promise.all([
      supabase.from("milestones").select("id, name, status, information_source, expected_on, completed_on").eq("item_id", str(item, "id")).order("sort"),
      supabase.from("development_updates").select("id, body, source, status, expected_on, author_name, author_role, created_at").eq("item_id", str(item, "id")).order("created_at", { ascending: false }),
    ])
    if (milestones.error) throw new Error(milestones.error.message)
    if (updates.error) throw new Error(updates.error.message)
    const path = `/development/${slug}`
    const expected = strNull(item, "expected_on")
    return (
      <>
        <PageHeader title={str(item, "name")} lede={str(item, "summary")} />
        <Notice error={one(query.error)} notice={one(query.notice)} />
        <dl className="grid gap-3 rounded-lg border border-line bg-surface p-4 text-sm md:grid-cols-2">
          <div><dt className="text-xs text-faint">Status</dt><dd className="mt-1"><Badge value={str(item, "status")} /></dd></div>
          <div><dt className="text-xs text-faint">Source of the current status</dt><dd className="mt-1"><Badge value={str(item, "information_source")} kind="source" /></dd></div>
          <div><dt className="text-xs text-faint">Responsible party</dt><dd>{strNull(item, "responsible_party") ?? "Not recorded"}</dd></div>
          <div><dt className="text-xs text-faint">Expected completion</dt><dd>{expected ? `${formatDay(expected)} · ${str(item, "information_source").replaceAll("_", " ")}` : "Unknown"}</dd></div>
          <div><dt className="text-xs text-faint">Last updated</dt><dd>{formatWhen(strNull(item, "updated_at"))}</dd></div>
        </dl>
        <Section title="Milestones">
          {records(milestones.data).length === 0 ? <Empty>No milestones have been added. None are implied.</Empty> : (
            <ul className="space-y-2">
              {records(milestones.data).map((milestone) => (
                <li key={str(milestone, "id")} className="rounded-md border border-line bg-surface px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>{str(milestone, "name")}</span>
                    <Badge value={str(milestone, "status")} />
                  </div>
                  <p className="mt-1 text-xs text-faint">
                    {str(milestone, "information_source").replaceAll("_", " ")}
                    {strNull(milestone, "expected_on") ? ` · expected ${formatDay(strNull(milestone, "expected_on"))}` : " · no expected date"}
                    {strNull(milestone, "completed_on") ? ` · completed ${formatDay(strNull(milestone, "completed_on"))}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>
        <Section title="Updates">
          {records(updates.data).length === 0 ? <Empty>No update has been recorded. Nothing here is a developer commitment.</Empty> : (
            <ol className="space-y-3">
              {records(updates.data).map((update) => (
                <li key={str(update, "id")} className="rounded-lg border border-line bg-surface p-4 text-sm">
                  <p className="text-xs text-faint">{str(update, "author_name")} · {formatWhen(strNull(update, "created_at"))} · <Badge value={str(update, "source")} kind="source" /></p>
                  <p className="mt-2 leading-6 whitespace-pre-wrap">{str(update, "body")}</p>
                </li>
              ))}
            </ol>
          )}
        </Section>
        {can(permissions, "development.update") ? (
          <Section title="Record an update">
            <form action={addDevelopmentUpdate} className="max-w-2xl space-y-2">
              <input type="hidden" name="item_id" value={str(item, "id")} />
              <input type="hidden" name="return" value={path} />
              <select name="milestone_id" className={fieldClass} aria-label="Milestone">
                <option value="">Whole area, not one milestone</option>
                {records(milestones.data).map((milestone) => <option key={str(milestone, "id")} value={str(milestone, "id")}>{str(milestone, "name")}</option>)}
              </select>
              <select name="source" className={fieldClass} defaultValue="awaiting_confirmation" aria-label="Where this information came from">
                <option value="awaiting_confirmation">Awaiting confirmation</option>
                <option value="developer_provided">Developer-provided, not yet confirmed</option>
                <option value="committee_observation">Committee observation</option>
                <option value="confirmed">Confirmed</option>
              </select>
              <select name="status" className={fieldClass} aria-label="Status to record">
                <option value="">Leave the status unchanged</option>
                <option value="awaiting_confirmation">Awaiting confirmation</option>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
              <input name="expected_on" type="date" className={fieldClass} aria-label="Expected date, if one was given" />
              <textarea name="body" className={`${fieldClass} min-h-24`} required placeholder="What was said, and who said it" />
              <button className={buttonClass} type="submit">Save update</button>
            </form>
            <form action={addMilestone} className="mt-4 flex max-w-2xl gap-2">
              <input type="hidden" name="item_id" value={str(item, "id")} />
              <input type="hidden" name="return" value={path} />
              <input name="name" className={fieldClass} placeholder="Add a milestone checklist item" aria-label="Milestone name" required />
              <button className={buttonClass} type="submit">Add</button>
            </form>
          </Section>
        ) : null}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
