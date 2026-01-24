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
      router.push("/login")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/create-account?ref=${user?.referralCode || user?.id}` : ''

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Link Copied", description: "Successfully copied to your clipboard." })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-24 font-sans selection:bg-green-100">
      {/* 1. Refined Green Header */}
      <div className="bg-white border-b border-green-50 px-5 pt-8 pb-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[2.5px] mb-0.5">Network Nodes</p>
              <h1 className="text-base font-bold text-slate-900 leading-tight uppercase">Partnership Hub</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-10 w-10 bg-green-50/50 border border-green-100 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors">
            <ChevronRight className="h-4 w-4 text-green-400 rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* 2. Cumulative Network Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white shadow-sm border border-green-50 rounded-3xl relative overflow-hidden group border-0">
            <div className="relative z-10 font-sans">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-3">Direct Nodes</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">0</h2>
              <div className="h-1 w-8 bg-green-600 rounded-full mt-4" />
            </div>
          </Card>
          <Card className="p-6 bg-[#14532D] shadow-xl border-0 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-12 w-12 text-green-300" />
            </div>
            <div className="relative z-10 font-sans">
              <p className="text-green-300/40 text-[9px] font-bold uppercase tracking-widest mb-3">Total Incentives</p>
              <h2 className="text-3xl font-black text-white tracking-tighter leading-none">₹{user.referralRewards || 0}</h2>
              <div className="h-1 w-8 bg-green-400 rounded-full mt-4" />
            </div>
          </Card>
        </div>

        {/* 3. Streamlined Tier Nodes */}
        <div className="space-y-4 font-sans">
          <div className="flex items-center justify-between px-1">
            <p className="text-slate-900 text-[10px] font-bold uppercase tracking-[3px]">Generation Topology</p>
            <Network className="h-4 w-4 text-green-200" />
          </div>

          <div className="grid gap-3">
            {[
              { level: "Alpha Protocol", yield: "10%", icon: Star, color: "text-green-600", bg: "bg-green-50", label: "Primary Tier" },
              { level: "Beta Protocol", yield: "5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", label: "Secondary Tier" }
            ].map((node, idx) => (
              <Card key={idx} className="p-5 bg-white border border-green-50 shadow-sm rounded-[2rem] group transition-all border-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 ${node.bg} rounded-2xl flex items-center justify-center border border-transparent shadow-inner group-hover:rotate-6 transition-transform`}>
                      <node.icon className={`h-6 w-6 ${node.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight leading-none">{node.level}</h4>
                        <span className="text-[7px] font-bold bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-lg border border-slate-100 uppercase">{node.label}</span>
                      </div>
                      <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest leading-none">{node.yield} Yield Node</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-200" />
                </div>
                <div className="flex gap-10 pt-4 border-t border-green-50/50">
                  <div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[2px] mb-1 leading-none">Partners</p>
                    <p className="text-lg font-black text-slate-900 leading-none">0</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[2px] mb-1 leading-none">Cumulative Yield</p>
                    <p className="text-lg font-black text-slate-900 leading-none">₹0</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Reward Progression */}
        <div className="space-y-4 font-sans">
          <p className="text-slate-900 text-[10px] font-bold uppercase tracking-[3px] px-1">Performance Benchmarks</p>
          <Card className="bg-[#14532D] rounded-[3rem] shadow-2xl overflow-hidden relative border-0 p-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-[100px] -mr-20 -mt-20" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2 leading-none uppercase tracking-tight">Elite Principal</h4>
                  <Badge className="bg-green-500 text-white border-0 text-[8px] font-bold uppercase rounded-full px-3 py-1.5 tracking-widest">Target: 50+ Global Nodes</Badge>
                </div>
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                  <Trophy className="h-7 w-7 text-green-300" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="text-[9px] font-bold text-green-300/40 uppercase tracking-[3px]">Maturity Index</span>
                    <span className="text-[9px] font-bold text-green-300">0%</span>
                  </div>
                  <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-green-400/10 p-4 rounded-xl border border-green-400/20">
                  <Zap className="h-4 w-4 text-green-400 fill-green-400" />
                  <p className="text-[10px] font-bold text-white tracking-widest uppercase leading-none">Potential Bonus Payout: <span className="text-green-400 font-black">₹10,000</span></p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 5. Precision Invite System */}
        <div className="space-y-4 pb-12 font-sans">
          <p className="text-slate-900 text-[10px] font-bold uppercase tracking-[3px] px-1">Network Expansion Protocol</p>
          <Card className="p-8 bg-white border border-green-50 shadow-sm rounded-[3rem] relative overflow-hidden group border-0">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-1 uppercase">Invitation Key</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Global Partnership Node Link</p>
                </div>
                <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
                  <Share2 className="h-5 w-5 text-green-600" />
                </div>
              </div>

              <div className="bg-green-50/50 p-5 rounded-2xl border-2 border-dashed border-green-100 flex items-center justify-between gap-4 group-hover:border-green-300 transition-all">
                <span className="text-[10px] font-mono text-slate-400 truncate tracking-tight px-1 uppercase">{referralLink}</span>
                <button
                  onClick={() => handleCopy(referralLink, "Link")}
                  className="h-10 w-10 premium-gradient text-white rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-green-200 shrink-0 border-0"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-green-50 rounded-[1.8rem] flex flex-col items-center shadow-sm border-0 bg-green-50/20">
                  <ShieldCheck className="h-5 w-5 text-green-600 mb-2" />
                  <p className="text-[9px] font-bold uppercase text-slate-800 tracking-widest">Secured</p>
                </div>
                <div className="p-5 bg-white border border-green-50 rounded-[1.8rem] flex flex-col items-center shadow-sm border-0 bg-green-50/20">
                  <Award className="h-5 w-5 text-green-500 mb-2" />
                  <p className="text-[9px] font-bold uppercase text-slate-800 tracking-widest">Elite Tier</p>
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
