import type { Metadata } from "next"
import { one } from "@/lib/format"
import { buttonClass, fieldClass, Notice } from "@/components/ui"
import { signUp } from "./actions"

export const metadata: Metadata = { title: "Create an account" }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-accent">Township portal</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create an account</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Society members can join as residents, raise issues, and take part in the discussion.
        Committee and Paranjape access is still by invitation.
      </p>
      <Notice error={one(params.error)} notice={one(params.notice)} />
      <form action={signUp} className="mt-6 space-y-3">
        <label className="block text-sm" htmlFor="name">
          Name
          <input id="name" className={`${fieldClass} mt-1`} name="name" type="text" autoComplete="name" required />
        </label>
        <label className="block text-sm" htmlFor="email">
          Email
          <input id="email" className={`${fieldClass} mt-1`} name="email" type="email" autoComplete="email" required />
        </label>
        <label className="block text-sm" htmlFor="password">
          Password
          <input
            id="password"
            className={`${fieldClass} mt-1`}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            required
          />
        </label>
        <label className="block text-sm" htmlFor="confirm">
          Confirm password
          <input
            id="confirm"
            className={`${fieldClass} mt-1`}
            name="confirm"
            type="password"
            autoComplete="new-password"
            minLength={10}
            required
          />
        </label>
        <button className={buttonClass} type="submit">
          Create account
        </button>
      </form>
      <p className="mt-8 text-sm">
        <a className="text-accent" href="/login">
          Already have an account? Log in
        </a>
      </p>
    </main>
  )
}
