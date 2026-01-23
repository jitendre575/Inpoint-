"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Gift, TrendingUp, Users, Award, Star, Zap, ChevronRight, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function BonusPage() {
  const router = useRouter()
  const { toast } = useToast()
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
    <div className="min-h-screen bg-[#FDFCFF] pb-32 selection:bg-theme-lavender selection:text-theme-purple">
      {/* Premium Luxury Header */}
      <div className="bg-[#1A0B2E] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-theme-purple/20 rounded-full -mr-20 -mt-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-theme-gold/10 rounded-full -ml-10 -mb-10 blur-[80px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <Trophy className="h-6 w-6 text-theme-gold" />
            </div>
            <div>
              <p className="text-theme-lavender/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Elite Incentives</p>
              <h1 className="text-2xl font-black tracking-tighter">Bonus Center</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 active:scale-95 transition-all">
            <ChevronRight className="h-5 w-5 text-theme-lavender rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Featured Bonus Card */}
        <Card className="p-10 bg-gradient-to-br from-theme-gold/80 via-theme-gold to-yellow-600 border-0 shadow-3xl shadow-theme-gold/20 rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-[2rem] flex items-center justify-center border-4 border-white/30 backdrop-blur-xl">
                <Gift className="h-9 w-9 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#1A0B2E] tracking-tighter italic leading-none">Welcome Gift</h2>
                <p className="text-[#1A0B2E]/50 text-[10px] font-black uppercase tracking-widest mt-1">Verified User Reward</p>
              </div>
            </div>
            <div className="bg-[#1A0B2E]/10 p-6 rounded-[2.5rem] border border-white/20">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#1A0B2E] tracking-tighter">₹50</span>
                <span className="text-[#1A0B2E]/60 text-xs font-black uppercase tracking-widest">Received</span>
              </div>
              <p className="text-[#1A0B2E]/40 text-[9px] font-bold uppercase mt-2">Authenticated successfully during onboarding</p>
            </div>
          </div>
        </Card>

        {/* Dynamic Rewards List */}
        <div className="space-y-4">
          <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.3em] pl-6">Active Incentives</p>

          <Card className="p-8 bg-white border border-theme-purple/5 shadow-xl rounded-[3rem] group hover:bg-theme-lavender/10 transition-all cursor-pointer">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-16 w-16 bg-theme-gold/10 rounded-[2rem] flex items-center justify-center group-hover:rotate-12 transition-transform">
                <TrendingUp className="h-8 w-8 text-theme-gold" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#2D1A4A] tracking-tighter italic">Investment Multiplier</h3>
                <Badge className="bg-theme-gold/5 text-theme-gold border-0 text-[8px] font-black mt-1">Earn up to 30% Extra</Badge>
              </div>
            </div>
            <p className="text-theme-purple/50 text-xs font-bold leading-relaxed mb-8 px-2 uppercase tracking-tight">Every capital injection triggers an instant liquidity bonus tied to your deposit tier.</p>
            <Button onClick={() => router.push("/deposit")} className="w-full h-14 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white border-0 font-black rounded-2xl tracking-widest uppercase text-[10px] shadow-2xl active:scale-95 transition-all">
              Fuel My Portfolio
            </Button>
          </Card>

          <Card className="p-8 bg-[#1A0B2E] border-0 shadow-xl rounded-[3rem] group">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-16 w-16 bg-white/5 rounded-[2rem] flex items-center justify-center group-hover:rotate-12 transition-transform border border-white/10">
                <Users className="h-8 w-8 text-theme-gold" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tighter italic">Network Velocity</h3>
                <Badge className="bg-white/5 text-theme-lavender border-0 text-[8px] font-black mt-1">Tier-1: 10% | Tier-2: 5%</Badge>
              </div>
            </div>
            <p className="text-theme-lavender/40 text-xs font-bold leading-relaxed mb-8 px-2 uppercase tracking-tight">Expand your global network to unlock recurring commissions from your team's activity.</p>
            <Button onClick={() => router.push("/team")} className="w-full h-14 bg-white text-[#1A0B2E] border-0 font-black rounded-2xl tracking-widest uppercase text-[10px] shadow-2xl active:scale-95 transition-all">
              Initiate Propagation
            </Button>
          </Card>

          <Card className="p-8 bg-white border-2 border-dashed border-theme-lavender rounded-[3rem] opacity-60">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-16 w-16 bg-theme-lavender rounded-[2rem] flex items-center justify-center">
                <Star className="h-8 w-8 text-theme-purple/30" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#2D1A4A]/40 tracking-tighter italic text-black">Loyalty Check-in</h3>
                <p className="text-[10px] font-black text-theme-purple/20 uppercase tracking-widest">Protocol Initializing</p>
              </div>
            </div>
            <p className="text-theme-purple/20 text-xs font-bold leading-relaxed mb-2 px-2 uppercase tracking-tight">Daily recurring credits for active members. Launching in next update cycle.</p>
          </Card>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
