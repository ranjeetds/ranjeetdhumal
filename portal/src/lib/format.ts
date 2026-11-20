export const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  assigned: "Assigned",
  acknowledged: "Acknowledged",
  in_progress: "In progress",
  awaiting_information: "Awaiting information",
  awaiting_developer: "Awaiting developer response",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
  approved: "Approved",
  published: "Published",
  not_started: "Not started",
  blocked: "Blocked",
  completed: "Completed",
  awaiting_confirmation: "Awaiting confirmation",
  waiting: "Waiting",
  answered: "Answered",
}

export const SOURCE_LABEL: Record<string, string> = {
  awaiting_confirmation: "Awaiting confirmation",
  developer_provided: "Developer-provided",
  committee_observation: "Committee observation",
  confirmed: "Confirmed",
}

export const ROLE_LABEL: Record<string, string> = {
  platform_admin: "Platform administrator",
  committee_admin: "Committee administrator",
  committee: "Interim committee",
  developer: "Paranjape team",
  resident: "Resident",
}

export const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
  important: "Important",
}

export const DOCUMENT_CATEGORY: Record<string, string> = {
  infrastructure: "Infrastructure",
  approvals: "Approvals and NOCs",
  society: "Society formation",
  maintenance: "Maintenance",
  meetings: "Meetings",
  correspondence: "Developer correspondence",
  guidelines: "Construction guidelines",
  other: "Other",
}

export function label(map: Record<string, string>, value: string | null): string {
  if (!value) return "Unknown"
  return map[value] ?? value.replaceAll("_", " ")
}

export function formatWhen(value: string | null): string {
  if (!value) return "Unknown"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date)
}

export function formatDay(value: string | null): string {
  if (!value) return "Unknown"
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(date)
}

export function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

export function searchTerm(value: string): string {
  return value.replace(/[%_,()*\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80)
}
