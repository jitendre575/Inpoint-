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
      router.push("/login")
    } else {
      setUser(JSON.parse(currentUser))
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-24 font-sans selection:bg-green-100">
      {/* 1. Refined Green Header */}
      <div className="bg-white border-b border-green-50 px-5 pt-8 pb-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[2.5px] mb-0.5">Rewards Node</p>
              <h1 className="text-base font-bold text-slate-900 leading-tight uppercase">Incentive Center</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-10 w-10 bg-green-50/50 border border-green-100 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors">
            <ChevronRight className="h-4 w-4 text-green-400 rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* 2. Premium Welcome Asset */}
        <Card className="p-8 bg-[#14532D] border-0 shadow-2xl rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] -mr-20 -mt-20" />

          <div className="relative z-10 font-sans">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-green-500 text-white border-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Protocol Active</Badge>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-2 uppercase">Registration Credit</h2>
            <p className="text-green-300/40 text-[9px] font-bold mb-8 uppercase tracking-[3px]">Asset Code: WELCOME_BOOST</p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-white tracking-tighter italic">₹50</span>
              <span className="text-green-400 text-[9px] font-bold uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20">Vault Locked</span>
            </div>

            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full w-full bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            </div>
          </div>
        </Card>

        {/* 3. Streamlined Incentive Path */}
        <div className="space-y-4 font-sans">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[3px]">Market Incentives</h3>
            <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
              <Sparkles className="h-3 w-3 text-green-600" />
              <span className="text-[9px] text-green-700 font-bold uppercase">2 Active</span>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                title: "Capital Multiplier",
                bonus: "30% Instant",
                desc: "Yield bonus tied to direct wallet liquidity.",
                icon: TrendingUp,
                color: "text-green-600",
                bg: "bg-green-50",
                path: "/deposit"
              },
              {
                title: "Network Velocity",
                bonus: "10% Recurring",
                desc: "Passive growth from managed sub-nodes.",
                icon: Users,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                path: "/team"
              }
            ].map((item, idx) => (
              <Card
                key={idx}
                onClick={() => router.push(item.path)}
                className="p-5 bg-white border border-green-50 shadow-sm rounded-[2rem] hover:shadow-md transition-all cursor-pointer group border-0"
              >
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 border border-transparent shadow-inner group-hover:rotate-6 transition-transform`}>
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight">{item.title}</h4>
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded-lg border border-green-100">
                        <span className="text-[8px] font-black uppercase">{item.bonus}</span>
                        <ArrowRightCircle className="h-2.5 w-2.5" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Expiring Placeholder */}
            <div className="p-8 border-2 border-dashed border-green-50 rounded-[2rem] text-center opacity-40">
              <Star className="h-6 w-6 text-green-200 mx-auto mb-3" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[4px]">Maintenance Cycle: 24h Remaining</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
