"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlansModal } from "@/components/plans-modal"
import { BottomNav } from "@/components/bottom-nav"
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Users, Gift } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showPlansModal, setShowPlansModal] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
    } else {
      const userData = JSON.parse(currentUser)
      setUser(userData)

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-8 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/tovexar-logo.png"
              alt="Tovexar Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
          <Button
            onClick={() => router.push("/mine")}
            variant="ghost"
            className="text-white hover:bg-white/20 rounded-full h-11 w-11 p-0 transition-all"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Button>
        </div>

        <div className="relative z-10 mt-4">
          <p className="text-white/70 text-sm font-medium mb-1">Welcome Back</p>
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
        </div>
      </div>

      <div className="px-5 -mt-16 relative z-20">
        <Card className="bg-white shadow-xl rounded-2xl p-6 border-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Total Balance</p>
                <p className="text-xs text-gray-500">InCoin Wallet</p>
              </div>
            </div>
            <Button
              onClick={() => setShowPlansModal(true)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              <TrendingUp className="h-4 w-4 mr-1.5" />
              Invest
            </Button>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold text-gray-900 mb-1">₹{user.wallet?.toFixed(2) || "0.00"}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                <span>+12.5%</span>
              </div>
              <span className="text-gray-400 text-sm">This month</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-5 mt-6">
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => router.push("/deposit")}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <ArrowDownRight className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Deposit</span>
          </button>

          <button
            onClick={() => router.push("/withdraw")}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <ArrowUpRight className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Withdraw</span>
          </button>

          <button
            onClick={() => router.push("/team")}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Team</span>
          </button>

          <button
            onClick={() => setShowPlansModal(true)}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Plans</span>
          </button>
        </div>
      </div>

      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Investment Plans</h2>
          <Button
            onClick={() => setShowPlansModal(true)}
            variant="ghost"
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-sm font-semibold transition-all"
          >
            View All
          </Button>
        </div>

        <div className="space-y-3">
          <Card className="p-5 border-0 shadow-md bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Starter Plan</h3>
                <p className="text-sm text-gray-500 mt-0.5">7 days</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">12%</p>
                <p className="text-xs text-gray-500 mt-0.5">Return</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investment</span>
                <span className="font-semibold text-gray-900">₹1000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Profit</span>
                <span className="font-semibold text-indigo-600">₹1120</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hourly Increment</span>
                <span className="font-semibold text-gray-900">₹5</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-0 shadow-md bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Growth Plan</h3>
                <p className="text-sm text-gray-500 mt-0.5">7 days</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">18%</p>
                <p className="text-xs text-gray-500 mt-0.5">Return</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investment</span>
                <span className="font-semibold text-gray-900">₹5000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Profit</span>
                <span className="font-semibold text-indigo-600">₹5900</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hourly Increment</span>
                <span className="font-semibold text-gray-900">₹5</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-0 shadow-md bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Premium Plan</h3>
                <p className="text-sm text-gray-500 mt-0.5">21 days</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">25%</p>
                <p className="text-xs text-gray-500 mt-0.5">Return</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investment</span>
                <span className="font-semibold text-gray-900">₹10000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Profit</span>
                <span className="font-semibold text-indigo-600">₹12500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hourly Increment</span>
                <span className="font-semibold text-gray-900">₹5</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
                    <p className="text-2xl font-bold text-indigo-600">{plan.return}%</p>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: "45%" }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">45%</span>
                </div>
                <p className="text-xs text-gray-500">
                  Expected profit: ₹{(plan.amount * (plan.return / 100)).toFixed(2)}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 border-0 shadow-md bg-white">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-gray-900 font-semibold text-base mb-2">No active plans yet</p>
              <p className="text-sm text-gray-500 mb-4">Start investing to grow your wealth</p>
              <Button
                onClick={() => setShowPlansModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
              >
                Explore Plans
              </Button>
            </div>
          </Card>
        )}
      </div>

      <PlansModal open={showPlansModal} onClose={() => setShowPlansModal(false)} />
      <BottomNav active="home" />
    </div>
  )
}
