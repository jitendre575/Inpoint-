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
      {/* 1. Purple Header */}
      <div className="bg-[#0B1020]/80 border-b border-white/5 px-5 pt-10 pb-8 sticky top-0 z-30 shadow-3xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#5B2EFF]/10 flex items-center justify-center border border-[#5B2EFF]/20 shadow-xl purple-glow">
              <Trophy className="h-6 w-6 text-[#5B2EFF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[3px] mb-1">Rewards Node</p>
              <h1 className="text-xl font-black text-white leading-none uppercase tracking-tight">Incentive Center</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-11 w-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
            <ChevronRight className="h-5 w-5 text-[#00F0FF] rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 mt-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* 2. Premium Welcome Asset */}
        <Card className="p-8 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] border-white/5 shadow-3xl rounded-[3.5rem] relative overflow-hidden group border-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B2EFF]/10 rounded-full blur-[100px] -mr-20 -mt-20" />

          <div className="relative z-10 font-sans">
            <div className="flex items-center gap-2 mb-8">
              <Badge className="bg-[#5B2EFF] text-white border-0 text-[10px] font-black uppercase tracking-[2px] px-4 py-2 rounded-xl purple-glow">Protocol Active</Badge>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tighter leading-none mb-3 uppercase">Registration Credit</h2>
            <p className="text-slate-500 text-[9px] font-black mb-10 uppercase tracking-[4px]">Asset Code: PURPLE_BOOST</p>

            <div className="flex items-baseline gap-3 mb-10">
              <span className="text-6xl font-black text-white tracking-tighter shadow-sm">₹50</span>
              <span className="text-[#00F0FF] text-[10px] font-black uppercase tracking-[3px] bg-[#00F0FF]/10 px-3 py-1.5 rounded-xl border border-[#00F0FF]/20">Vault Locked</span>
            </div>

            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-full bg-[#5B2EFF] rounded-full shadow-[0_0_20px_rgba(91,46,255,0.8)]" />
            </div>
          </div>
        </Card>

        {/* 3. Streamlined Incentive Path */}
        <div className="space-y-6 font-sans">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[5px]">Market Incentives</h3>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-[#5B2EFF]" />
              <span className="text-[10px] text-white font-black uppercase tracking-widest">2 Active</span>
            </div>
          </div>

          <div className="grid gap-4">
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
                className="p-6 bg-[#0F1C3F]/40 glass-card border-white/5 shadow-xl rounded-[2.5rem] hover:shadow-[#5B2EFF]/10 transition-all cursor-pointer group border-0"
              >
                <div className="flex items-center gap-6">
                  <div className={`h-16 w-16 ${item.bg} rounded-[1.5rem] flex items-center justify-center shrink-0 border border-white/5 shadow-2xl group-hover:rotate-6 transition-transform purple-glow`}>
                    <item.icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-white text-base uppercase tracking-tight">{item.title}</h4>
                      <div className="flex items-center gap-1.5 text-white bg-[#5B2EFF] px-2.5 py-1 rounded-lg border border-[#5B2EFF]/20 purple-glow">
                        <span className="text-[9px] font-black uppercase tracking-tighter">{item.bonus}</span>
                        <ArrowRightCircle className="h-3 w-3" />
                      </div>
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Expiring Placeholder */}
            <div className="p-10 border-2 border-dashed border-white/5 bg-white/[0.02] rounded-[3rem] text-center opacity-40">
              <Star className="h-8 w-8 text-[#5B2EFF] mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[5px]">Maintenance Cycle: 24h Remaining</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
