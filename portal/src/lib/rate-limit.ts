import { createAdmin } from "@/lib/supabase/admin"

const hits = new Map<string, number[]>()

function allowLocal(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export async function allowAttempt(
  key: string,
  action: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!allowLocal(`${action}:${key}`, limit, windowSeconds * 1000)) return false
  const admin = createAdmin()
  if (!admin) return true
  const { data, error } = await admin.rpc("consume_auth_attempt", {
    p_key: key,
    p_action: action,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  })
  if (error) return true
  return data === true
}
