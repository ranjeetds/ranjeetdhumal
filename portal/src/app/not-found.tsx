export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <h1 className="text-2xl font-semibold">That page is not available</h1>
      <p className="mt-3 text-sm text-muted">It may be missing, or your account may not be allowed to open it.</p>
      <a className="mt-4 inline-block text-sm text-accent" href="/dashboard">Back to the dashboard</a>
    </main>
  )
}
