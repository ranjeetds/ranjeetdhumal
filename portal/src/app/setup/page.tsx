import type { Metadata } from "next"

export const metadata: Metadata = { title: "Setup" }

export default function SetupPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-accent">Private application</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Connect the township portal</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        This portal is separate from the public site at ranjeetdhumal.com. It stays closed until a
        database and the public keys below are configured. Nothing on this page is a resident record.
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm leading-6">
        <li>Create a Supabase project with Postgres, Auth, and private Storage.</li>
        <li>
          Run <code className="font-mono text-xs">portal/supabase/migrations/0001_foundation.sql</code> in
          the SQL editor. That creates the tables, permissions, categories, development areas, and the
          three correspondence records. It does not create issues or progress figures.
        </li>
        <li>Keep email and password sign-in. An administrator creates password reset links; the built-in mail service cannot deliver them.</li>
        <li>
          Copy <code className="font-mono text-xs">portal/.env.example</code> to{" "}
          <code className="font-mono text-xs">portal/.env.local</code>. Set the project URL, the anon key,
          and the service role key. The service role key stays on the server.
        </li>
        <li>
          Create the first account from the Supabase dashboard. The first account becomes the platform
          administrator. Create it only after public sign-up is off.
        </li>
        <li>
          Point <code className="font-mono text-xs">mg.ranjeetdhumal.com</code> at this app’s host. Do not
          add that hostname to the existing static Worker for ranjeetdhumal.com.
        </li>
      </ol>
    </main>
  )
}
