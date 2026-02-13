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
      {/* Refined Header */}
      <div className="bg-[#0B1020]/90 border-b border-white/5 px-5 pt-10 pb-6 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#5B2EFF]/10 flex items-center justify-center border border-[#5B2EFF]/20 shadow-lg">
              <Users className="h-5 w-5 text-[#5B2EFF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest leading-none mb-1">Network Nodes</p>
              <h1 className="text-base font-bold text-white leading-none uppercase tracking-tight">Partnership Hub</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 shadow-lg">
            <ChevronRight className="h-4 w-4 text-[#00F0FF] rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 2. Network Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-[#121A33]/80 glass-card border-white/5 shadow-xl rounded-2xl flex flex-col justify-center border-0">
            <p className="text-slate-500 text-[7px] font-bold uppercase tracking-widest mb-1.5 leading-none">Direct Nodes</p>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-none">0</h2>
            <div className="h-1 w-6 bg-[#5B2EFF] rounded-full mt-3" />
          </Card>
          <Card className="p-4 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] shadow-xl border-white/5 rounded-2xl flex flex-col justify-center border-0">
            <p className="text-slate-500 text-[7px] font-bold uppercase tracking-widest mb-1.5 leading-none">Total Incentives</p>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-none">₹{user.referralRewards || 0}</h2>
            <div className="h-1 w-6 bg-[#00F0FF] rounded-full mt-3" />
          </Card>
        </div>

        {/* 3. Tier Nodes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">Generation Topology</p>
            <Network className="h-3.5 w-3.5 text-[#5B2EFF]" />
          </div>

          <div className="grid gap-3">
            {[
              { level: "Alpha Protocol", yield: "10%", icon: Star, color: "text-[#5B2EFF]", bg: "bg-[#5B2EFF]/10", label: "Primary Tier" },
              { level: "Beta Protocol", yield: "5%", icon: TrendingUp, color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/10", label: "Secondary Tier" }
            ].map((node, idx) => (
              <Card key={idx} className="p-4 bg-[#0F1C3F]/40 glass-card border-white/5 shadow-xl rounded-2xl group transition-all border-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 ${node.bg} rounded-xl flex items-center justify-center border border-white/5 shadow-lg`}>
                      <node.icon className={`h-5 w-5 ${node.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm uppercase tracking-tight leading-none">{node.level}</h4>
                        <span className="text-[6px] font-bold bg-white/5 text-slate-500 px-1.5 py-0.5 rounded border border-white/5 uppercase">{node.label}</span>
                      </div>
                      <p className={`text-[8px] ${node.color} font-bold uppercase tracking-widest leading-none`}>{node.yield} Yield Node</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 leading-none">Partners</p>
                    <p className="text-lg font-bold text-white leading-none">0</p>
                  </div>
                  <div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 leading-none">Cumulative Yield</p>
                    <p className="text-lg font-bold text-white leading-none">₹0</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Performance Benchmarks */}
        <div className="space-y-4">
          <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2">Performance Benchmarks</p>
          <Card className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] border-white/5 rounded-2xl shadow-xl overflow-hidden relative border-0 p-5">
            <div className="relative z-10 text-center">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-lg mx-auto mb-4">
                <Trophy className="h-6 w-6 text-[#00F0FF]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 leading-none uppercase tracking-tight">Elite Principal</h4>
              <Badge className="bg-[#5B2EFF] text-white border-0 text-[7px] font-bold uppercase rounded-md px-3 py-1 tracking-widest mb-6">Target: 50 Global Nodes</Badge>

              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Maturity Index</span>
                    <span className="text-[8px] font-bold text-[#5B2EFF]">0%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-0 bg-[#5B2EFF] rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2.5 bg-[#00F0FF]/5 p-3 rounded-xl border border-white/5">
                  <Zap className="h-3.5 w-3.5 text-[#00F0FF]" />
                  <p className="text-[8px] font-bold text-white tracking-widest uppercase leading-none">Potential Bonus: <span className="text-[#00F0FF]">₹10,000</span></p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 5. Invite System */}
        <div className="space-y-4 pb-12">
          <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2">Network Expansion Protocol</p>
          <Card className="p-5 bg-[#121A33]/80 glass-card border-white/5 shadow-xl rounded-2xl relative overflow-hidden group border-0 font-sans">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight mb-1 uppercase leading-none">Invitation Key</h4>
                  <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest leading-none">Global Partnership Node Link</p>
                </div>
                <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <Share2 className="h-4 w-4 text-[#5B2EFF]" />
                </div>
              </div>

              <div className="bg-black/20 p-2.5 rounded-xl border border-dashed border-white/10 flex items-center justify-between gap-3 shadow-inner">
                <span className="text-[9px] font-bold text-[#5B2EFF] truncate tracking-widest px-2 uppercase">{referralLink}</span>
                <button
                  onClick={() => handleCopy(referralLink, "Link")}
                  className="h-10 px-4 premium-gradient text-white rounded-lg flex items-center justify-center active:scale-95 transition-all shadow-xl border-0 shrink-0 font-bold text-[9px] uppercase tracking-widest"
                >
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-black/20 border border-white/5 rounded-xl flex flex-col items-center shadow-inner">
                  <ShieldCheck className="h-5 w-5 text-[#00F0FF] mb-2" />
                  <p className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Secured</p>
                </div>
                <div className="p-4 bg-black/20 border border-white/5 rounded-xl flex flex-col items-center shadow-inner">
                  <Award className="h-5 w-5 text-[#5B2EFF] mb-2" />
                  <p className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Elite Tier</p>
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
