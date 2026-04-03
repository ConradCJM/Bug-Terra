"use client";

interface BugHistory {
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

const ACTION_TYPE_CONFIG: Record<string, { color: string; label: string; bgColor: string }> = {
  created: { color: "text-purple-700", label: "Created", bgColor: "bg-purple-100" },
  status_changed: { color: "text-blue-700", label: "Status", bgColor: "bg-blue-100" },
  priority_changed: { color: "text-blue-700", label: "Priority", bgColor: "bg-blue-100" },
  category_changed: { color: "text-blue-700", label: "Category", bgColor: "bg-blue-100" },
  comment_added: { color: "text-green-700", label: "Comment", bgColor: "bg-green-100" },
  comment_edited: { color: "text-green-700", label: "Comment", bgColor: "bg-green-100" },
  comment_deleted: { color: "text-red-700", label: "Comment", bgColor: "bg-red-100" },
  file_added: { color: "text-orange-700", label: "File", bgColor: "bg-orange-100" },
  file_deleted: { color: "text-orange-700", label: "File", bgColor: "bg-orange-100" },
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

export default function BugHistoryTimeline({ history }: { history: BugHistory[] }) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedHistory.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No history available yet.</p>
      ) : (
        sortedHistory.map((entry, index) => {
          const config = ACTION_TYPE_CONFIG[entry.actionType] || { color: "text-slate-700", label: "Update", bgColor: "bg-slate-100" };
          
          return (
            <div key={entry.id} className="relative">
              {/* Timeline Line */}
              {index < sortedHistory.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200" />
              )}

              {/* Timeline Item */}
              <div className="flex gap-4">
                {/* Timeline Dot */}
                <div className="flex-shrink-0 relative pt-1">
                  <div className={`w-4 h-4 rounded-full ${config.bgColor} border-2 border-white shadow-md relative z-10`} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6 pt-0.5">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>

                  {/* Actor and Description */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      {entry.actor}
                    </p>
                    <p className="text-sm text-slate-700 mb-2">
                      {entry.description}
                    </p>

                    {/* Show before/after for field changes */}
                    {entry.oldValue && entry.newValue && (
                      <div className="flex gap-2 text-xs mt-2 pt-2 border-t border-slate-200">
                        <span className="text-slate-500">
                          {entry.fieldName}: <span className="font-medium line-through text-red-600">{entry.oldValue}</span>
                          {" "} → {" "}
                          <span className="font-medium text-green-600">{entry.newValue}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
