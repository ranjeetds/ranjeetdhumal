import { ROLE_LABEL } from "@/lib/format"
import { can, canAny, type Profile } from "@/lib/session"
import { buttonClass } from "@/components/ui"
import { signOut } from "@/app/login/actions"

const NAV: { href: string; label: string; permission?: string; any?: readonly string[] }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/issues", label: "Issues & Requests" },
  { href: "/development", label: "Township Development" },
  { href: "/discussions", label: "Discussions" },
  { href: "/meetings", label: "Meetings" },
  { href: "/documents", label: "Documents" },
  { href: "/announcements", label: "Announcements" },
  { href: "/members", label: "Members", permission: "members.view" },
  { href: "/reports", label: "Reports", permission: "reports.view" },
  {
    href: "/admin",
    label: "Administration",
    any: ["users.manage", "users.invite", "audit.view", "categories.manage"],
  },
]

export function Shell({
  profile,
  permissions,
  pathname,
  unread,
  children,
}: {
  profile: Profile
  permissions: readonly string[]
  pathname: string
  unread: number
  children: React.ReactNode
}) {
  const links = NAV.filter((item) => {
    if (item.permission) return can(permissions, item.permission)
    if (item.any) return canAny(permissions, item.any)
    return true
  })

  return (
    <div className="min-h-screen md:grid md:grid-cols-[15.5rem_minmax(0,1fr)]">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-surface focus:p-2">
        Skip to content
      </a>
      <aside className="border-b border-line bg-surface md:min-h-screen md:border-r md:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <a href="/dashboard" className="text-sm font-semibold tracking-tight">
            Township portal
          </a>
          <form action={signOut} className="md:hidden">
            <button className="text-sm text-muted" type="submit">
              Log out
            </button>
          </form>
        </div>
        <nav aria-label="Main">
          <ul className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible">
            {links.map((item) => {
              const current = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`block rounded-md px-3 py-2 text-sm whitespace-nowrap ${
                      current ? "bg-canvas font-medium text-ink" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-8">
          <form action="/search" className="min-w-0 flex-1" role="search">
            <label className="sr-only" htmlFor="q">
              Search
            </label>
            <input
              id="q"
              name="q"
              className="w-full max-w-md rounded-md border border-line-strong bg-surface px-3 py-2 text-sm"
              placeholder="Search issues, meetings, documents"
            />
          </form>
          <div className="flex items-center gap-3 text-sm">
            <a href="/notifications" className="text-muted">
              Notifications{unread > 0 ? ` (${unread})` : ""}
            </a>
            <a href="/account" className="text-ink">
              {profile.fullName}
              <span className="ml-2 text-faint">{ROLE_LABEL[profile.role]}</span>
            </a>
            <form action={signOut} className="hidden md:block">
              <button className={buttonClass} type="submit">
                Log out
              </button>
            </form>
          </div>
        </header>
        <main id="content" className="px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
