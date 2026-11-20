import type { Metadata } from "next"
import { Badge, Empty, PageHeader, Panel } from "@/components/ui"
import { formatDay, formatWhen, label, STATUS_LABEL } from "@/lib/format"
import { message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { requireUser } from "@/lib/session"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  try {
    const { supabase, profile } = await requireUser()
    const today = new Date().toISOString().slice(0, 10)
    const open = ["draft", "submitted", "under_review", "assigned", "acknowledged", "in_progress", "awaiting_information", "awaiting_developer", "reopened"]

    if (profile.role === "developer") {
      const { data, error } = await supabase
        .from("issues")
        .select("key, title, status, expected_on, updated_at")
        .eq("assigned_team", "developer")
        .is("archived_at", null)
        .order("updated_at", { ascending: false })
        .limit(50)
      if (error) throw new Error(error.message)
      const issues = records(data)
      const waiting = issues.filter((issue) => str(issue, "status") === "assigned")
      const active = issues.filter((issue) => ["acknowledged", "in_progress", "awaiting_developer"].includes(str(issue, "status")))
      const overdue = issues.filter((issue) => {
        const expected = strNull(issue, "expected_on")
        return expected !== null && expected < today && !["resolved", "closed"].includes(str(issue, "status"))
      })
      return (
        <>
          <PageHeader title="Dashboard" lede="Issues currently with the Paranjape team. Counts come from those records." />
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Awaiting acknowledgement" value={waiting.length} />
            <Metric label="In progress with the team" value={active.length} />
            <Metric label="Past the expected date" value={overdue.length} />
          </div>
          <IssueList title="Assigned work" issues={issues.slice(0, 8)} empty="No issues are assigned to the Paranjape team." />
        </>
      )
    }

    if (profile.role === "resident") {
      const [announcements, mine, recent, meetings, updates, documents] = await Promise.all([
        supabase.from("announcements").select("id, title, published_at, priority").eq("visibility", "resident").order("published_at", { ascending: false }).limit(4),
        supabase.from("issues").select("key, title, status, updated_at").eq("raised_by", profile.id).is("archived_at", null).order("updated_at", { ascending: false }).limit(6),
        supabase.from("issues").select("key, title, status, updated_at").is("archived_at", null).order("updated_at", { ascending: false }).limit(6),
        supabase.from("meetings").select("id, title, starts_at, location").eq("status", "published").gte("starts_at", new Date().toISOString()).order("starts_at").limit(4),
        supabase.from("development_updates").select("id, body, source, created_at, development_items(name, slug)").order("created_at", { ascending: false }).limit(4),
        supabase.from("documents").select("id, title, created_at").order("created_at", { ascending: false }).limit(4),
      ])
      for (const result of [announcements, mine, recent, meetings, updates, documents]) {
        if (result.error) throw new Error(result.error.message)
      }
      return (
        <>
          <PageHeader title="Dashboard" lede="Announcements, your issues, and the latest records you are allowed to see." />
          <SimpleList title="Announcements" empty="No announcements yet." rows={records(announcements.data).map((row) => ({ href: "/announcements", title: str(row, "title"), meta: formatWhen(strNull(row, "published_at")) }))} />
          <IssueList title="Your issues" issues={records(mine.data)} empty="You have not raised an issue." />
          <IssueList title="Recently updated" issues={records(recent.data)} empty="No issues yet." />
          <SimpleList title="Upcoming meetings" empty="No published meetings are scheduled." rows={records(meetings.data).map((row) => ({ href: `/meetings/${str(row, "id")}`, title: str(row, "title"), meta: formatWhen(strNull(row, "starts_at")) }))} />
          <SimpleList title="Development updates" empty="No development update has been recorded." rows={records(updates.data).map((row) => ({ href: "/development", title: str(row, "body"), meta: label({ awaiting_confirmation: "Awaiting confirmation", developer_provided: "Developer-provided", committee_observation: "Committee observation", confirmed: "Confirmed" }, str(row, "source")) }))} />
          <SimpleList title="Documents" empty="No documents yet." rows={records(documents.data).map((row) => ({ href: "/documents", title: str(row, "title"), meta: formatWhen(strNull(row, "created_at")) }))} />
        </>
      )
    }

    const { data, error } = await supabase
      .from("issues")
      .select("key, title, status, priority, expected_on, assigned_team, updated_at, categories(name)")
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(200)
    if (error) throw new Error(error.message)
    const issues = records(data)
    const counts = new Map<string, number>()
    for (const issue of issues) counts.set(str(issue, "status"), (counts.get(str(issue, "status")) ?? 0) + 1)
    const awaiting = issues.filter((issue) => str(issue, "status") === "awaiting_developer" || (str(issue, "assigned_team") === "developer" && str(issue, "status") === "assigned"))
    const overdue = issues.filter((issue) => {
      const expected = strNull(issue, "expected_on")
      return expected !== null && expected < today && !["resolved", "closed"].includes(str(issue, "status"))
    })
    const resolved = issues.filter((issue) => str(issue, "status") === "resolved" || str(issue, "status") === "closed")
    const high = issues.filter((issue) => ["high", "urgent"].includes(str(issue, "priority")) && open.includes(str(issue, "status")))
    return (
      <>
        <PageHeader title="Dashboard" lede="Open work across the township. Every figure is a count of records you can see." />
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Open issues" value={issues.filter((issue) => open.includes(str(issue, "status"))).length} />
          <Metric label="Waiting on the developer" value={awaiting.length} />
          <Metric label="Past the expected date" value={overdue.length} />
          <Metric label="Resolved or closed" value={resolved.length} />
        </div>
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">By status</h2>
          {issues.length === 0 ? <Empty>No issues have been raised.</Empty> : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {[...counts.entries()].map(([status, count]) => (
                <li key={status} className="flex items-center justify-between rounded-md border border-line bg-surface px-3 py-2 text-sm">
                  <span>{label(STATUS_LABEL, status)}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <IssueList title="High priority" issues={high.slice(0, 6)} empty="No high-priority issues are open." />
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}

function Metric({ label: name, value }: { label: string; value: number }) {
  return (
    <Panel>
      <p className="text-sm text-muted">{name}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </Panel>
  )
}

function IssueList({ title, issues, empty }: { title: string; issues: Record<string, unknown>[]; empty: string }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {issues.length === 0 ? <Empty>{empty}</Empty> : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
          {issues.map((issue) => (
            <li key={str(issue, "key")} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <a href={`/issues/${str(issue, "key")}`} className="min-w-0">
                <span className="font-mono text-xs text-faint">{str(issue, "key")}</span>
                <span className="mt-0.5 block truncate">{str(issue, "title")}</span>
              </a>
              <Badge value={str(issue, "status")} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SimpleList({ title, rows, empty }: { title: string; rows: { href: string; title: string; meta: string }[]; empty: string }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {rows.length === 0 ? <Empty>{empty}</Empty> : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
          {rows.map((row) => (
            <li key={`${row.href}-${row.title}`} className="px-4 py-3 text-sm">
              <a href={row.href}>{row.title}</a>
              <p className="text-xs text-faint">{row.meta}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
