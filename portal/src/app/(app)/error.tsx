"use client"

export default function AppError({ error }: { error: Error }) {
  return (
    <p className="rounded-md border border-danger/30 bg-surface px-4 py-3 text-sm text-danger" role="alert">
      {error.message || "The page could not be loaded."}
    </p>
  )
}
