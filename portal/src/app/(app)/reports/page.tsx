import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Empty, PageHeader, quietClass } from "@/components/ui"
import { STATUS_LABEL, label } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { message, nested, records, rethrowRedirect, str, strNull } from "@/lib/rows"

export const metadata: Metadata = { title: "Reports" }

export default async function ReportsPage() {
  try {
    const { supabase, permissions } = await requireUser()
    if (!can(permissions, "reports.view")) redirect("/dashboard")
    const { data, error } = await supabase
      .from("issues")
      .select("status, priority, expected_on, created_at, assigned_team, categories(name)")
      .is("archived_at", null)
    if (error) throw new Error(error.message)
    const issues = records(data)
    const byStatus = countBy(issues, "status")
    const byCategory = new Map<string, number>()
    for (const issue of issues) {
      const name = str(nested(issue, "categories") ?? {}, "name") || "Uncategorised"
      byCategory.set(name, (byCategory.get(name) ?? 0) + 1)
    }
    const today = new Date().toISOString().slice(0, 10)
    const awaiting = issues.filter((issue) => str(issue, "status") === "awaiting_developer" || (str(issue, "assigned_team") === "developer" && str(issue, "status") === "assigned")).length
    const overdue = issues.filter((issue) => {
      const expected = strNull(issue, "expected_on")
      return expected !== null && expected < today && !["resolved", "closed"].includes(str(issue, "status"))
    }).length
    const activity = await supabase.from("activity_events").select("issue_id, to_value, created_at").eq("to_value", "acknowledged")
    if (activity.error) throw new Error(activity.error.message)
    const acknowledged = records(activity.data)
    return (
      <>
        <PageHeader title="Reports" lede="Counts of issues you are allowed to see. There is no sample data.">
          <a className={quietClass} href="/reports/export">Download CSV</a>
        </PageHeader>
        {issues.length === 0 ? <Empty>No issues have been recorded, so there is no average time to show.</Empty> : (
          <div className="grid gap-6 md:grid-cols-2">
            <CountList title="By status" rows={[...byStatus.entries()].map(([key, value]) => [label(STATUS_LABEL, key), value])} />
            <CountList title="By category" rows={[...byCategory.entries()]} />
            <CountList title="Queues" rows={[["Awaiting the developer", awaiting], ["Past the expected date", overdue], ["Acknowledged transitions recorded", acknowledged.length]]} />
          </div>
        )}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}

function countBy(rows: Record<string, unknown>[], key: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const row of rows) counts.set(str(row, key), (counts.get(str(row, key)) ?? 0) + 1)
  return counts
}

function CountList({ title, rows }: { title: string; rows: (readonly [string, number])[] }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold">{title}</h2>
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {rows.map(([name, value]) => (
          <li key={name} className="flex justify-between px-3 py-2 text-sm"><span>{name}</span><span>{value}</span></li>
        ))}
      </ul>
    </section>
  )
}
