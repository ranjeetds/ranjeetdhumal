import type { Metadata } from "next"
import { Notice, PageHeader, buttonClass, quietClass } from "@/components/ui"
import { one } from "@/lib/format"
import { bool, isRecord, message, rethrowRedirect, str } from "@/lib/rows"
import { requireUser } from "@/lib/session"
import { savePreferences } from "@/server/actions"
import { signOut } from "@/app/login/actions"

export const metadata: Metadata = { title: "Account" }

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const params = await searchParams
    const { supabase, profile } = await requireUser()
    const { data, error } = await supabase.from("notification_preferences").select("comments, status_changes, announcements, meetings").eq("user_id", profile.id).maybeSingle()
    if (error) throw new Error(error.message)
    const prefs = isRecord(data) ? data : {}
    return (
      <>
        <PageHeader title="Account" lede={`${profile.fullName} · ${profile.email}`} />
        <Notice error={one(params.error)} notice={one(params.notice)} />
        <p className="max-w-xl text-sm text-muted">
          Plot: {profile.plot ?? "Not recorded"}. Phase: {profile.phase ?? "Not recorded"}. Other residents cannot see these.
        </p>
        <form action={savePreferences} className="mt-6 max-w-xl space-y-2 text-sm">
          <h2 className="font-medium">Non-critical notices</h2>
          <label className="flex gap-2"><input name="comments" type="checkbox" defaultChecked={bool(prefs, "comments")} /> Comments on issues I follow</label>
          <label className="flex gap-2"><input name="status_changes" type="checkbox" defaultChecked={bool(prefs, "status_changes")} /> Status changes</label>
          <label className="flex gap-2"><input name="announcements" type="checkbox" defaultChecked={bool(prefs, "announcements")} /> Ordinary announcements</label>
          <label className="flex gap-2"><input name="meetings" type="checkbox" defaultChecked={bool(prefs, "meetings")} /> Meeting notices</label>
          <button className={buttonClass} type="submit">Save preferences</button>
        </form>
        <form action={signOut} className="mt-8">
          <button className={quietClass} type="submit">Log out on every device</button>
        </form>
      </>
    )
  } catch (error) {
    rethrowRedirect(error)
    return <p role="alert">{message(error)}</p>
  }
}
