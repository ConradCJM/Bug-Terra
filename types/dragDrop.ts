/**
 * Drag and drop related type definitions for the bug pipeline
 */

export type ColumnStatus = "todo" | "in-progress" | "review" | "done";
export type DatabaseStatus = "todo" | "in_progress" | "review" | "done";

export interface DraggedBugData {
  id: string;
  name: string;
  status: ColumnStatus;
}

export const COLUMN_STATUS_MAP: Record<ColumnStatus, string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "review": "Review",
  "done": "Done",
};

export const COLUMN_STATUSES: ColumnStatus[] = ["todo", "in-progress", "review", "done"];

/**
 * Convert UI status format (with hyphens) to database format (with underscores)
 * UI: "in-progress" -> DB: "in_progress"
 */
export function toDbStatus(uiStatus: ColumnStatus): DatabaseStatus {
  return uiStatus.replace(/-/g, "_") as DatabaseStatus;
}

/**
 * Convert database status format (with underscores) to UI format (with hyphens)
 * DB: "in_progress" -> UI: "in-progress"
 */
export function fromDbStatus(dbStatus: DatabaseStatus): ColumnStatus {
  return dbStatus.replace(/_/g, "-") as ColumnStatus;
}
