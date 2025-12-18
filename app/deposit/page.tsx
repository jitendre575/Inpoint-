"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock } from "lucide-react"

const generateDepositOptions = (min?: number, max?: number) => {
  const baseAmounts = [100, 101, 102, 105, 110, 120, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000]
  const options = []

  for (const amount of baseAmounts) {
    if (min && amount < min) continue
    if (max && amount > max) continue

    const profitPercent = 5
    const fixedBonus = 8
    const profit = (amount * profitPercent) / 100 + fixedBonus
    const incoin = amount + profit

    options.push({
      amount,
      profit: profit.toFixed(1),
      incoin: incoin.toFixed(1),
      profitPercent,
    })
  }

  return options
}

export default function DepositPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"INR" | "USDT">("INR")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [depositOptions, setDepositOptions] = useState(generateDepositOptions())
  const [showUsdtLock, setShowUsdtLock] = useState(false)

  const handleGo = () => {
    const min = minAmount ? Number.parseFloat(minAmount) : undefined
    const max = maxAmount ? Number.parseFloat(maxAmount) : undefined
    setDepositOptions(generateDepositOptions(min, max))
  }

  const handleReset = () => {
    setMinAmount("")
    setMaxAmount("")
    setDepositOptions(generateDepositOptions())
  }

  const handleBuy = (amount: number) => {
    router.push(`/payment?amount=${amount}`)
  }

  const handleUsdtClick = () => {
    setShowUsdtLock(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Deposit</h1>
          <button className="p-2 rounded-lg hover:bg-white/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("INR")}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === "INR" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"
            }`}
          >
            INR
          </button>
          <button
            onClick={handleUsdtClick}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === "USDT" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-400"
            }`}
          >
            USDT
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="flex-1 h-12 text-center text-base"
          />
          <span className="text-gray-400 font-bold">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="flex-1 h-12 text-center text-base"
          />
          <Button onClick={handleGo} className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-base font-semibold">
            Go
          </Button>
          <Button onClick={handleReset} className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 text-base font-semibold">
            Reset
          </Button>
        </div>
      </div>

      {/* Deposit Options */}
      <div className="p-4 space-y-3">
        {depositOptions.map((option, index) => (
          <Card key={index} className="p-4 shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-xl font-bold">₹</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-lg font-bold text-gray-900">{option.amount}Rs</p>
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-700">
                      BANK
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="font-medium">Reward</span>
                    <span className="text-yellow-500 text-base">🪙</span>
                    <span className="font-semibold text-gray-900">{option.profit}</span>
                    <span className="text-gray-500 text-xs">({option.profitPercent}% +₹8)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button
                  onClick={() => handleBuy(option.amount)}
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-6 py-2 mb-2 text-base font-semibold shadow-md"
                >
                  Buy
                </Button>
                <div className="text-xs text-gray-500">
                  <p className="mb-0.5">InCoin</p>
                  <p className="flex items-center justify-end gap-1">
                    <span className="font-semibold text-gray-900 text-sm">+{option.incoin}</span>
                    <span className="text-yellow-500">🪙</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showUsdtLock} onOpenChange={setShowUsdtLock}>
        <DialogContent className="max-w-sm bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">Premium Feature Locked</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-pulse shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
            </div>
            <p className="text-gray-700 text-base mb-6 px-4 leading-relaxed">
              This option has been locked as a premium feature. Please contact support to unlock USDT deposits.
            </p>
            <Button
              onClick={() => setShowUsdtLock(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-semibold"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav active="wallet" />
    </div>
  )
}
