import { Bug } from "@/app/types/bug";
export interface RecentBugsSectionProps {
  bugs: Bug[];
  onBugClick: (bug: Bug) => void;
}