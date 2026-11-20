import type { Metadata } from "next"
import { one } from "@/lib/format"
import { buttonClass, fieldClass, Notice } from "@/components/ui"
import { acceptInvite } from "./actions"

export const metadata: Metadata = { title: "Accept invitation" }

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { token } = await params
  const query = await searchParams
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Accept your invitation</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        This link expires seven days after it was created. There is no public registration.
      </p>
      <Notice error={one(query.error)} />
      <form action={acceptInvite} className="mt-6 space-y-3">
        <input type="hidden" name="token" value={token} />
        <label className="block text-sm" htmlFor="name">
          Your name
          <input id="name" className={`${fieldClass} mt-1`} name="name" autoComplete="name" required />
        </label>
        <label className="block text-sm" htmlFor="password">
          Password
          <input id="password" className={`${fieldClass} mt-1`} name="password" type="password" autoComplete="new-password" required />
        </label>
        <button className={buttonClass} type="submit">
          Create account
        </button>
      </form>
    </main>
  )
}
