import { label, PRIORITY_LABEL, SOURCE_LABEL, STATUS_LABEL } from "@/lib/format"

export const fieldClass =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink"

export const buttonClass =
  "inline-flex items-center justify-center rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-ink"

export const quietClass =
  "inline-flex items-center justify-center rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink"

export function PageHeader({
  title,
  lede,
  children,
}: {
  title: string
  lede?: string
  children?: React.ReactNode
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {lede ? <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{lede}</p> : null}
      </div>
      {children}
    </header>
  )
}

export function Notice({ error, notice }: { error?: string; notice?: string }) {
  if (error) {
    return (
      <p className="mb-4 rounded-md border border-danger/30 bg-surface px-3 py-2 text-sm text-danger" role="alert">
        {error}
      </p>
    )
  }
  if (notice) {
    return (
      <p className="mb-4 rounded-md border border-line bg-surface px-3 py-2 text-sm" role="status">
        {notice}
      </p>
    )
  }
  return null
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed border-line-strong px-4 py-6 text-sm text-muted">{children}</p>
}

export function Badge({ value, kind = "status" }: { value: string | null; kind?: "status" | "priority" | "source" }) {
  const text =
    kind === "priority" ? label(PRIORITY_LABEL, value) : kind === "source" ? label(SOURCE_LABEL, value) : label(STATUS_LABEL, value)
  const tone =
    value === "urgent" || value === "high" || value === "important"
      ? "border-danger/30 text-danger"
      : value === "resolved" || value === "closed" || value === "completed" || value === "confirmed"
        ? "border-accent/30 text-accent"
        : value === "awaiting_confirmation" || value === "awaiting_developer" || value === "awaiting_information"
          ? "border-signal/40 text-signal"
          : "border-line-strong text-muted"
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}>{text}</span>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  )
}

export function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-line bg-surface p-4">{children}</div>
}
