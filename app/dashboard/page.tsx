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
  history?: BugHistory[];
}

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
    history: [
      {
        id: "h1",
        bugId: "1",
        timestamp: "2026-03-29T14:15:00Z",
        actor: "John Doe",
        actionType: "created",
        description: "Created bug: Login button not responding",
      },
      {
        id: "h2",
        bugId: "1",
        timestamp: "2026-03-29T15:45:00Z",
        actor: "Jane Smith",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "todo",
        newValue: "in-progress",
        description: "Status changed from To Do to In Progress",
      },
      {
        id: "h3",
        bugId: "1",
        timestamp: "2026-03-30T10:20:00Z",
        actor: "Mike Johnson",
        actionType: "comment_added",
        description: "Added comment: I can reproduce this on Chrome 89",
      },
      {
        id: "h4",
        bugId: "1",
        timestamp: "2026-03-30T11:00:00Z",
        actor: "John Doe",
        actionType: "priority_changed",
        fieldName: "priority",
        oldValue: "high",
        newValue: "critical",
        description: "Priority changed from High to Critical",
      },
      {
        id: "h5",
        bugId: "1",
        timestamp: "2026-03-30T13:30:00Z",
        actor: "Emma Wilson",
        actionType: "file_added",
        description: "File added: screenshot-bug.png",
      },
    ],
  },
  {
    id: "2",
    name: "Database connection timeout",
    category: "Backend",
    priority: "critical",
    status: "todo",
    reporter: "Jane Smith",
    createdAt: "2026-03-28",
    history: [
      {
        id: "h6",
        bugId: "2",
        timestamp: "2026-03-28T09:00:00Z",
        actor: "Jane Smith",
        actionType: "created",
        description: "Created bug: Database connection timeout",
      },
      {
        id: "h7",
        bugId: "2",
        timestamp: "2026-03-29T16:30:00Z",
        actor: "Mike Johnson",
        actionType: "comment_added",
        description: "Added comment: Check connection pool settings",
      },
    ],
  },
  {
    id: "3",
    name: "CSS not loading on mobile",
    category: "Frontend",
    priority: "medium",
    status: "review",
    reporter: "Mike Johnson",
    createdAt: "2026-03-27",
    history: [
      {
        id: "h8",
        bugId: "3",
        timestamp: "2026-03-27T11:00:00Z",
        actor: "Mike Johnson",
        actionType: "created",
        description: "Created bug: CSS not loading on mobile",
      },
      {
        id: "h9",
        bugId: "3",
        timestamp: "2026-03-28T14:20:00Z",
        actor: "Emma Wilson",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "in-progress",
        newValue: "review",
        description: "Status changed from In Progress to Review",
      },
    ],
  },
  {
    id: "4",
    name: "Typo in homepage text",
    category: "Content",
    priority: "low",
    status: "done",
    reporter: "Sarah Lee",
    createdAt: "2026-03-26",
    history: [
      {
        id: "h10",
        bugId: "4",
        timestamp: "2026-03-26T08:45:00Z",
        actor: "Sarah Lee",
        actionType: "created",
        description: "Created bug: Typo in homepage text",
      },
      {
        id: "h11",
        bugId: "4",
        timestamp: "2026-03-27T09:15:00Z",
        actor: "John Doe",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "todo",
        newValue: "done",
        description: "Status changed from To Do to Done",
      },
      {
        id: "h12",
        bugId: "4",
        timestamp: "2026-03-27T10:00:00Z",
        actor: "John Doe",
        actionType: "comment_added",
        description: "Added comment: Fixed and deployed",
      },
    ],
  },
  {
    id: "5",
    name: "Search functionality broken",
    category: "Frontend",
    priority: "high",
    status: "todo",
    reporter: "John Doe",
    createdAt: "2026-03-25",
    history: [
      {
        id: "h13",
        bugId: "5",
        timestamp: "2026-03-25T10:30:00Z",
        actor: "John Doe",
        actionType: "created",
        description: "Created bug: Search functionality broken",
      },
    ],
  },
  {
    id: "6",
    name: "API rate limiting issue",
    category: "Backend",
    priority: "medium",
    status: "in-progress",
    reporter: "Mike Johnson",
    createdAt: "2026-03-24",
    history: [
      {
        id: "h14",
        bugId: "6",
        timestamp: "2026-03-24T13:00:00Z",
        actor: "Mike Johnson",
        actionType: "created",
        description: "Created bug: API rate limiting issue",
      },
      {
        id: "h15",
        bugId: "6",
        timestamp: "2026-03-25T10:15:00Z",
        actor: "Emma Wilson",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "todo",
        newValue: "in-progress",
        description: "Status changed from To Do to In Progress",
      },
      {
        id: "h16",
        bugId: "6",
        timestamp: "2026-03-30T09:45:00Z",
        actor: "Jane Smith",
        actionType: "comment_added",
        description: "Added comment: Implemented rate limiter middleware",
      },
    ],
  },
  {
    id: "7",
    name: "Server down - 503 errors",
    category: "Infrastructure",
    priority: "critical",
    status: "todo",
    reporter: "Alex Chen",
    createdAt: "2026-03-23",
    history: [
      {
        id: "h17",
        bugId: "7",
        timestamp: "2026-03-23T16:20:00Z",
        actor: "Alex Chen",
        actionType: "created",
        description: "Created bug: Server down - 503 errors",
      },
      {
        id: "h18",
        bugId: "7",
        timestamp: "2026-03-23T16:30:00Z",
        actor: "David Park",
        actionType: "priority_changed",
        fieldName: "priority",
        oldValue: "high",
        newValue: "critical",
        description: "Priority changed from High to Critical",
      },
    ],
  },
  {
    id: "8",
    name: "Database query optimization needed",
    category: "Database",
    priority: "high",
    status: "in-progress",
    reporter: "Emma Wilson",
    createdAt: "2026-03-22",
    history: [
      {
        id: "h19",
        bugId: "8",
        timestamp: "2026-03-22T11:00:00Z",
        actor: "Emma Wilson",
        actionType: "created",
        description: "Created bug: Database query optimization needed",
      },
      {
        id: "h20",
        bugId: "8",
        timestamp: "2026-03-23T09:30:00Z",
        actor: "Jane Smith",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "todo",
        newValue: "in-progress",
        description: "Status changed from To Do to In Progress",
      },
      {
        id: "h21",
        bugId: "8",
        timestamp: "2026-03-29T14:00:00Z",
        actor: "Emma Wilson",
        actionType: "file_added",
        description: "File added: query-analysis.pdf",
      },
    ],
  },
  {
    id: "9",
    name: "Navbar not responsive on tablets",
    category: "Frontend",
    priority: "medium",
    status: "todo",
    reporter: "John Doe",
    createdAt: "2026-03-21",
    history: [
      {
        id: "h22",
        bugId: "9",
        timestamp: "2026-03-21T15:45:00Z",
        actor: "John Doe",
        actionType: "created",
        description: "Created bug: Navbar not responsive on tablets",
      },
    ],
  },
  {
    id: "10",
    name: "Backup script fails silently",
    category: "Infrastructure",
    priority: "high",
    status: "review",
    reporter: "David Park",
    createdAt: "2026-03-20",
    history: [
      {
        id: "h23",
        bugId: "10",
        timestamp: "2026-03-20T10:00:00Z",
        actor: "David Park",
        actionType: "created",
        description: "Created bug: Backup script fails silently",
      },
      {
        id: "h24",
        bugId: "10",
        timestamp: "2026-03-21T11:20:00Z",
        actor: "Mike Johnson",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "in-progress",
        newValue: "review",
        description: "Status changed from In Progress to Review",
      },
      {
        id: "h25",
        bugId: "10",
        timestamp: "2026-03-30T08:00:00Z",
        actor: "David Park",
        actionType: "comment_added",
        description: "Added comment: Waiting for testing approval",
      },
    ],
  },
  {
    id: "11",
    name: "Wrong spelling in about section",
    category: "Content",
    priority: "low",
    status: "todo",
    reporter: "Sarah Lee",
    createdAt: "2026-03-19",
    history: [
      {
        id: "h26",
        bugId: "11",
        timestamp: "2026-03-19T14:15:00Z",
        actor: "Sarah Lee",
        actionType: "created",
        description: "Created bug: Wrong spelling in about section",
      },
    ],
  },
  {
    id: "12",
    name: "Database indexing missing on users table",
    category: "Database",
    priority: "medium",
    status: "review",
    reporter: "Emma Wilson",
    createdAt: "2026-03-18",
    history: [
      {
        id: "h27",
        bugId: "12",
        timestamp: "2026-03-18T09:30:00Z",
        actor: "Emma Wilson",
        actionType: "created",
        description: "Created bug: Database indexing missing on users table",
      },
      {
        id: "h28",
        bugId: "12",
        timestamp: "2026-03-19T13:00:00Z",
        actor: "Jane Smith",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "in-progress",
        newValue: "review",
        description: "Status changed from In Progress to Review",
      },
    ],
  },
  {
    id: "13",
    name: "Email service integration broken",
    category: "Backend",
    priority: "high",
    status: "in-progress",
    reporter: "Jane Smith",
    createdAt: "2026-03-17",
    history: [
      {
        id: "h29",
        bugId: "13",
        timestamp: "2026-03-17T10:45:00Z",
        actor: "Jane Smith",
        actionType: "created",
        description: "Created bug: Email service integration broken",
      },
      {
        id: "h30",
        bugId: "13",
        timestamp: "2026-03-18T08:20:00Z",
        actor: "Alex Chen",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "todo",
        newValue: "in-progress",
        description: "Status changed from To Do to In Progress",
      },
    ],
  },
  {
    id: "14",
    name: "SSL certificate expiring soon",
    category: "Infrastructure",
    priority: "critical",
    status: "done",
    reporter: "David Park",
    createdAt: "2026-03-16",
    history: [
      {
        id: "h31",
        bugId: "14",
        timestamp: "2026-03-16T07:00:00Z",
        actor: "David Park",
        actionType: "created",
        description: "Created bug: SSL certificate expiring soon",
      },
      {
        id: "h32",
        bugId: "14",
        timestamp: "2026-03-16T07:15:00Z",
        actor: "David Park",
        actionType: "priority_changed",
        fieldName: "priority",
        oldValue: "high",
        newValue: "critical",
        description: "Priority changed from High to Critical",
      },
      {
        id: "h33",
        bugId: "14",
        timestamp: "2026-03-17T14:30:00Z",
        actor: "David Park",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "in-progress",
        newValue: "done",
        description: "Status changed from In Progress to Done",
      },
      {
        id: "h34",
        bugId: "14",
        timestamp: "2026-03-17T14:45:00Z",
        actor: "David Park",
        actionType: "comment_added",
        description: "Added comment: SSL certificate renewed successfully",
      },
    ],
  },
  {
    id: "15",
    name: "Button text overflow on small screens",
    category: "Frontend",
    priority: "low",
    status: "done",
    reporter: "Mike Johnson",
    createdAt: "2026-03-15",
    history: [
      {
        id: "h35",
        bugId: "15",
        timestamp: "2026-03-15T16:00:00Z",
        actor: "Mike Johnson",
        actionType: "created",
        description: "Created bug: Button text overflow on small screens",
      },
      {
        id: "h36",
        bugId: "15",
        timestamp: "2026-03-16T10:30:00Z",
        actor: "John Doe",
        actionType: "status_changed",
        fieldName: "status",
        oldValue: "todo",
        newValue: "done",
        description: "Status changed from To Do to Done",
      },
    ],
  },
];

const KANBAN_COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "review", title: "Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
];

const PRIORITY_FILTERS = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200" },
];

const CATEGORY_FILTERS = [
  { value: "Frontend", label: "Frontend", color: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200" },
  { value: "Backend", label: "Backend", color: "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200" },
  { value: "Content", label: "Content", color: "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200" },
  { value: "Infrastructure", label: "Infrastructure", color: "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200" },
  { value: "Database", label: "Database", color: "bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200" },
];

export default function Dashboard() {
  const [bugs, setBugs] = useState<Bug[]>(PLACEHOLDER_BUGS);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBugClick = (bug: Bug) => {
    setSelectedBug(bug);
    setIsDetailsOpen(true);
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getBugsByStatus = (status: string) => {
    return bugs.filter((bug) => {
      const statusMatch = bug.status === status;
      const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(bug.priority);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(bug.category);
      const searchMatch = searchQuery === "" || 
        bug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.reporter.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && priorityMatch && categoryMatch && searchMatch;
    });
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
          
          {/* Filter Controls */}
          <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Priority Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  Priority Filter
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isPriorityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-slate-700 rounded-lg shadow-lg border border-slate-600 p-4 z-50 min-w-48">
                    {PRIORITY_FILTERS.map((priority) => (
                      <label key={priority.value} className="flex items-center gap-2 py-2 text-white hover:bg-slate-600 px-2 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPriorities.includes(priority.value)}
                          onChange={() => togglePriority(priority.value)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">{priority.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  Category Filter
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-slate-700 rounded-lg shadow-lg border border-slate-600 p-4 z-50 min-w-48">
                    {CATEGORY_FILTERS.map((category) => (
                      <label key={category.value} className="flex items-center gap-2 py-2 text-white hover:bg-slate-600 px-2 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.value)}
                          onChange={() => toggleCategory(category.value)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">{category.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Filters Display */}
              {(selectedPriorities.length > 0 || selectedCategories.length > 0) && (
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedPriorities.map((priority) => {
                    const priorityFilter = PRIORITY_FILTERS.find((p) => p.value === priority);
                    return (
                      <span key={priority} className={`${priorityFilter?.color} text-xs px-2 py-1 rounded-full`}>
                        {priorityFilter?.label}
                      </span>
                    );
                  })}
                  {selectedCategories.map((category) => {
                    const categoryFilter = CATEGORY_FILTERS.find((c) => c.value === category);
                    return (
                      <span key={category} className={`${categoryFilter?.color} text-xs px-2 py-1 rounded-full`}>
                        {category}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search Box */}
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-48"
            />
          </div>

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
