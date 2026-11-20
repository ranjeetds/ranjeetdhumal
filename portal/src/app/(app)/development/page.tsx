import type { Metadata } from "next"
import { Badge, Empty, PageHeader } from "@/components/ui"
import { message, records, rethrowRedirect, str } from "@/lib/rows"
import { requireUser } from "@/lib/session"

export const metadata: Metadata = { title: "Township Development" }

export default async function DevelopmentPage() {
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase.from("development_items").select("slug, name, summary, status, information_source, expected_on").order("sort")
    if (error) throw new Error(error.message)
    const items = records(data)
    return (
      <>
        <PageHeader title="Township Development" lede="Infrastructure areas. A date or status appears only after someone records it, and the record says where it came from." />
        {items.length === 0 ? <Empty>No development areas have been set up.</Empty> : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {items.map((item) => (
              <li key={str(item, "slug")} className="px-4 py-4">
                <a href={`/development/${str(item, "slug")}`} className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    <span className="block font-medium">{str(item, "name")}</span>
                    <span className="mt-1 block text-sm text-muted">{str(item, "summary")}</span>
                  </span>
                  <Badge value={str(item, "status")} />
                </a>
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
