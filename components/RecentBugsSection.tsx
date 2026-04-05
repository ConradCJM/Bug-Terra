"use client";
import { Bug } from "@/types/bug";
import { RecentBugsSectionProps } from "@/types/recentBugsSectionProps";

const PRIORITY_BADGES = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export default function RecentBugsSection({
  bugs,
  onBugClick,
}: RecentBugsSectionProps) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-600">
        <h2 className="text-xl font-bold text-white">Recent Bugs</h2>
        <p className="text-slate-400 text-sm mt-1">
          Latest bug reports from your team
        </p>
      </div>

      {/* Bugs List */}
      <div className="divide-y divide-slate-700">
        {bugs.length > 0 ? (
          bugs.map((bug) => (
            <div
              key={bug.id}
              className="px-6 py-4 hover:bg-slate-700/30 transition-colors cursor-pointer group relative"
              onClick={() => onBugClick(bug)}
              title="Click to open details"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Bug Title and Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-medium group-hover:text-blue-300">
                      {bug.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        PRIORITY_BADGES[
                          bug.priority as keyof typeof PRIORITY_BADGES
                        ]
                      }`}
                    >
                      {bug.priority.charAt(0).toUpperCase() +
                        bug.priority.slice(1)}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{bug.category}</span>
                    <span>•</span>
                    <span>Reported by {bug.reporter}</span>
                    {bug.assignee && (
                      <>
                        <span>•</span>
                        <span>Assigned to {bug.assignee}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{bug.createdAt}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="ml-4">
                  <span className="inline-block bg-slate-600 text-slate-100 text-xs font-medium px-3 py-1 rounded-full capitalize">
                    {bug.status.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-slate-400">
            <p>No recent bugs to display</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-700/30 px-6 py-3 border-t border-slate-700">
        <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
          View All Bugs →
        </button>
      </div>
    </div>
  );
}
