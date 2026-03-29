"use client";

interface Bug {
  id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "review" | "done";
  reporter: string;
  createdAt: string;
}

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  critical: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_COLORS = {
  "todo": "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "review": "bg-yellow-100 text-yellow-800",
  "done": "bg-green-100 text-green-800",
};

interface BugDetailsModalProps {
  bug: Bug;
  isOpen: boolean;
  onClose: () => void;
}

export default function BugDetailsModal({
  bug,
  isOpen,
  onClose,
}: BugDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-start justify-between border-b border-slate-200">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{bug.name}</h2>
              <p className="text-slate-300 text-sm mt-1">Bug ID: {bug.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors ml-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Badges Row */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  PRIORITY_COLORS[bug.priority]
                }`}
              >
                {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}{" "}
                Priority
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  STATUS_COLORS[bug.status as keyof typeof STATUS_COLORS]
                }`}
              >
                {bug.status.replace("-", " ").toUpperCase()}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                {bug.category}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Reporter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reported By
                </label>
                <p className="text-slate-600">{bug.reporter}</p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Created Date
                </label>
                <p className="text-slate-600">{bug.createdAt}</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <p className="text-slate-600">{bug.category}</p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority Level
                </label>
                <p className="text-slate-600 capitalize">{bug.priority}</p>
              </div>
            </div>

            {/* Notes Section (Placeholder) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notes
              </label>
              <div className="bg-slate-50 rounded p-3 text-slate-600 text-sm border border-slate-200">
                No notes provided yet.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-slate-200 pt-6">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                Add Comment
              </button>
              <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                Change Status
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
