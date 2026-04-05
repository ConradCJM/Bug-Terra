import { Bug } from "./bug";
export interface BugDetailsModalProps {
  bug: Bug;
  isOpen: boolean;
  onClose: () => void;
  onBugUpdate?: (updatedBug: Bug) => void;
}