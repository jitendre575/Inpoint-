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
    <div className="min-h-screen bg-[#0B1020] pb-32 font-sans selection:bg-purple-500/30">
      {/* Refined Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-5 pt-12 pb-16 relative overflow-hidden rounded-b-2xl shadow-xl border-b border-white/5">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner">
              <Wallet className="h-4 w-4 text-[#5B2EFF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-widest mb-0.5">Vault Liquidity</p>
              <h1 className="text-lg font-bold tracking-tight uppercase text-white leading-none">Deposit Node</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-9 w-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-95 transition-all">
            <ArrowRight className="h-4 w-4 text-[#00F0FF] rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-20 space-y-4">
        {/* Main Deposit Card */}
        <Card className="glass-card bg-[#121A33]/80 rounded-2xl shadow-2xl border border-white/5 p-5 relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white tracking-tight uppercase">Quick Entry</h2>
              <Badge className="bg-[#5B2EFF]/10 text-[#00F0FF] border-0 font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-md">Alpha Boost</Badge>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base transition-colors group-focus-within:text-[#5B2EFF]">₹</span>
                <Input
                  type="number"
                  placeholder="Deployment Capital"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-11 pl-8 pr-4 rounded-xl border-white/5 bg-black/20 focus:bg-black/40 border-2 text-sm font-semibold text-white transition-all placeholder:text-slate-800"
                />
              </div>

              {Number(customAmount) > 0 && (
                <div className="bg-[#0F1C3F] p-4 rounded-xl text-white shadow-xl animate-in zoom-in-95 duration-500 border border-white/5 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-[#00F0FF]" />
                      <span className="text-[7px] font-semibold uppercase tracking-widest text-slate-400">Yield Forecast</span>
                    </div>
                    <span className="bg-[#5B2EFF]/20 text-[#00F0FF] px-1.5 py-0.5 rounded text-[7px] font-bold tracking-widest uppercase">{percent}% ALPHA</span>
                  </div>
                  <div className="flex items-baseline justify-center mb-4 relative z-10">
                    <span className="text-2xl font-bold text-white tracking-tight">₹{bonus.toFixed(0)}</span>
                    <span className="text-[#5B2EFF] text-[8px] font-semibold uppercase tracking-widest ml-1.5">Extra Hub</span>
                  </div>
                  <Button
                    onClick={() => handleBuy(Number(customAmount))}
                    className="w-full h-10 premium-gradient text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all border-0"
                  >
                    Authorize Deposit
                  </Button>
                </div>
              )}

              <div className="px-3 py-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="h-8 w-8 bg-[#0F1C3F] rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                  <Gift className="h-4 w-4 text-[#5B2EFF]" />
                </div>
                <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest leading-relaxed">
                  {Number(customAmount) < 5000
                    ? "Boost deployment for higher yields (Max 30%)"
                    : "Elite Tier Node Bonus Connected!"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-4 space-y-3 pt-6 pb-32">
        <div className="px-2 mb-4 flex items-center justify-between">
          <h3 className="text-[9px] font-semibold text-white uppercase tracking-widest">Network Portfolios</h3>
          <Zap className="h-3.5 w-3.5 text-[#00F0FF] fill-[#00F0FF]" />
        </div>

        {depositOptions.map((option, index) => (
          <Card key={index} className="p-3.5 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-lg rounded-xl transition-all group overflow-hidden relative border-0">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-[#5B2EFF] stroke-[2.5px]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-white">
                    <p className="text-base font-bold tracking-tight leading-none uppercase">₹{option.amount}</p>
                    <div className="bg-[#00F0FF]/10 text-[#00F0FF] px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest">Node {index + 1}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[8px] font-semibold text-slate-500 uppercase tracking-widest">
                    <span>Alpha:</span>
                    <span className="text-[#10B981] font-bold">₹{option.profit}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 text-right">
                <button
                  onClick={() => handleBuy(option.amount)}
                  className="h-8 px-5 premium-gradient text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all border-0"
                >
                  Join
                </button>
                <span className="text-[7px] font-semibold text-slate-600 uppercase tracking-widest leading-none">Yield: ₹{option.incoin}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
