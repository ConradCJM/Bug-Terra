export interface BugHistory {
  id: string;
  bugId: string;
  timestamp: string;
  actor: string;
  actionType: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}
