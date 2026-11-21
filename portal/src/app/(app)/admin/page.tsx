import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Empty, Notice, PageHeader, Section, buttonClass, fieldClass } from "@/components/ui"
import { ROLE_LABEL, formatWhen, label, one } from "@/lib/format"
import { can, canAny, requireUser } from "@/lib/session"
import { bool, message, records, rethrowRedirect, str, strNull } from "@/lib/rows"
import { addCategory, inviteMember, resetMemberLink, updateMember } from "@/server/actions"

export const metadata: Metadata = { title: "Administration" }

const ROLES = ["resident", "committee", "developer", "committee_admin", "platform_admin"] as const

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase, permissions, profile } = await requireUser()
    if (!canAny(permissions, ["users.manage", "users.invite", "audit.view", "categories.manage"])) redirect("/dashboard")
    const members = can(permissions, "users.manage") ? await supabase.rpc("admin_directory") : { data: [], error: null }
    if (members.error) throw new Error(members.error.message)
    const audit = can(permissions, "audit.view")
      ? await supabase.from("audit_events").select("id, actor_name, action, summary, created_at").order("created_at", { ascending: false }).limit(40)
      : { data: [], error: null }
    if (audit.error) throw new Error(audit.error.message)
    const inviteRoles = profile.role === "platform_admin" ? ROLES : (["resident", "committee", "developer"] as const)
    return (
      <>
        <PageHeader title="Administration" lede="Accounts, invitations, and the append-only audit history." />
        <Notice error={one(params.error)} notice={one(params.notice)} />
        {can(permissions, "users.invite") || can(permissions, "users.manage") ? (
          <Section title="Invite">
            <form action={inviteMember} className="grid max-w-xl gap-2">
              <input name="name" className={fieldClass} aria-label="Name" placeholder="Name" />
              <input name="email" type="email" className={fieldClass} required aria-label="Email" placeholder="Email" />
              <select name="role" className={fieldClass} aria-label="Role">
                {inviteRoles.map((role) => <option key={role} value={role}>{label(ROLE_LABEL, role)}</option>)}
              </select>
              <button className={buttonClass} type="submit">Create invitation</button>
            </form>
            <p className="mt-2 max-w-xl text-xs text-muted">The invitation link is shown once. It expires in seven days. Copy it to the person; email delivery is not connected yet.</p>
          </Section>
        ) : null}
        {can(permissions, "users.manage") ? (
          <Section title="Accounts">
            <p className="mb-3 max-w-xl text-xs text-muted">A reset link is shown once. Copy it to the member. Mail cannot deliver it, and the two-email hourly limit cannot be raised without a separate mail provider.</p>
            {records(members.data).length === 0 ? <Empty>No accounts yet.</Empty> : (
              <ul className="space-y-3">
                {records(members.data).map((member) => (
                  <li key={str(member, "id")} className="rounded-lg border border-line bg-surface p-4">
                    <form action={updateMember} className="grid gap-2 md:grid-cols-2">
                      <input type="hidden" name="user_id" value={str(member, "id")} />
                      <p className="text-sm md:col-span-2">{str(member, "full_name")} · {str(member, "email")}</p>
                      <select name="role" className={fieldClass} defaultValue={str(member, "role")} aria-label={`Role for ${str(member, "full_name")}`}>
                        {ROLES.map((role) => <option key={role} value={role}>{label(ROLE_LABEL, role)}</option>)}
                      </select>
                      <label className="flex items-center gap-2 text-sm">
                        <input name="active" type="checkbox" defaultChecked={bool(member, "active")} />
                        Active
                      </label>
                      <input name="plot" className={fieldClass} defaultValue={strNull(member, "plot") ?? ""} aria-label="Plot" placeholder="Plot, visible only to administrators" />
                      <input name="phase" className={fieldClass} defaultValue={strNull(member, "phase") ?? ""} aria-label="Phase" placeholder="Phase" />
                      <button className={buttonClass} type="submit">Save</button>
                    </form>
                    <form action={resetMemberLink} className="mt-3">
                      <input type="hidden" name="user_id" value={str(member, "id")} />
                      <button className="text-sm text-accent" type="submit">Create a reset link</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        ) : null}
        {can(permissions, "categories.manage") ? (
          <Section title="Add a category">
            <form action={addCategory} className="flex max-w-xl gap-2">
              <input name="name" className={fieldClass} required aria-label="Category name" placeholder="Category name" />
              <input name="prefix" className={fieldClass} required aria-label="Issue prefix" placeholder="Prefix" maxLength={6} />
              <button className={buttonClass} type="submit">Add</button>
            </form>
          </Section>
        ) : null}
        {can(permissions, "audit.view") ? (
          <Section title="Audit">
            {records(audit.data).length === 0 ? <Empty>No audit events yet.</Empty> : (
              <ol className="space-y-2 text-sm">
                {records(audit.data).map((event) => (
                  <li key={str(event, "id")}>
                    <span>{str(event, "summary")}</span>
                    <span className="block text-xs text-faint">{str(event, "actor_name")} · {str(event, "action")} · {formatWhen(strNull(event, "created_at"))}</span>
                  </li>
                ))}
              </ol>
            )}
          </Section>
        ) : null}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
