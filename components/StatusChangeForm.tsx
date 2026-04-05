import { useState } from "react";
import { Bug } from "@/types/bug";

interface StatusChangeFormProps {
  bug: Bug;
  onSave: (updatedBug: Partial<Bug>) => void;
  onCancel: () => void;
}

export default function StatusChangeForm({
  bug,
  onSave,
  onCancel,
}: StatusChangeFormProps) {
  const [status, setStatus] = useState(bug.status);
  const [priority, setPriority] = useState(bug.priority);
  const [category, setCategory] = useState(bug.category);

  const categories = [
    "Frontend",
    "Backend",
    "Content",
    "Infrastructure",
    "Database",
  ];
  const priorities = ["low", "medium", "high", "critical"];
  const statuses = ["todo", "in-progress", "review", "done"];

  const hasChanges =
    status !== bug.status ||
    priority !== bug.priority ||
    category !== bug.category;

  const handleSave = () => {
    onSave({
      status: status as Bug["status"],
      priority: priority as Bug["priority"],
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-lg shadow-2xl p-6 max-w-md w-full border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          Change Bug Details
        </h3>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Bug["status"])}
            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Priority Level
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Bug["priority"])}
            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            Save Changes
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
