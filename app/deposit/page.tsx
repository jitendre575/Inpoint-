"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Lock, Wallet, ArrowRight, TrendingUp, Sparkles, ChevronRight, Zap, Gift, Activity } from "lucide-react"

const calculateBonusDetails = (amount: number) => {
  let percent = 10
  if (amount >= 5000) percent = 30
  else if (amount >= 3000) percent = 25
  else if (amount >= 1000) percent = 20
  else if (amount >= 500) percent = 15

  const bonus = (amount * percent) / 100
  return { percent, bonus, total: amount + bonus }
}

const generateDepositOptions = (min?: number, max?: number) => {
  const baseAmounts = [100, 200, 300, 500, 800, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000]
  let filtered = baseAmounts.filter(amount => {
    if (min !== undefined && amount < min) return false
    if (max !== undefined && amount > max) return false
    return true
  })

  return filtered.map(amount => {
    const { percent, bonus, total } = calculateBonusDetails(amount)
    return {
      amount,
      profit: bonus.toFixed(0),
      incoin: total.toFixed(0),
      profitPercent: percent,
    }
  })
}

export default function DepositPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"INR" | "USDT">("INR")
  const [customAmount, setCustomAmount] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [depositOptions, setDepositOptions] = useState(generateDepositOptions())
  const [showUsdtLock, setShowUsdtLock] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGo = () => {
    const min = minAmount ? Number.parseFloat(minAmount) : undefined
    const max = maxAmount ? Number.parseFloat(maxAmount) : undefined
    setDepositOptions(generateDepositOptions(min, max))
  }

  const handleBuy = (amount: number) => {
    router.push(`/payment?amount=${amount}`)
  }

  const { percent, bonus, total } = calculateBonusDetails(Number(customAmount) || 0)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-32 font-sans selection:bg-green-100">
      {/* 1. Deep Green Header */}
      <div className="bg-[#14532D] text-white px-6 pt-12 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-6 right-6 h-10 w-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
          <span className="text-green-300 font-bold text-xs uppercase tracking-widest">PRO</span>
        </div>

        <div className="relative z-10 flex items-center justify-between font-sans">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner">
              <Wallet className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Vault Liquidity</p>
              <h1 className="text-xl font-bold tracking-tighter uppercase not-italic text-white">Deposit Node</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-11 w-11 bg-white/10 rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-all">
            <ArrowRight className="h-5 w-5 text-white/60 rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6">
        {/* Main Deposit Card */}
        <Card className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(20,83,45,0.08)] border border-green-50 p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase not-italic">Quick Deposit</h2>
              <Badge className="bg-green-50 text-green-600 border border-green-100 font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">Active Bonus</Badge>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xl group-focus-within:text-green-500 transition-colors">₹</span>
                <Input
                  type="number"
                  placeholder="Enter Capital Amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-12 pl-10 pr-4 rounded-xl border-green-50 bg-[#F0FDF4]/30 focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 border-2 text-lg font-bold text-slate-900 transition-all placeholder:text-slate-300"
                />
              </div>

              {Number(customAmount) > 0 && (
                <div className="bg-[#14532D] p-7 rounded-[2.5rem] text-white shadow-2xl animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-[10px] font-bold uppercase tracking-[2px] text-green-300/60">Yield Forecast</span>
                    </div>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">{percent}% ALPHA</span>
                  </div>
                  <div className="flex items-baseline justify-center mb-6">
                    <span className="text-4xl font-black text-white tracking-tighter italic">₹{bonus.toFixed(0)}</span>
                    <span className="text-green-300/40 text-[10px] font-bold uppercase tracking-widest ml-2">Extra Credit</span>
                  </div>
                  <Button
                    onClick={() => handleBuy(Number(customAmount))}
                    className="w-full h-12 premium-gradient text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-green-900/40 border-0 active:scale-95 transition-all"
                  >
                    Confirm & Deposit
                  </Button>
                </div>
              )}

              <div className="px-4 py-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4 group">
                <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-green-50 group-hover:rotate-12 transition-transform">
                  <Gift className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {Number(customAmount) < 5000
                    ? "Boost your deposit for higher recurring yields (Max 30%)"
                    : "Elite Tier Liquidity Bonus Enabled!"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-5 space-y-4 pt-8 pb-40">
        <div className="px-3 mb-6 flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[3px]">Verified Portfolios</h3>
          <Zap className="h-4 w-4 text-green-200 fill-green-200" />
        </div>

        {depositOptions.map((option, index) => (
          <Card key={index} className="p-5 bg-white border border-green-50 shadow-sm rounded-3xl hover:shadow-md transition-all group overflow-hidden relative border-0">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                  <Activity className="h-5 w-5 text-green-600 stroke-[2.5px]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-slate-900">
                    <p className="text-xl font-bold tracking-tight">₹{option.amount}</p>
                    <div className="bg-green-100 text-green-600 px-1.5 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest">Pool C</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Bonus:</span>
                    <span className="text-green-600">₹{option.profit}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleBuy(option.amount)}
                  className="h-9 px-6 premium-gradient text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md shadow-green-100 active:scale-95 transition-all border-0"
                >
                  Join
                </button>
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-none pt-0.5">Yield: ₹{option.incoin}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
