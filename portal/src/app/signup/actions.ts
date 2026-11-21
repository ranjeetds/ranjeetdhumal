"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { allowAttempt } from "@/lib/rate-limit"
import { createAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

function signupFailure(message: string): string {
  const text = message.toLowerCase()
  if (text.includes("already registered") || text.includes("already exists")) {
    return "That email already has an account. Log in."
  }
  if (text.includes("rate limit") || text.includes("over_email")) {
    return "Too many confirmation emails were sent this hour. Wait and try again."
  }
  if (text.includes("password")) {
    return "Use at least 10 characters, including a letter and a number."
  }
  return "The account could not be created. Try again."
}

const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(10).regex(/[A-Za-z]/).regex(/[0-9]/),
})

export async function signUp(formData: FormData) {
  const password = formData.get("password")
  const confirm = formData.get("confirm")
  if (password !== confirm) {
    redirect("/signup?error=The%20two%20passwords%20do%20not%20match.")
  }
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password,
  })
  if (!parsed.success) {
    redirect("/signup?error=Use%20your%20name%2C%20email%2C%20and%20a%20password%20of%20at%20least%2010%20characters%20with%20a%20letter%20and%20a%20number.")
  }

  const email = parsed.data.email.toLowerCase()
  if (!(await allowAttempt(email, "signup", 5, 60 * 60))) {
    redirect("/signup?error=Too%20many%20attempts.%20Wait%20an%20hour%20and%20try%20again.")
  }

  // The hosted mail service only sends two messages an hour, and a normal signup
  // fails once that limit is reached. Creating the account here confirms it without
  // sending mail, then signs the resident in.
  const admin = createAdmin()
  if (!admin) redirect("/signup?error=Accounts%20cannot%20be%20created%20until%20the%20portal%20is%20configured.")
  const created = await admin.auth.admin.createUser({
    email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.name },
  })
  if (created.error) redirect(`/signup?error=${encodeURIComponent(signupFailure(created.error.message))}`)

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  })
  if (error) redirect("/login?notice=The%20account%20is%20ready.%20Log%20in.")
  redirect("/dashboard")
}
