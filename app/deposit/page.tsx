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
      {/* 1. Purple Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-6 pt-12 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-3xl border-b border-white/5">
        <div className="absolute top-6 right-6 h-10 w-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
          <span className="text-[#00F0FF] font-black text-[9px] uppercase tracking-widest">RSA CI</span>
        </div>

        <div className="relative z-10 flex items-center justify-between font-sans">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner purple-glow">
              <Wallet className="h-6 w-6 text-[#5B2EFF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[3px] mb-1">Vault Liquidity</p>
              <h1 className="text-xl font-black tracking-tight uppercase text-white leading-none">Deposit Node</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-11 w-11 bg-white/5 rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-all">
            <ArrowRight className="h-5 w-5 text-slate-400 rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6">
        {/* Main Deposit Card */}
        <Card className="glass-card bg-[#121A33]/80 rounded-[3rem] shadow-3xl border border-white/5 p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight uppercase">Quick Entry</h2>
              <Badge className="bg-[#5B2EFF]/10 text-[#00F0FF] border-0 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg">Alpha Boost</Badge>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xl group-focus-within:text-[#5B2EFF] transition-colors">₹</span>
                <Input
                  type="number"
                  placeholder="Deployment Capital"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-14 pl-10 pr-4 rounded-xl border-white/5 bg-black/20 focus:bg-black/40 focus:ring-4 focus:ring-[#5B2EFF]/10 focus:border-[#5B2EFF]/20 border-2 text-lg font-black text-white transition-all placeholder:text-slate-700"
                />
              </div>

              {Number(customAmount) > 0 && (
                <div className="bg-[#0F1C3F] p-7 rounded-[2.5rem] text-white shadow-2xl animate-in zoom-in-95 duration-500 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp size={100} className="text-[#00F0FF]" />
                  </div>
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#00F0FF]" />
                      <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400">Yield Forecast</span>
                    </div>
                    <span className="bg-[#5B2EFF]/20 text-[#00F0FF] px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase">{percent}% ALPHA</span>
                  </div>
                  <div className="flex items-baseline justify-center mb-6 relative z-10">
                    <span className="text-4xl font-black text-white tracking-tighter">₹{bonus.toFixed(0)}</span>
                    <span className="text-[#5B2EFF] text-[10px] font-black uppercase tracking-widest ml-2">Extra Hub</span>
                  </div>
                  <Button
                    onClick={() => handleBuy(Number(customAmount))}
                    className="w-full h-12 premium-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-[4px] shadow-2xl border-0 active:scale-95 transition-all purple-glow"
                  >
                    Authorize Deposit
                  </Button>
                </div>
              )}

              <div className="px-5 py-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 group">
                <div className="h-10 w-10 bg-[#0F1C3F] rounded-xl flex items-center justify-center shadow-2xl border border-white/5 group-hover:rotate-12 transition-transform">
                  <Gift className="h-5 w-5 text-[#5B2EFF]" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                  {Number(customAmount) < 5000
                    ? "Boost your deployment for higher recurring yields (Max 30%)"
                    : "Elite Tier Node Bonus Fully Connected!"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-5 space-y-4 pt-8 pb-40">
        <div className="px-3 mb-6 flex items-center justify-between">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[5px]">Network Portfolios</h3>
          <Zap className="h-4 w-4 text-[#00F0FF] fill-[#00F0FF]" />
        </div>

        {depositOptions.map((option, index) => (
          <Card key={index} className="p-6 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-xl rounded-[2rem] hover:shadow-[#5B2EFF]/5 transition-all group overflow-hidden relative border-0">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                  <Activity className="h-5 w-5 text-[#5B2EFF] stroke-[2.5px]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-white">
                    <p className="text-xl font-black tracking-tight leading-none uppercase">₹{option.amount}</p>
                    <div className="bg-[#00F0FF]/10 text-[#00F0FF] px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">Node {index + 1}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Alpha:</span>
                    <span className="text-[#10B981]">₹{option.profit}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-right">
                <button
                  onClick={() => handleBuy(option.amount)}
                  className="h-10 px-8 premium-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-[4px] shadow-xl active:scale-95 transition-all border-0 purple-glow"
                >
                  Join
                </button>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none pt-0.5">Yield: ₹{option.incoin}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
