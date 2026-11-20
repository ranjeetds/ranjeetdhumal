export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function records(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) return []
  return data.filter(isRecord)
}

export function str(row: Record<string, unknown>, key: string): string {
  const value = row[key]
  return typeof value === "string" ? value : ""
}

export function strNull(row: Record<string, unknown>, key: string): string | null {
  const value = row[key]
  return typeof value === "string" ? value : null
}

export function bool(row: Record<string, unknown>, key: string): boolean {
  return row[key] === true
}

export function nested(row: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = row[key]
  if (Array.isArray(value)) return value.find(isRecord) ?? null
  return isRecord(value) ? value : null
}

export function rethrowRedirect(error: unknown): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    (error.digest.startsWith("NEXT_REDIRECT") || error.digest.includes("NEXT_HTTP_ERROR_FALLBACK"))
  ) {
    throw error
  }
}

export function message(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return "The records could not be loaded."
}
