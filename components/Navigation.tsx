"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-white">
              🐛 BugTerra
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
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
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-3">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button (placeholder) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive("/")
                  ? "bg-blue-500 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/login"
              className="block py-2 px-4 rounded text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
