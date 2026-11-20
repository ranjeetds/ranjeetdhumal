"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { allowAttempt } from "@/lib/rate-limit"
import { createAdmin } from "@/lib/supabase/admin"
import { isRecord, str } from "@/lib/rows"

export async function acceptInvite(formData: FormData) {
  const token = typeof formData.get("token") === "string" ? formData.get("token") : ""
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    redirect("/login?error=This%20invitation%20link%20is%20not%20valid.")
  }
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(80),
      password: z.string().min(10).regex(/[A-Za-z]/).regex(/[0-9]/),
    })
    .safeParse({ name: formData.get("name"), password: formData.get("password") })
  if (!parsed.success) {
    redirect(`/invite/${token}?error=Enter%20your%20name%20and%20a%20password%20of%20at%20least%2010%20characters%20with%20a%20letter%20and%20a%20number.`)
  }
  if (!(await allowAttempt(token.slice(0, 16), "invite", 8, 60 * 60))) {
    redirect(`/invite/${token}?error=Too%20many%20attempts.%20Wait%20and%20try%20again.`)
  }
  const admin = createAdmin()
  if (!admin) {
    redirect(`/invite/${token}?error=Account%20creation%20needs%20the%20server%20key.%20Ask%20a%20platform%20administrator.`)
  }
  const { data, error } = await admin
    .from("invitations")
    .select("email, expires_at, accepted_at")
    .eq("token", token)
    .maybeSingle()
  if (error || !isRecord(data) || str(data, "accepted_at")) {
    redirect(`/invite/${token}?error=This%20invitation%20is%20no%20longer%20valid.`)
  }
  if (new Date(str(data, "expires_at")).getTime() < Date.now()) {
    redirect(`/invite/${token}?error=This%20invitation%20has%20expired.%20Ask%20for%20a%20new%20one.`)
  }
  const created = await admin.auth.admin.createUser({
    email: str(data, "email"),
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.name },
  })
  if (created.error) {
    redirect(`/invite/${token}?error=This%20email%20already%20has%20an%20account%2C%20or%20the%20invitation%20could%20not%20be%20used.`)
  }
  redirect("/login?notice=Your%20account%20is%20ready.%20Log%20in%20with%20the%20password%20you%20chose.")
}
