"use client";

import { useState } from "react";
import BugCard from "@/components/BugCard";
import RecentBugsSection from "@/components/RecentBugsSection";
import BugDetailsModal from "@/components/BugDetailsModal";

interface Bug {
  id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "review" | "done";
  reporter: string;
  createdAt: string;
}

// Placeholder data
const PLACEHOLDER_BUGS: Bug[] = [
  {
    id: "1",
    name: "Login button not responding",
    category: "Frontend",
    priority: "high",
    status: "in-progress",
    reporter: "John Doe",
    createdAt: "2026-03-29",
  },
  {
    id: "2",
    name: "Database connection timeout",
    category: "Backend",
    priority: "critical",
    status: "todo",
    reporter: "Jane Smith",
    createdAt: "2026-03-28",
  },
  {
    id: "3",
    name: "CSS not loading on mobile",
    category: "Frontend",
    priority: "medium",
    status: "review",
    reporter: "Mike Johnson",
    createdAt: "2026-03-27",
  },
  {
    id: "4",
    name: "Typo in homepage text",
    category: "Content",
    priority: "low",
    status: "done",
    reporter: "Sarah Lee",
    createdAt: "2026-03-26",
  },
  {
    id: "5",
    name: "Search functionality broken",
    category: "Frontend",
    priority: "high",
    status: "todo",
    reporter: "John Doe",
    createdAt: "2026-03-25",
  },
  {
    id: "6",
    name: "API rate limiting issue",
    category: "Backend",
    priority: "medium",
    status: "in-progress",
    reporter: "Mike Johnson",
    createdAt: "2026-03-24",
  },
];

const KANBAN_COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "review", title: "Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
];

export default function Dashboard() {
  const [bugs, setBugs] = useState<Bug[]>(PLACEHOLDER_BUGS);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleBugClick = (bug: Bug) => {
    setSelectedBug(bug);
    setIsDetailsOpen(true);
  };

  const getBugsByStatus = (status: string) => {
    return bugs.filter((bug) => bug.status === status);
  };

  const recentBugs = [...bugs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Bug Dashboard</h1>
          <p className="text-slate-400 mt-2">Track and manage all reported bugs</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recent Bugs Section */}
        <div className="mb-12">
          <RecentBugsSection bugs={recentBugs.slice(0, 5)} onBugClick={handleBugClick} />
        </div>

        {/* Kanban Board */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Bug Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KANBAN_COLUMNS.map((column) => (
              <div
                key={column.id}
                className={`rounded-lg overflow-hidden ${column.color} min-h-96`}
              >
                {/* Column Header */}
                <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{column.title}</h3>
                    <span className="bg-slate-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {getBugsByStatus(column.id).length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {getBugsByStatus(column.id).length > 0 ? (
                    getBugsByStatus(column.id).map((bug) => (
                      <BugCard key={bug.id} bug={bug} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32 text-slate-500">
                      <p className="text-sm">No bugs in this column</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bug Details Modal */}
      {selectedBug && (
        <BugDetailsModal
          bug={selectedBug as Bug & { status: "todo" | "in-progress" | "review" | "done" }}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}
