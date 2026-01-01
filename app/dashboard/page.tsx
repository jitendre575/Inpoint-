"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlansModal } from "@/components/plans-modal"
import { BottomNav } from "@/components/bottom-nav"
import { DownloadAppButton } from "@/components/download-app-button"
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Users, Gift, UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [historyTab, setHistoryTab] = useState<'deposits' | 'withdrawals'>('deposits')

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
    } else {
      const dbUser = JSON.parse(currentUser)
      setUser(dbUser) // Set initial data from local storage to avoid flicker

      // Fetch fresh data
      fetch('/api/user/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: dbUser.id })
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user)
            localStorage.setItem("currentUser", JSON.stringify(data.user))
          }
        })
        .catch(err => console.error("Failed to refresh user data", err))

      // Show plans modal on first load
      const hasSeenModal = sessionStorage.getItem("hasSeenPlansModal")
      if (!hasSeenModal) {
        setShowPlansModal(true)
        sessionStorage.setItem("hasSeenPlansModal", "true")
      }
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* 1. Header Section */}
      <div className="bg-emerald-600 text-white px-6 pt-12 pb-24 relative overflow-hidden rounded-b-[2.5rem] shadow-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Welcome Back</p>
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <DownloadAppButton
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
            />
            <div className="text-right hidden sm:block">
              <p className="text-xs text-emerald-100">User Profile</p>
            </div>
            <Button
              onClick={() => router.push("/mine")}
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0 transition-all border border-emerald-400/30"
            >
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Total Balance Card */}
      <div className="px-5 -mt-16 relative z-20">
        <Card className="bg-white shadow-xl shadow-emerald-900/5 rounded-3xl p-6 border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50 rounded-full -ml-8 -mb-8 opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-500" />
                Total Balance
              </span>
              <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                Verified
              </div>
            </div>

            <div className="mt-2 mb-6">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                ₹{user.wallet?.toFixed(2) || "0.00"}
              </h2>
              <p className="text-emerald-600 text-sm font-medium mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% this month
              </p>
            </div>

            <Button
              onClick={() => setShowPlansModal(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 shadow-lg shadow-emerald-600/20 text-base font-semibold transition-all"
            >
              Start Investing
            </Button>
          </div>
        </Card>
      </div>

      {/* Buttons Grid */}
      <div className="px-5 mt-8">
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => router.push("/deposit")}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95">
              <ArrowDownRight className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Deposit</span>
          </button>

          <button
            onClick={() => router.push("/withdraw")}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95">
              <ArrowUpRight className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Withdraw</span>
          </button>

          <button
            onClick={() => router.push("/team")}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Team</span>
          </button>

          <button
            onClick={() => setShowPlansModal(true)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95">
              <Gift className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Plans</span>
          </button>
        </div>
      </div>

      {/* Investment Plans Section */}
      <div className="px-5 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Investment Plans</h2>
          <Button
            onClick={() => setShowPlansModal(true)}
            variant="ghost"
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-semibold transition-all p-0 h-auto"
          >
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {/* Plan Cards (Static for now as per design) */}
          <Card className="p-5 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 ring-1 ring-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Starter Plan</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">7 Days Duration</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">12%</p>
                <p className="text-xs text-gray-500 mt-0.5">Return</p>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Investment</span>
                <span className="font-bold text-gray-900">₹1,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Profit</span>
                <span className="font-bold text-emerald-600">+₹120</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Investments */}
      <div className="px-5 mt-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Investments</h2>
        {user.plans && user.plans.length > 0 ? (
          <div className="space-y-3">
            {user.plans.map((plan: any, index: number) => (
              <Card key={index} className="p-5 border-0 shadow-md bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{plan.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Invested: ₹{plan.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{plan.return}%</p>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.duration}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 border-0 shadow-sm bg-gray-50/50">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-gray-900 font-semibold text-base mb-2">No active plans yet</p>
              <Button onClick={() => setShowPlansModal(true)} variant="outline" className="border-emerald-600 text-emerald-600">
                Explore Plans
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="px-5 mt-8 mb-20 bg-white pt-6 pb-6 rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Transaction History</h2>

        <div className="w-full">
          <div className="flex gap-4 border-b border-gray-100 pb-0 mb-6 px-2">
            <button
              onClick={() => setHistoryTab('deposits')}
              className={`flex-1 pb-3 font-semibold text-sm transition-all ${historyTab === 'deposits' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-400'}`}>
              Deposits
            </button>
            <button
              onClick={() => setHistoryTab('withdrawals')}
              className={`flex-1 pb-3 font-semibold text-sm transition-all ${historyTab === 'withdrawals' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-400'}`}>
              Withdrawals
            </button>
          </div>

          <div className="space-y-4 px-2">
            {historyTab === 'deposits' ? (
              (user.deposits || []).length > 0 ? (
                // Reverse to show newest first
                (user.deposits.slice().reverse() as any[]).map((deposit) => (
                  <div key={deposit.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">₹{deposit.amount}</p>
                      <p className="text-xs text-gray-500">{new Date(deposit.date).toLocaleDateString()}</p>
                    </div>
                    <Badge className={
                      deposit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        deposit.status === 'Approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }>{deposit.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">No deposit history</p>
              )
            ) : (
              (user.withdrawals || []).length > 0 ? (
                (user.withdrawals.slice().reverse() as any[]).map((withdrawal) => (
                  <div key={withdrawal.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">₹{withdrawal.amount}</p>
                      <p className="text-xs text-gray-500">{new Date(withdrawal.date).toLocaleDateString()}</p>
                    </div>
                    <Badge className={
                      withdrawal.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        withdrawal.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }>{withdrawal.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">No withdrawal history</p>
              )
            )}
          </div>
        </div>
      </div>

      <PlansModal open={showPlansModal} onClose={() => setShowPlansModal(false)} />

      {/* Support FAB */}
      <a
        href="mailto:support@example.com?subject=Support Request"
        className="fixed bottom-24 right-5 z-50 h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </a>

      <BottomNav active="home" />
    </div>
  )
}
