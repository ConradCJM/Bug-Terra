import { BugHistory } from "./bugHistory";
import { Comment } from "./comment";
import { Attachment } from "./attachment";
export interface Bug {
  id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "review" | "done";
  reporter: string;
  createdAt: string;
  assignee?: string;
  history?: BugHistory[];
  comments?: Comment[];
  attachments?: Attachment[];
}