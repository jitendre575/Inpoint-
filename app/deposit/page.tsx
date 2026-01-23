"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Lock, Wallet, ArrowRight, TrendingUp, Sparkles, ChevronRight, Zap } from "lucide-react"

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

  const handleReset = () => {
    setMinAmount("")
    setMaxAmount("")
    setDepositOptions(generateDepositOptions())
  }

  const handleBuy = (amount: number) => {
    router.push(`/payment?amount=${amount}`)
  }

  const { percent, bonus, total } = calculateBonusDetails(Number(customAmount) || 0)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FDFCFF] pb-32 font-sans selection:bg-theme-lavender selection:text-theme-purple">
      {/* Dynamic Header */}
      <div className="bg-[#1A0B2E] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-theme-purple/20 rounded-full -mr-20 -mt-20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-theme-gold/10 rounded-full -ml-10 -mb-10 blur-[80px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner">
              <Wallet className="h-6 w-6 text-theme-gold" />
            </div>
            <div>
              <p className="text-theme-lavender/40 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Elite Liquidity</p>
              <h1 className="text-2xl font-black tracking-tighter">Deposit Funds</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 active:scale-95 hover:bg-white/10 transition-all">
            <ArrowRight className="h-5 w-5 text-theme-lavender rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6">
        {/* Main Deposit Card with Dynamic Bonus */}
        <Card className="bg-white rounded-[3rem] shadow-[0_32px_80px_rgba(109,40,217,0.12)] border border-theme-lavender p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-theme-lavender/40 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />

          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-[#2D1A4A] tracking-tight italic">Quick Deposit</h2>
              <Badge className="bg-theme-gold/10 text-theme-gold border-theme-gold/20 font-black text-[9px] uppercase tracking-widest px-3 py-1">Limited Offer</Badge>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2D1A4A] font-black text-2xl">₹</span>
                <Input
                  type="number"
                  placeholder="Enter Amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-20 pl-14 pr-6 rounded-3xl border-theme-lavender bg-[#F8F7FF] focus:ring-12 focus:ring-theme-purple/5 border-2 text-2xl font-black text-[#2D1A4A] transition-all"
                />
              </div>

              {Number(customAmount) > 0 && (
                <div className="bg-gradient-to-br from-[#1A0B2E] to-[#2D1A4A] p-6 rounded-[2.5rem] text-white shadow-xl shadow-theme-purple/20 animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-theme-gold" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-theme-lavender">Projected Bonus</span>
                    </div>
                    <span className="bg-theme-gold text-[#2D1A4A] px-3 py-1 rounded-full text-[10px] font-black">{percent}% EXTRA</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-theme-gold tracking-tighter">₹{bonus.toFixed(0)}</span>
                    <span className="text-theme-lavender/60 text-xs font-bold uppercase tracking-tight">Reward Credits</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <p className="text-xs font-bold text-theme-lavender">Total Credits: <span className="text-white font-black">₹{total.toFixed(0)}</span></p>
                    <Button
                      onClick={() => handleBuy(Number(customAmount))}
                      className="h-10 bg-white text-theme-purple hover:bg-theme-lavender rounded-xl px-6 font-black text-[10px] uppercase tracking-widest border-0"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              )}

              <div className="px-4 py-3 bg-theme-lavender/30 rounded-2xl border border-theme-purple/5 flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-theme-purple" />
                <p className="text-[10px] font-black text-theme-purple uppercase tracking-tight">
                  {Number(customAmount) < 5000
                    ? "Increase your amount to get a higher bonus (Up to 30%)"
                    : "You've unlocked the Maximum 30% Elite Bonus!"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-theme-lavender shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="Min Price"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="h-12 pl-4 rounded-2xl border-theme-lavender bg-white focus:ring-8 focus:ring-theme-purple/5 border-2 text-center font-bold text-xs"
              />
            </div>
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="Max Price"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="h-12 pl-4 rounded-2xl border-theme-lavender bg-white focus:ring-8 focus:ring-theme-purple/5 border-2 text-center font-bold text-xs"
              />
            </div>
            <Button onClick={handleGo} className="bg-[#1A0B2E] hover:bg-black h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg border-0 shrink-0 active:scale-95 transition-all">
              <ChevronRight className="h-5 w-5 text-white" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Deposit Options */}
      <div className="p-5 space-y-4 pt-10">
        <div className="px-5 mb-6 flex items-center justify-between">
          <h3 className="text-[11px] font-black text-theme-purple/40 uppercase tracking-[0.3em]">Verified Liquidity Pools</h3>
          <Zap className="h-4 w-4 text-theme-gold opacity-30" />
        </div>

        {depositOptions.map((option, index) => (
          <Card key={index} className="p-6 bg-white border border-theme-purple/5 shadow-[0_16px_32px_rgba(109,40,217,0.04)] rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-theme-lavender/30 rounded-full -mr-12 -mt-12 group-hover:bg-theme-lavender transition-colors" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-theme-lavender to-white border border-theme-purple/5 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
                  <span className="text-theme-purple text-2xl font-black italic">₹</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-black">
                    <p className="text-2xl font-black tracking-tighter">₹{option.amount}</p>
                    <Badge className="bg-[#F8F7FF] text-theme-purple border-theme-purple/10 text-[8px] font-black uppercase px-2 py-0.5 tracking-widest">Pool B</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-theme-purple/40 uppercase tracking-[0.1em]">
                    <span>Bonus:</span>
                    <span className="text-theme-gold font-black italic">₹{option.profit}</span>
                    <span className="text-[8px] opacity-60">({option.profitPercent}%)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-right">
                <Button
                  onClick={() => handleBuy(option.amount)}
                  className="h-12 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white font-black rounded-xl px-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-theme-purple/10 active:scale-95 border-0"
                >
                  Buy
                </Button>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-theme-gold/5 rounded-full border border-theme-gold/10">
                  <span className="text-[10px] font-black text-theme-gold uppercase tracking-tighter">Yield: ₹{option.incoin}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showUsdtLock} onOpenChange={setShowUsdtLock}>
        <DialogContent className="max-w-xs p-10 rounded-[3.5rem] border-0 bg-white shadow-3xl">
          <div className="text-center space-y-8">
            <div className="h-24 w-24 rounded-[2.5rem] bg-theme-gold/10 flex items-center justify-center mx-auto border-2 border-theme-gold/20 shadow-2xl shadow-theme-gold/10 animate-bounce">
              <Lock className="h-12 w-12 text-theme-gold" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#2D1A4A] tracking-tighter italic">Tier-2 Authentication</h3>
              <p className="text-theme-purple/50 text-xs font-bold leading-relaxed px-2 uppercase tracking-tight">
                USDT (ERC-20/TRC-20) access is restricted to verified high-net-worth accounts.
              </p>
            </div>
            <Button
              onClick={() => setShowUsdtLock(false)}
              className="w-full h-16 bg-[#1A0B2E] text-white font-black rounded-2xl tracking-[0.2em] uppercase text-xs border-0 shadow-2xl active:scale-95 transition-all"
            >
              Verify Identity
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav active="wallet" />
    </div>
  )
}
