import type { Metadata } from "next"
import { one } from "@/lib/format"
import { buttonClass, fieldClass, Notice } from "@/components/ui"
import { signIn } from "./actions"

export const metadata: Metadata = { title: "Log in" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = one(params.next) || "/dashboard"
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-accent">Township portal</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Residents, the interim committee, and Paranjape representatives each see the records their role
        allows.
      </p>
      <Notice error={one(params.error)} notice={one(params.notice)} />
      <form action={signIn} className="mt-6 space-y-3">
        <input type="hidden" name="next" value={next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"} />
        <label className="block text-sm" htmlFor="email">
          Email
          <input id="email" className={`${fieldClass} mt-1`} name="email" type="email" autoComplete="username" required />
        </label>
        <label className="block text-sm" htmlFor="password">
          Password
          <input id="password" className={`${fieldClass} mt-1`} name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className={buttonClass} type="submit">
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm">
        <a className="text-accent" href="/signup">
          New here? Create a resident account
        </a>
      </p>
      <div className="mt-8 border-t border-line pt-6">
        <h2 className="text-sm font-semibold">Forgot the password</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Ask an administrator for a reset link. The portal cannot email it.
        </p>
      </div>
    </main>
  )
}
