import { redirect } from "next/navigation"
import { isConfigured } from "@/lib/env"
import { createClient } from "@/lib/supabase/server"

export type Role =
  | "platform_admin"
  | "committee_admin"
  | "committee"
  | "developer"
  | "resident"

export type Profile = {
  id: string
  email: string
  fullName: string
  role: Role
  active: boolean
  plot: string | null
  phase: string | null
}

const ROLES: readonly Role[] = [
  "platform_admin",
  "committee_admin",
  "committee",
  "developer",
  "resident",
]

function isRole(value: string): value is Role {
  return ROLES.some((role) => role === value)
}

function text(value: unknown): string {
  return typeof value === "string" ? value : ""
}

export async function getSession() {
  if (!isConfigured()) return { configured: false as const }
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return { configured: true as const, user: null, profile: null, permissions: [] as string[], supabase }
  }

  const { data: row, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, active, plot, phase")
    .eq("id", data.user.id)
    .maybeSingle()
  if (profileError) throw new Error(profileError.message)
  if (!row || typeof row !== "object") {
    return { configured: true as const, user: data.user, profile: null, permissions: [] as string[], supabase }
  }

  const role = text(row.role)
  if (!isRole(role)) throw new Error("This account has an unknown role.")
  const profile: Profile = {
    id: text(row.id),
    email: text(row.email),
    fullName: text(row.full_name),
    role,
    active: row.active === true,
    plot: typeof row.plot === "string" ? row.plot : null,
    phase: typeof row.phase === "string" ? row.phase : null,
  }
  if (!profile.active) {
    await supabase.auth.signOut()
    redirect("/login?error=This%20account%20is%20deactivated.")
  }

  const { data: permissionRows, error: permissionError } = await supabase.rpc("my_permissions")
  if (permissionError) throw new Error(permissionError.message)
  const permissions = Array.isArray(permissionRows)
    ? permissionRows.filter((item): item is string => typeof item === "string")
    : []

  return { configured: true as const, user: data.user, profile, permissions, supabase }
}

export async function requireUser() {
  const session = await getSession()
  if (!session.configured) redirect("/setup")
  if (!session.user || !session.profile) redirect("/login")
  return {
    user: session.user,
    profile: session.profile,
    permissions: session.permissions,
    supabase: session.supabase,
  }
}

export function can(permissions: readonly string[], key: string): boolean {
  return permissions.includes(key)
}

export function canAny(permissions: readonly string[], keys: readonly string[]): boolean {
  return keys.some((key) => permissions.includes(key))
}
