"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Gift, TrendingUp, Users, Award, Star, Zap, ChevronRight, Trophy, ShieldCheck, ArrowRightCircle, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function BonusPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(JSON.parse(currentUser))
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0B1020] pb-24 font-sans selection:bg-purple-500/30 uppercase">
      {/* 1. Refined Header */}
      <div className="bg-[#0B1020]/80 border-b border-white/5 px-4 pt-8 pb-6 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#5B2EFF]/10 flex items-center justify-center border border-[#5B2EFF]/20 shadow-lg">
              <Trophy className="h-5 w-5 text-[#5B2EFF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[9px] font-semibold uppercase tracking-widest mb-0.5">Rewards Node</p>
              <h1 className="text-base font-bold text-white leading-none uppercase tracking-tight">Incentive Center</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
            <ChevronRight className="h-4 w-4 text-[#00F0FF] rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 mt-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* 2. Welcome Asset */}
        <Card className="p-6 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] border-white/5 shadow-xl rounded-2xl relative overflow-hidden group border-0">
          <div className="relative z-10 font-sans">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-[#5B2EFF] text-white border-0 text-[8px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-lg">Protocol Active</Badge>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-2 uppercase">Registration Credit</h2>
            <p className="text-slate-500 text-[8px] font-semibold mb-8 uppercase tracking-widest">Asset Code: PURPLE_BOOST</p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-bold text-white tracking-tighter">₹50</span>
              <span className="text-[#00F0FF] text-[9px] font-semibold uppercase tracking-widest bg-[#00F0FF]/10 px-2 py-1 rounded-lg border border-[#00F0FF]/20">Vault Locked</span>
            </div>

            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-full bg-[#5B2EFF] rounded-full shadow-[0_0_12px_rgba(91,46,255,0.6)]" />
            </div>
          </div>
        </Card>

        {/* 3. Incentive Path */}
        <div className="space-y-4 font-sans">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Market Incentives</h3>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Sparkles className="h-3 w-3 text-[#5B2EFF]" />
              <span className="text-[9px] text-white font-semibold uppercase tracking-widest">2 Active</span>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                title: "Capital Multiplier",
                bonus: "30% Instant",
                desc: "Yield bonus tied to direct wallet liquidity.",
                icon: TrendingUp,
                color: "text-[#5B2EFF]",
                bg: "bg-[#5B2EFF]/10",
                path: "/deposit"
              },
              {
                title: "Network Velocity",
                bonus: "10% Recurring",
                desc: "Passive growth from managed sub-nodes.",
                icon: Users,
                color: "text-[#00F0FF]",
                bg: "bg-[#00F0FF]/10",
                path: "/team"
              }
            ].map((item, idx) => (
              <Card
                key={idx}
                onClick={() => router.push(item.path)}
                className="p-5 bg-[#0F1C3F]/40 glass-card border-white/5 shadow-lg rounded-2xl hover:shadow-[#5B2EFF]/5 transition-all cursor-pointer group border-0"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-lg`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-white text-sm uppercase tracking-tight">{item.title}</h4>
                      <div className="flex items-center gap-1 text-white bg-[#5B2EFF] px-2 py-0.5 rounded-md border border-[#5B2EFF]/10">
                        <span className="text-[8px] font-bold uppercase tracking-tighter">{item.bonus}</span>
                        <ArrowRightCircle className="h-2.5 w-2.5" />
                      </div>
                    </div>
                    <p className="text-slate-500 text-[9px] font-semibold uppercase tracking-widest leading-none">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Expiring Placeholder */}
            <div className="p-8 border-2 border-dashed border-white/5 bg-white/[0.02] rounded-2xl text-center opacity-40">
              <Star className="h-6 w-6 text-[#5B2EFF] mx-auto mb-3" />
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Maintenance Cycle: 24h Remaining</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
