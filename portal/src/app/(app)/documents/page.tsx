import type { Metadata } from "next"
import { Empty, Notice, PageHeader, Section, buttonClass, fieldClass } from "@/components/ui"
import { DOCUMENT_CATEGORY, formatDay, formatWhen, label, one, STATUS_LABEL } from "@/lib/format"
import { bool, message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { can, requireUser } from "@/lib/session"
import { registerDocument, updateCorrespondence, uploadFile } from "@/server/actions"

export const metadata: Metadata = { title: "Documents" }

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase, permissions } = await requireUser()
    const category = one(params.category)
    let documents = supabase.from("documents").select("id, title, description, category, visibility, uploader_name, created_at").order("created_at", { ascending: false })
    if (category) documents = documents.eq("category", category)
    const docs = await documents
    if (docs.error) throw new Error(docs.error.message)
    const letters = can(permissions, "correspondence.manage") || can(permissions, "issues.respond")
      ? await supabase.from("correspondence").select("id, title, subject, sent_on, sender, recipient, body, response_received, response_on, response_body, follow_up_status").order("title")
      : { data: [], error: null }
    if (letters.error) throw new Error(letters.error.message)
    const manage = can(permissions, "documents.manage") || can(permissions, "correspondence.manage")
    return (
      <>
        <PageHeader title="Documents" lede="Official papers and the three correspondence threads with Paranjape. A thread stays empty until a letter is logged." />
        <Notice error={one(params.error)} notice={one(params.notice)} />
        <form className="mb-4" action="/documents">
          <select name="category" className={fieldClass} defaultValue={category} aria-label="Document category">
            <option value="">All categories</option>
            {Object.entries(DOCUMENT_CATEGORY).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
          </select>
          <button className={`${buttonClass} mt-2`} type="submit">Filter</button>
        </form>
        {records(docs.data).length === 0 ? <Empty>No documents in this category.</Empty> : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {records(docs.data).map((doc) => (
              <li key={str(doc, "id")} className="px-4 py-3 text-sm">
                <span className="font-medium">{str(doc, "title")}</span>
                <p className="text-xs text-faint">{label(DOCUMENT_CATEGORY, str(doc, "category"))} · {str(doc, "uploader_name")} · {formatWhen(strNull(doc, "created_at"))} · {str(doc, "visibility")}</p>
                {str(doc, "description") ? <p className="mt-1 text-muted">{str(doc, "description")}</p> : null}
              </li>
            ))}
          </ul>
        )}
        <Section title="Official correspondence">
          {records(letters.data).length === 0 ? <Empty>Correspondence is visible to the committee and the Paranjape team.</Empty> : records(letters.data).map((letter) => (
            <article key={str(letter, "id")} className="mb-4 rounded-lg border border-line bg-surface p-4 text-sm">
              <h3 className="font-medium">{str(letter, "title")}</h3>
              <p className="mt-1 text-xs text-faint">
                {strNull(letter, "sent_on") ? `Sent ${formatDay(strNull(letter, "sent_on"))}` : "No send date"} · {strNull(letter, "sender") ?? "Sender not recorded"} to {strNull(letter, "recipient") ?? "recipient not recorded"} · {label(STATUS_LABEL, str(letter, "follow_up_status"))}
              </p>
              <p className="mt-2 whitespace-pre-wrap">{str(letter, "body")}</p>
              <p className="mt-2 text-muted">{bool(letter, "response_received") ? `Response ${formatDay(strNull(letter, "response_on"))}: ${str(letter, "response_body")}` : "No response has been logged."}</p>
              {manage ? (
                <form action={updateCorrespondence} className="mt-3 grid gap-2">
                  <input type="hidden" name="id" value={str(letter, "id")} />
                  <input name="sent_on" type="date" className={fieldClass} aria-label="Date sent" />
                  <input name="sender" className={fieldClass} placeholder="Sender" aria-label="Sender" defaultValue={strNull(letter, "sender") ?? ""} />
                  <input name="recipient" className={fieldClass} placeholder="Recipient" aria-label="Recipient" defaultValue={strNull(letter, "recipient") ?? "Paranjape"} />
                  <textarea name="body" className={fieldClass} defaultValue={str(letter, "body")} aria-label="Letter" />
                  <label className="flex items-center gap-2"><input name="response_received" type="checkbox" defaultChecked={bool(letter, "response_received")} /> A response was received</label>
                  <input name="response_on" type="date" className={fieldClass} aria-label="Response date" />
                  <textarea name="response_body" className={fieldClass} defaultValue={str(letter, "response_body")} aria-label="Response" placeholder="Write the response before marking it received" />
                  <select name="follow_up" className={fieldClass} defaultValue={str(letter, "follow_up_status")} aria-label="Follow-up">
                    <option value="not_started">Not started</option>
                    <option value="waiting">Waiting</option>
                    <option value="answered">Answered</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button className={buttonClass} type="submit">Save correspondence</button>
                </form>
              ) : null}
            </article>
          ))}
        </Section>
        <Section title="Add a document">
          <form action={registerDocument} className="grid max-w-2xl gap-2">
            <input name="title" className={fieldClass} required aria-label="Title" placeholder="Title" />
            <textarea name="description" className={fieldClass} aria-label="Description" placeholder="Description" />
            <select name="category" className={fieldClass} aria-label="Category">
              {Object.entries(DOCUMENT_CATEGORY).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
            </select>
            {can(permissions, "documents.manage") ? (
              <select name="visibility" className={fieldClass} aria-label="Visibility">
                <option value="resident">Residents</option>
                <option value="committee">Committee only</option>
                <option value="developer">Committee and Paranjape team</option>
              </select>
            ) : null}
            <button className={buttonClass} type="submit">Save document</button>
          </form>
          <form action={uploadFile} className="mt-4 flex flex-wrap items-center gap-2">
            <input type="hidden" name="return" value="/documents" />
            <input name="file" type="file" required aria-label="File" />
            <button className={buttonClass} type="submit">Upload file</button>
          </form>
        </Section>
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
