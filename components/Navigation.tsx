"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-white">
              🐛 BugTracker
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
              } pb-2`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`transition-colors ${
                isActive("/dashboard")
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
              } pb-2`}
            >
              Dashboard
            </Link>
            <Link
              href="/report"
              className={`transition-colors ${
                isActive("/report")
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
              } pb-2`}
            >
              Report Bug
            </Link>
          </div>

          {/* Mobile Menu Button (placeholder) */}
          <div className="md:hidden">
            <button className="text-slate-300 hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
