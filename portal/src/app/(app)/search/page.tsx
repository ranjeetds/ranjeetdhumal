import type { Metadata } from "next"
import { Empty, PageHeader } from "@/components/ui"
import { one, searchTerm } from "@/lib/format"
import { message, records, rethrowRedirect, str } from "@/lib/rows"
import { requireUser } from "@/lib/session"

export const metadata: Metadata = { title: "Search" }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const query = searchTerm(one((await searchParams).q))
    const { supabase } = await requireUser()
    if (!query) {
      return <PageHeader title="Search" lede="Search issues, discussions, meetings, documents, announcements, and development areas." />
    }
    const { data, error } = await supabase.rpc("search_records", { p_query: query })
    if (error) throw new Error(error.message)
    const rows = records(data)
    return (
      <>
        <PageHeader title="Search" lede={`Results for “${query}”. Only records you can already open are included.`} />
        {rows.length === 0 ? <Empty>Nothing matched.</Empty> : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {rows.map((row) => (
              <li key={`${str(row, "kind")}-${str(row, "href")}-${str(row, "title")}`} className="px-4 py-3 text-sm">
                <p className="text-xs text-faint">{str(row, "kind")}</p>
                <a href={str(row, "href")}>{str(row, "title")}</a>
                {str(row, "summary") ? <p className="text-muted">{str(row, "summary")}</p> : null}
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
