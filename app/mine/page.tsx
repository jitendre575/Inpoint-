"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

export default function MinePage() {
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

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id || "1181139")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white p-6 pb-8">
        <h1 className="text-center text-2xl font-bold">Mine</h1>
      </div>

      {/* User Profile Section */}
      <div className="px-4 -mt-4">
        <Card className="p-4 shadow-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden">
                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">{user.name || "3lux9l7"}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">ID: {user.id || "1181139"}</p>
                  <button onClick={handleCopyId} className="text-gray-400 hover:text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-4 space-y-4">
        {/* InCoin Balance Card */}
        <Card className="p-6 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-purple-100 mb-1">InCoin balance (1 InCoin = 1 Rs)</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🪙</span>
                <span className="text-4xl font-bold">{user.wallet?.toFixed(1) || "61.6"}</span>
              </div>
              <p className="text-sm text-purple-100 mt-2">
                Today's earnings: <span className="font-semibold">0</span>
              </p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">Detail</Button>
          </div>
        </Card>

        {/* Withdrawal Card */}
        <Card className="p-6 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Withdrawal</h2>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">Manage</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-emerald-100">In transaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-emerald-100">Today withdraw</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-emerald-100">
              In withdraw UPI tool: <span className="font-semibold text-lg">0</span>
            </p>
          </div>
        </Card>

        {/* Deposit Card */}
        <Card className="p-6 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <h2 className="text-xl font-bold mb-4">Deposit(Buy INR)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-blue-100">Today's Orders</p>
            </div>
            <div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-blue-100">Today's Total</p>
            </div>
          </div>
        </Card>

        {/* Common Functions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Common functions</h3>
          <div className="grid grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Bills</span>
            </button>
            <button onClick={() => router.push("/deposit")} className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Deposit</span>
            </button>
            <button onClick={() => router.push("/withdraw")} className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Withdrawal</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">service</span>
            </button>
          </div>
        </div>

        {/* Other Functions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Other functions</h3>
          <div className="grid grid-cols-4 gap-4">
            <button onClick={() => router.push("/bonus")} className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center text-3xl">
                🎁
              </div>
              <span className="text-sm text-gray-700 font-medium">Bonus</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center text-3xl">
                🎯
              </div>
              <span className="text-sm text-gray-700 font-medium">Lucky draw</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Inbox</span>
            </button>
            <button onClick={() => router.push("/password")} className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Password</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Pin</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">भाषा</span>
            </button>
            <button onClick={() => router.push("/settings")} className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Settings</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("currentUser")
                router.push("/login")
              }}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
