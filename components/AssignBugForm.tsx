import { useState } from "react";
import { Bug } from "@/types/bug";

interface AssignBugFormProps {
  bug: Bug;
  onSave: (assignee: string | undefined) => void;
  onCancel: () => void;
}

const TEAM_MEMBERS = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Sarah Lee" },
  { id: "5", name: "Alex Chen" },
];

export default function AssignBugForm({
  bug,
  onSave,
  onCancel,
}: AssignBugFormProps) {
  const [selectedAssignee, setSelectedAssignee] = useState<string | undefined>(
    bug.assignee,
  );

  const handleSave = () => {
    onSave(selectedAssignee);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-lg shadow-2xl p-6 max-w-md w-full border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Assign Bug</h3>

        {/* Current Assignee Info */}
        {bug.assignee && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Currently assigned to:</span>{" "}
              {bug.assignee}
            </p>
          </div>
        )}

        {/* Team Member Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Assign to
          </label>
          <select
            value={selectedAssignee || ""}
            onChange={(e) => setSelectedAssignee(e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Unassigned --</option>
            {TEAM_MEMBERS.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Select a team member to assign this bug, or choose "Unassigned" to
            remove assignment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            Save Assignment
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Backdrop - No blur to prevent double blur effect */}
      <div className="fixed inset-0 bg-black/0 z-40" onClick={onCancel} />
    </div>
  );
}
