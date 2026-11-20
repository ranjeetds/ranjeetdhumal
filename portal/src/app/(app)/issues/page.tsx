import type { Metadata } from "next"
import { Badge, Empty, Notice, PageHeader, buttonClass, fieldClass, quietClass } from "@/components/ui"
import { formatDay, one, searchTerm } from "@/lib/format"
import { message, nested, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { requireUser } from "@/lib/session"

export const metadata: Metadata = { title: "Issues & Requests" }

const PAGE_SIZE = 25

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase, profile } = await requireUser()
    const view = one(params.view) === "list" ? "list" : "table"
    const page = Math.max(1, Number(one(params.page)) || 1)
    const q = searchTerm(one(params.q))
    const status = one(params.status)
    const priority = one(params.priority)
    const team = one(params.team)
    const category = one(params.category)
    const scope = one(params.scope)
    const from = (page - 1) * PAGE_SIZE
    const today = new Date().toISOString().slice(0, 10)

    let query = supabase
      .from("issues")
      .select("id, key, title, status, priority, assigned_team, assignee_name, expected_on, updated_at, categories(name)", { count: "exact" })
      .order("updated_at", { ascending: false })
    if (scope !== "archived") query = query.is("archived_at", null)
    if (status) query = query.eq("status", status)
    if (priority) query = query.eq("priority", priority)
    if (team) query = query.eq("assigned_team", team)
    if (category) query = query.eq("category_id", category)
    if (q) query = query.or(`key.ilike.%${q}%,title.ilike.%${q}%`)
    if (scope === "mine") query = query.eq("raised_by", profile.id)
    if (scope === "overdue") {
      query = query.lt("expected_on", today).not("status", "in", "(resolved,closed)")
    }
    if (scope === "recent") {
      const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      query = query.gte("updated_at", since)
    }
    if (scope === "followed") {
      const follows = await supabase.from("issue_follows").select("issue_id").eq("user_id", profile.id)
      if (follows.error) throw new Error(follows.error.message)
      const ids = records(follows.data).map((row) => str(row, "issue_id")).filter(Boolean)
      if (ids.length === 0) {
        return <Frame params={params} view={view} categories={[]}><Empty>You are not following any issues.</Empty></Frame>
      }
      query = query.in("id", ids)
    }
    const categories = await supabase.from("categories").select("id, name").eq("archived", false).order("sort")
    if (categories.error) throw new Error(categories.error.message)
    const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1)
    if (error) throw new Error(error.message)
    const issues = records(data)
    const total = count ?? 0

    return (
      <Frame params={params} view={view} categories={records(categories.data)}>
        <Notice error={one(params.error)} notice={one(params.notice)} />
        {issues.length === 0 ? <Empty>No issues match these filters.</Empty> : view === "table" ? (
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-line text-xs text-faint">
                <tr>
                  <th className="px-3 py-2 font-medium">Issue</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Priority</th>
                  <th className="px-3 py-2 font-medium">Team</th>
                  <th className="px-3 py-2 font-medium">Expected</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={str(issue, "id")} className="border-b border-line last:border-0">
                    <td className="px-3 py-3">
                      <a href={`/issues/${str(issue, "key")}`}>
                        <span className="font-mono text-xs text-faint">{str(issue, "key")}</span>
                        <span className="mt-0.5 block">{str(issue, "title")}</span>
                      </a>
                      <span className="text-xs text-faint">{str(nested(issue, "categories") ?? {}, "name")}</span>
                    </td>
                    <td className="px-3 py-3"><Badge value={str(issue, "status")} /></td>
                    <td className="px-3 py-3"><Badge value={str(issue, "priority")} kind="priority" /></td>
                    <td className="px-3 py-3">{strNull(issue, "assignee_name") ?? strNull(issue, "assigned_team") ?? "Unassigned"}</td>
                    <td className="px-3 py-3">{strNull(issue, "expected_on") ? formatDay(strNull(issue, "expected_on")) : "No date"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {issues.map((issue) => (
              <li key={str(issue, "id")} className="flex items-center justify-between gap-3 px-4 py-3">
                <a href={`/issues/${str(issue, "key")}`}>
                  <span className="font-mono text-xs text-faint">{str(issue, "key")}</span>
                  <span className="block text-sm">{str(issue, "title")}</span>
                </a>
                <Badge value={str(issue, "status")} />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-sm text-muted">
          {total === 0 ? "0 issues" : `${from + 1}–${Math.min(from + PAGE_SIZE, total)} of ${total}`}
          {page > 1 ? <a className="ml-3" href={href(params, { page: String(page - 1) })}>Previous</a> : null}
          {from + PAGE_SIZE < total ? <a className="ml-3" href={href(params, { page: String(page + 1) })}>Next</a> : null}
        </p>
      </Frame>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}

function Frame({
  params,
  view,
  categories,
  children,
}: {
  params: Record<string, string | string[] | undefined>
  view: string
  categories: Record<string, unknown>[]
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader title="Issues & Requests" lede="One record for each township matter: an owner, a status, and a history.">
        <a className={buttonClass} href="/issues/new">Raise an issue</a>
      </PageHeader>
      <form className="mb-4 grid gap-2 md:grid-cols-6" action="/issues">
        <input className={fieldClass} name="q" defaultValue={one(params.q)} placeholder="ID or title" aria-label="Search by ID or title" />
        <select className={fieldClass} name="category" defaultValue={one(params.category)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((category) => <option key={str(category, "id")} value={str(category, "id")}>{str(category, "name")}</option>)}
        </select>
        <select className={fieldClass} name="status" defaultValue={one(params.status)} aria-label="Status">
          <option value="">All statuses</option>
          {Object.entries({ submitted: "Submitted", under_review: "Under review", assigned: "Assigned", acknowledged: "Acknowledged", in_progress: "In progress", awaiting_information: "Awaiting information", awaiting_developer: "Awaiting developer", resolved: "Resolved", closed: "Closed", reopened: "Reopened" }).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
        </select>
        <select className={fieldClass} name="priority" defaultValue={one(params.priority)} aria-label="Priority">
          <option value="">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <select className={fieldClass} name="team" defaultValue={one(params.team)} aria-label="Team">
          <option value="">All teams</option>
          <option value="developer">Paranjape team</option>
          <option value="committee">Committee</option>
        </select>
        <select className={fieldClass} name="scope" defaultValue={one(params.scope)} aria-label="Set">
          <option value="">All visible</option>
          <option value="mine">My issues</option>
          <option value="followed">Followed</option>
          <option value="recent">Updated in 14 days</option>
          <option value="overdue">Overdue</option>
          <option value="archived">Archived</option>
        </select>
        <button className={quietClass} type="submit">Apply</button>
        <a className={quietClass} href={href(params, { view: view === "table" ? "list" : "table" })}>{view === "table" ? "List view" : "Table view"}</a>
      </form>
      {children}
    </>
  )
}

function href(params: Record<string, string | string[] | undefined>, patch: Record<string, string>): string {
  const next = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    const single = one(value)
    if (single) next.set(key, single)
  }
  for (const [key, value] of Object.entries(patch)) next.set(key, value)
  const query = next.toString()
  return query ? `/issues?${query}` : "/issues"
}
