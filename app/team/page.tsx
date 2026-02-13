"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"
import { Users, TrendingUp, Target, Share2, Copy, ShieldCheck, ChevronRight, Award, Trophy, Info, Zap, Star, Activity, Network } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${user?.referralCode || user?.id}` : ''

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Link Copied", description: "Successfully copied to your clipboard." })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0B1020] pb-24 font-sans selection:bg-purple-500/30 uppercase">
      {/* 1. Purple Header */}
      <div className="bg-[#0B1020]/80 border-b border-white/5 px-5 pt-10 pb-8 sticky top-0 z-30 shadow-3xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#5B2EFF]/10 flex items-center justify-center border border-[#5B2EFF]/20 shadow-xl purple-glow">
              <Users className="h-6 w-6 text-[#5B2EFF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[3px] mb-1">Network Nodes</p>
              <h1 className="text-xl font-black text-white leading-none uppercase tracking-tight">Partnership Hub</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-11 w-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
            <ChevronRight className="h-5 w-5 text-[#00F0FF] rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 mt-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* 2. Cumulative Network Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-7 bg-[#121A33]/80 glass-card border-white/5 shadow-xl rounded-[2.5rem] relative overflow-hidden group border-0">
            <div className="relative z-10 font-sans">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[4px] mb-3">Direct Nodes</p>
              <h2 className="text-3xl font-black text-white tracking-tighter leading-none">0</h2>
              <div className="h-1.5 w-10 bg-[#5B2EFF] rounded-full mt-5 shadow-[0_0_10px_rgba(91,46,255,0.8)]" />
            </div>
          </Card>
          <Card className="p-7 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] shadow-3xl border-white/5 rounded-[2.5rem] relative overflow-hidden group border-0">
            <div className="absolute top-0 right-0 p-5 opacity-10">
              <Zap className="h-12 w-12 text-[#00F0FF]" />
            </div>
            <div className="relative z-10 font-sans">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[4px] mb-3">Total Incentives</p>
              <h2 className="text-3xl font-black text-white tracking-tighter leading-none">₹{user.referralRewards || 0}</h2>
              <div className="h-1.5 w-10 bg-[#00F0FF] rounded-full mt-5 purple-glow" />
            </div>
          </Card>
        </div>

        {/* 3. Streamlined Tier Nodes */}
        <div className="space-y-6 font-sans">
          <div className="flex items-center justify-between px-2">
            <p className="text-white text-[10px] font-black uppercase tracking-[5px]">Generation Topology</p>
            <Network className="h-5 w-5 text-[#5B2EFF]" />
          </div>

          <div className="grid gap-4">
            {[
              { level: "Alpha Protocol", yield: "10%", icon: Star, color: "text-[#5B2EFF]", bg: "bg-[#5B2EFF]/10", label: "Primary Tier" },
              { level: "Beta Protocol", yield: "5%", icon: TrendingUp, color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/10", label: "Secondary Tier" }
            ].map((node, idx) => (
              <Card key={idx} className="p-6 bg-[#0F1C3F]/40 glass-card border-white/5 shadow-xl rounded-[2.5rem] group transition-all border-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 ${node.bg} rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl group-hover:rotate-6 transition-transform purple-glow`}>
                      <node.icon className={`h-7 w-7 ${node.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h4 className="font-black text-white text-base uppercase tracking-tight leading-none">{node.level}</h4>
                        <span className="text-[8px] font-black bg-white/5 text-slate-500 px-2 py-1 rounded-lg border border-white/5 uppercase">{node.label}</span>
                      </div>
                      <p className={`text-[10px] ${node.color} font-black uppercase tracking-[3px] leading-none`}>{node.yield} Yield Node</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-700" />
                </div>
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[3px] mb-2 leading-none">Partners</p>
                    <p className="text-xl font-black text-white leading-none">0</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[3px] mb-2 leading-none">Cumulative Yield</p>
                    <p className="text-xl font-black text-white leading-none">₹0</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Reward Progression */}
        <div className="space-y-6 font-sans">
          <p className="text-white text-[10px] font-black uppercase tracking-[5px] px-2">Performance Benchmarks</p>
          <Card className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] border-white/5 rounded-[3.5rem] shadow-3xl overflow-hidden relative border-0 p-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#5B2EFF]/10 rounded-full blur-[100px] -mr-20 -mt-20" />

            <div className="relative z-10 text-center">
              <div className="h-20 w-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-3xl mx-auto mb-8 purple-glow">
                <Trophy className="h-10 w-10 text-[#00F0FF]" />
              </div>
              <h4 className="text-3xl font-black text-white mb-3 leading-none uppercase tracking-tight">Elite Principal</h4>
              <Badge className="bg-[#5B2EFF] text-white border-0 text-[9px] font-black uppercase rounded-xl px-4 py-2 tracking-[2px] mb-10 purple-glow">Target: 50+ Global Nodes</Badge>

              <div className="space-y-8">
                <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">Maturity Index</span>
                    <span className="text-[10px] font-black text-[#5B2EFF]">0%</span>
                  </div>
                  <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-0 bg-[#5B2EFF] rounded-full shadow-[0_0_15px_rgba(91,46,255,0.8)]" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 bg-[#00F0FF]/5 p-5 rounded-2xl border border-white/5">
                  <Zap className="h-5 w-5 text-[#00F0FF] fill-[#00F0FF]/10" />
                  <p className="text-[10px] font-black text-white tracking-[3px] uppercase leading-none">Potential Bonus Payout: <span className="text-[#00F0FF] font-black">₹10,000</span></p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 5. Precision Invite System */}
        <div className="space-y-6 pb-20 font-sans">
          <p className="text-white text-[10px] font-black uppercase tracking-[5px] px-2">Network Expansion Protocol</p>
          <Card className="p-10 bg-[#121A33]/80 glass-card border-white/5 shadow-3xl rounded-[3.5rem] relative overflow-hidden group border-0">
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase leading-none">Invitation Key</h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[4px] leading-none">Global Partnership Node Link</p>
                </div>
                <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <Share2 className="h-6 w-6 text-[#5B2EFF]" />
                </div>
              </div>

              <div className="bg-black/20 p-6 rounded-[2.5rem] border border-dashed border-white/10 flex items-center justify-between gap-4 group-hover:border-[#5B2EFF]/50 transition-all shadow-inner">
                <span className="text-[11px] font-black text-[#5B2EFF] truncate tracking-widest px-2 uppercase">{referralLink}</span>
                <button
                  onClick={() => handleCopy(referralLink, "Link")}
                  className="h-12 w-12 premium-gradient text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-3xl border-0 shrink-0 purple-glow"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-black/20 border border-white/5 rounded-[2rem] flex flex-col items-center shadow-inner">
                  <ShieldCheck className="h-6 w-6 text-[#00F0FF] mb-3" />
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[3px]">Secured</p>
                </div>
                <div className="p-6 bg-black/20 border border-white/5 rounded-[2rem] flex flex-col items-center shadow-inner">
                  <Award className="h-6 w-6 text-[#5B2EFF] mb-3" />
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[3px]">Elite Tier</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav active="team" />
    </div>
  )
}
