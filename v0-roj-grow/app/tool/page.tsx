"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

export default function ToolPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(JSON.parse(currentUser))
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h1 className="text-center text-2xl font-bold">Tools</h1>
      </div>

      <div className="p-6 space-y-4">
        <Card className="p-6 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Tools</h2>
          <p className="text-sm text-gray-600">Access all your investment tools in one place</p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card
            onClick={() => router.push("/deposit")}
            className="p-6 cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
          >
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">Deposit</h3>
            <p className="text-xs text-white/80">Add funds to wallet</p>
          </Card>

          <Card
            onClick={() => router.push("/withdraw")}
            className="p-6 cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-orange-500 to-red-500 text-white"
          >
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">Withdraw</h3>
            <p className="text-xs text-white/80">Cash out earnings</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">Calculator</h3>
            <p className="text-xs text-white/80">Profit calculator</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">Analytics</h3>
            <p className="text-xs text-white/80">View statistics</p>
          </Card>
        </div>

        <Card className="p-6 shadow-lg">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Deposit Successful</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm font-bold text-emerald-600">+₹{user.wallet?.toFixed(0) || "0"}</p>
            </div>

            <div className="text-center py-6 text-gray-500 text-sm">No more activities</div>
          </div>
        </Card>
      </div>

      <BottomNav active="tool" />
    </div>
  )
}
