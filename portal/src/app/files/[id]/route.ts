import { createAdmin } from "@/lib/supabase/admin"
import { isRecord, str } from "@/lib/rows"
import { requireUser } from "@/lib/session"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from("attachments")
    .select("storage_path, file_name, content_type")
    .eq("id", id)
    .maybeSingle()
  if (error || !isRecord(data)) return new Response("Not found", { status: 404 })
  const admin = createAdmin()
  if (!admin) return new Response("File storage is not configured.", { status: 503 })
  const file = await admin.storage.from("portal").download(str(data, "storage_path"))
  if (file.error || !file.data) return new Response("Not found", { status: 404 })
  const bytes = await file.data.arrayBuffer()
  const name = str(data, "file_name").replace(/["\r\n]/g, "")
  return new Response(bytes, {
    headers: {
      "Content-Type": str(data, "content_type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
