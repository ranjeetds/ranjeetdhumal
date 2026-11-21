# Township portal

Private coordination for residents, the interim committee, and the Paranjape team.
It is a separate Next.js application from the static site at ranjeetdhumal.com.
The public site’s Cloudflare Worker must not serve this hostname.

## Run it locally

```sh
cd portal
cp .env.example .env.local
npm install
npm run dev
```

Without the environment variables, the app shows a setup page and no records.

## Database

1. Create a Supabase project.
2. Run `supabase/migrations/0001_foundation.sql` in the SQL editor.
3. Put the project URL and anon key in `.env.local`. Put the service role key in
   `SUPABASE_SERVICE_ROLE_KEY` on the server only.
4. Create the first user before anyone else signs up. That account becomes the
   platform administrator.
5. Society members create a resident account at `/signup` and are signed in. The
   hosted mail service only sends two messages an hour, so signup does not wait for a
   confirmation email. Invite committee and Paranjape representatives from Administration.
   Invitation links expire after seven days.

The migration seeds categories, development areas, electricity milestone names, and three
empty correspondence records. It does not create issues, dates, or developer responses.
A development status stays “Awaiting confirmation” until someone records an update and
marks where that update came from.

## Access

Reads are enforced by Postgres row level security. Writes go through database functions
that check a permission, not only the role name. Residents do not receive committee-only
comments or their activity. Developer representatives see issues assigned to their team.
Plot, phase, and email are not in the member directory.

In-app notifications are stored. Email delivery is not connected. An administrator creates a
one-time password reset link. The built-in mail service cannot send more than two messages
an hour, and it will not deliver them to member addresses.

## Deploy

`npm run deploy:vinext` publishes this app as its own Cloudflare Worker, `township-portal`,
on `mg.ranjeetdhumal.com`. Do not add that hostname to the public site Worker. A push that
only changes `portal/` does not deploy ranjeetdhumal.com, and it does not publish this
Worker either. The service role key is a Worker secret. Pass it with `cf deploy
--secrets-file` on every deploy; a deploy that omits the file removes the secret.

```sh
npm run check
npm run build
```
