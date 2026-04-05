"use client";

import { useState } from "react";
import BugDetailsModal from "./BugDetailsModal";
import { Bug } from "@/types/bug";

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  critical: "bg-red-100 text-red-800 border-red-300",
};

const CATEGORY_COLORS = {
  Frontend: "bg-blue-50 text-blue-700",
  Backend: "bg-purple-50 text-purple-700",
  Content: "bg-pink-50 text-pink-700",
  Infrastructure: "bg-gray-50 text-gray-700",
  Database: "bg-indigo-50 text-indigo-700",
};

export default function BugCard({
  bug,
  onBugUpdate,
}: {
  bug: Bug;
  onBugUpdate?: (updatedBug: Bug) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-4 cursor-move hover:shadow-lg transition-shadow hover:scale-105 transform duration-200 border border-slate-200"
        draggable
      >
        {/* Priority Badge */}
        <div className="flex items-start justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full border ${
              PRIORITY_COLORS[bug.priority]
            }`}
          >
            {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              CATEGORY_COLORS[bug.category as keyof typeof CATEGORY_COLORS] ||
              "bg-gray-50 text-gray-700"
            }`}
          >
            {bug.category}
          </span>
        </div>

        {/* Bug Name */}
        <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2 text-sm">
          {bug.name}
        </h4>

        {/* Reporter and Date */}
        <div className="text-xs text-slate-500 space-y-1 border-t border-slate-100 pt-2">
          <p className="line-clamp-1">
            <span className="font-medium">Reporter:</span> {bug.reporter}
          </p>
          {bug.assignee && (
            <p className="line-clamp-1">
              <span className="font-medium">Assigned to:</span> {bug.assignee}
            </p>
          )}
          <p>
            <span className="font-medium">Date:</span> {bug.createdAt}
          </p>
        </div>

        {/* Action Hint */}
        <div className="mt-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1 px-2 rounded transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal */}
      <BugDetailsModal
        bug={
          bug as Bug & { status: "todo" | "in-progress" | "review" | "done" }
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBugUpdate={onBugUpdate}
      />
    </>
  );
}
