import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Empty, PageHeader } from "@/components/ui"
import { ROLE_LABEL, label } from "@/lib/format"
import { can, requireUser } from "@/lib/session"
import { message, records, rethrowRedirect, str } from "@/lib/rows"

export const metadata: Metadata = { title: "Members" }

export default async function MembersPage() {
  try {
    const { supabase, permissions } = await requireUser()
    if (!can(permissions, "members.view")) redirect("/dashboard")
    const { data, error } = await supabase.rpc("member_directory")
    if (error) throw new Error(error.message)
    const people = records(data)
    return (
      <>
        <PageHeader title="Members" lede="Names and roles only. Email addresses, plot numbers, and phone numbers are not shown here." />
        {people.length === 0 ? <Empty>No active members yet.</Empty> : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-faint">
              <tr><th className="py-2 font-medium">Name</th><th className="py-2 font-medium">Role</th></tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={str(person, "id")} className="border-t border-line">
                  <td className="py-2">{str(person, "full_name")}</td>
                  <td className="py-2">{label(ROLE_LABEL, str(person, "role"))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
