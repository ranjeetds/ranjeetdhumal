import { can, requireUser } from "@/lib/session"
import { nested, records, str, strNull } from "@/lib/rows"

export async function GET() {
  const { supabase, permissions } = await requireUser()
  if (!can(permissions, "reports.view")) return new Response("Not found", { status: 404 })
  const { data, error } = await supabase
    .from("issues")
    .select("key, title, status, priority, expected_on, created_at, assigned_team, categories(name)")
    .is("archived_at", null)
    .order("created_at", { ascending: false })
  if (error) return new Response(error.message, { status: 500 })
  const lines = ["Issue,Title,Category,Status,Priority,Team,Raised,Expected"]
  for (const issue of records(data)) {
    lines.push(
      [
        str(issue, "key"),
        str(issue, "title"),
        str(nested(issue, "categories") ?? {}, "name"),
        str(issue, "status"),
        str(issue, "priority"),
        strNull(issue, "assigned_team") ?? "",
        str(issue, "created_at"),
        strNull(issue, "expected_on") ?? "",
      ].map(csv).join(","),
    )
  }
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"issues.csv\"",
      "Cache-Control": "private, no-store",
    },
  })
}

function csv(value: string): string {
  return `"${value.replaceAll("\"", "\"\"")}"`
}
