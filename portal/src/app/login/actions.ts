"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { allowAttempt } from "@/lib/rate-limit"
import { createClient } from "@/lib/supabase/server"

function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/dashboard"
  return value
}

export async function signIn(formData: FormData) {
  const parsed = z.object({ email: z.email(), password: z.string().min(1) }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) redirect("/login?error=Enter%20the%20email%20and%20password.")
  const email = parsed.data.email.toLowerCase()
  if (!(await allowAttempt(email, "login", 8, 15 * 60))) {
    redirect("/login?error=Too%20many%20attempts.%20Wait%20fifteen%20minutes%20and%20try%20again.")
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  })
  if (error) redirect("/login?error=The%20email%20or%20password%20is%20not%20correct.")
  redirect(safeNext(formData.get("next")))
}

export async function sendReset(formData: FormData) {
  const parsed = z.email().safeParse(formData.get("email"))
  if (!parsed.success) redirect("/login?error=Enter%20the%20email%20address.")
  const email = parsed.data.toLowerCase()
  if (!(await allowAttempt(email, "reset", 5, 15 * 60))) {
    redirect("/login?error=Too%20many%20reset%20requests.%20Wait%20and%20try%20again.")
  }
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const supabase = await createClient()
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/confirm` })
  redirect("/login?notice=If%20that%20account%20exists%2C%20a%20reset%20link%20has%20been%20sent.")
}

export async function updatePassword(formData: FormData) {
  const parsed = z
    .string()
    .min(10)
    .regex(/[A-Za-z]/)
    .regex(/[0-9]/)
    .safeParse(formData.get("password"))
  if (!parsed.success) {
    redirect("/auth/reset?error=Use%20at%20least%2010%20characters%2C%20including%20a%20letter%20and%20a%20number.")
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data })
  if (error) redirect("/auth/reset?error=This%20reset%20link%20has%20expired.%20Request%20a%20new%20one.")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut({ scope: "global" })
  redirect("/login")
}
