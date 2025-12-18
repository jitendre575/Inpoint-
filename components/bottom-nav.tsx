"use client"

import Link from "next/link"

interface BottomNavProps {
  active: "home" | "wallet" | "tool" | "team" | "mine"
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around py-2">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${active === "home" ? "text-emerald-600" : "text-gray-400"
            }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/deposit"
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${active === "wallet" ? "text-emerald-600" : "text-gray-400"
            }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs">Deposit</span>
        </Link>

        {/* Center Tool Button */}
        <Link
          href="/tool"
          className={`flex flex-col items-center gap-1 px-3 py-2 -mt-6 transition-colors ${active === "tool" ? "text-emerald-600" : "text-gray-400"
            }`}
        >
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-xs mt-1">Tool</span>
        </Link>

        <Link
          href="/team"
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${active === "team" ? "text-emerald-600" : "text-gray-400"
            }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-xs">Team</span>
        </Link>

        <Link
          href="/mine"
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${active === "mine" ? "text-emerald-600" : "text-gray-400"
            }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs">Mine</span>
        </Link>
      </div>
    </div>
  )
}
