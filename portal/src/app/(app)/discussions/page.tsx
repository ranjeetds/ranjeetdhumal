import type { Metadata } from "next"
import { Empty, Notice, PageHeader, buttonClass, fieldClass } from "@/components/ui"
import { formatWhen, one } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { createDiscussion } from "@/server/actions"

export const metadata: Metadata = { title: "Discussions" }

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase, permissions } = await requireUser()
    const { data, error } = await supabase.from("discussions").select("id, title, author_name, pinned, locked, updated_at, visibility").order("pinned", { ascending: false }).order("updated_at", { ascending: false })
    if (error) throw new Error(error.message)
    const topics = records(data)
    return (
      <>
        <PageHeader title="Discussions" lede="Township coordination that does not need an issue number yet." />
        <Notice error={one(params.error)} notice={one(params.notice)} />
        {topics.length === 0 ? <Empty>No discussions yet.</Empty> : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {topics.map((topic) => (
              <li key={str(topic, "id")} className="px-4 py-3 text-sm">
                <a href={`/discussions/${str(topic, "id")}`}>{str(topic, "title")}</a>
                <p className="text-xs text-faint">
                  {str(topic, "author_name")} · {formatWhen(strNull(topic, "updated_at"))}
                  {topic.pinned === true ? " · Pinned" : ""}
                  {topic.locked === true ? " · Locked" : ""}
                  {str(topic, "visibility") === "committee" ? " · Committee only" : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
        {can(permissions, "discussions.create") ? (
          <form action={createDiscussion} className="mt-6 max-w-2xl space-y-2">
            <h2 className="text-sm font-semibold">Start a discussion</h2>
            <input name="title" className={fieldClass} placeholder="Title" aria-label="Title" required />
            <textarea name="body" className={`${fieldClass} min-h-24`} placeholder="Opening note" aria-label="Opening note" required />
            {can(permissions, "discussions.moderate") ? (
              <select name="visibility" className={fieldClass} aria-label="Visibility">
                <option value="resident">Residents</option>
                <option value="committee">Committee only</option>
              </select>
            ) : null}
            <button className={buttonClass} type="submit">Start</button>
          </form>
        ) : null}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
