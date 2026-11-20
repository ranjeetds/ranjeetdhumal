import type { Metadata } from "next"
import { one } from "@/lib/format"
import { buttonClass, fieldClass, Notice } from "@/components/ui"
import { updatePassword } from "@/app/login/actions"

export const metadata: Metadata = { title: "Choose a new password" }

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="mt-3 text-sm leading-6 text-muted">Use at least 10 characters, with a letter and a number.</p>
      <Notice error={one(params.error)} />
      <form action={updatePassword} className="mt-6 space-y-3">
        <label className="block text-sm" htmlFor="password">
          New password
          <input id="password" className={`${fieldClass} mt-1`} name="password" type="password" autoComplete="new-password" required />
        </label>
        <button className={buttonClass} type="submit">
          Save password
        </button>
      </form>
    </main>
  )
}
