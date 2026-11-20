import type { Metadata } from "next"
import { Notice, PageHeader, buttonClass, fieldClass } from "@/components/ui"
import { one } from "@/lib/format"
import { message, records, rethrowRedirect, str } from "@/lib/rows"
import { requireUser } from "@/lib/session"
import { createIssue } from "@/server/actions"

export const metadata: Metadata = { title: "Raise an issue" }

export default async function NewIssuePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase } = await requireUser()
    const { data, error } = await supabase
      .from("subcategories")
      .select("id, name, category_id, categories(id, name)")
      .eq("archived", false)
      .order("sort")
    if (error) throw new Error(error.message)
    const groups = new Map<string, { name: string; items: { id: string; name: string }[] }>()
    for (const row of records(data)) {
      const category = row.categories
      const categoryRecord = category && typeof category === "object" && !Array.isArray(category) ? category : null
      const categoryId = categoryRecord && "id" in categoryRecord && typeof categoryRecord.id === "string" ? categoryRecord.id : str(row, "category_id")
      const categoryName = categoryRecord && "name" in categoryRecord && typeof categoryRecord.name === "string" ? categoryRecord.name : "Category"
      const group = groups.get(categoryId) ?? { name: categoryName, items: [] }
      group.items.push({ id: str(row, "id"), name: str(row, "name") })
      groups.set(categoryId, group)
    }
    return (
      <>
        <PageHeader title="Raise an issue" lede="Describe what needs attention. The committee reviews the category, owner, and status." />
        <Notice error={one(params.error)} />
        <form action={createIssue} className="max-w-2xl space-y-4">
          <label className="block text-sm" htmlFor="title">
            Title
            <input id="title" name="title" className={`${fieldClass} mt-1`} required />
          </label>
          <label className="block text-sm" htmlFor="description">
            What happened
            <textarea id="description" name="description" className={`${fieldClass} mt-1 min-h-32`} required />
          </label>
          <label className="block text-sm" htmlFor="subcategory">
            Topic
            <select id="subcategory" name="subcategory" className={`${fieldClass} mt-1`} required>
              <option value="">Choose a topic</option>
              {[...groups.entries()].map(([id, group]) => (
                <optgroup key={id} label={group.name}>
                  {group.items.map((item) => (
                    <option key={item.id} value={`${id}:${item.id}`}>{item.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="block text-sm" htmlFor="priority">
            Priority
            <select id="priority" name="priority" className={`${fieldClass} mt-1`} defaultValue="normal">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="resident_visible" type="checkbox" defaultChecked />
            Other residents can see this issue
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="draft" type="checkbox" />
            Save as a draft
          </label>
          <button className={buttonClass} type="submit">Submit</button>
        </form>
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
