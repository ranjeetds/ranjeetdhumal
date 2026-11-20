import { headers } from "next/headers"
import { connection } from "next/server"
import { Shell } from "@/components/shell"
import { requireUser } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await connection()
  const session = await requireUser()
  const pathname = (await headers()).get("x-pathname") ?? "/dashboard"
  const { count } = await session.supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.profile.id)
    .is("read_at", null)

  return (
    <Shell profile={session.profile} permissions={session.permissions} pathname={pathname} unread={count ?? 0}>
      {children}
    </Shell>
  )
}
