import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

function otpType(value: string | null): EmailOtpType | null {
  if (
    value === "signup" ||
    value === "invite" ||
    value === "magiclink" ||
    value === "recovery" ||
    value === "email_change" ||
    value === "email"
  ) {
    return value
  }
  return null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const tokenHash = url.searchParams.get("token_hash")
  const type = otpType(url.searchParams.get("type"))
  const supabase = await createClient()

  let failed = true
  if (code) {
    const exchanged = await supabase.auth.exchangeCodeForSession(code)
    failed = Boolean(exchanged.error)
  } else if (tokenHash && type) {
    const verified = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    failed = Boolean(verified.error)
  }

  if (failed) {
    return NextResponse.redirect(
      new URL("/login?error=This%20link%20has%20expired.%20Request%20a%20new%20one.", url.origin),
    )
  }
  const next = type === "recovery" ? "/auth/reset" : "/dashboard"
  return NextResponse.redirect(new URL(next, url.origin))
}
