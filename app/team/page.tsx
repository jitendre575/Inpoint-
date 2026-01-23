"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"
import { Users, TrendingUp, Target, Share2, Copy, ShieldCheck, ChevronRight, Award, Trophy, Info, Zap, Star } from "lucide-react"
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
    toast({ title: `${title} copied!`, description: "Share it with your network now." })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#FDFCFF] pb-32 font-sans selection:bg-theme-lavender selection:text-theme-purple">
      {/* Premium Luxury Header */}
      <div className="bg-[#1A0B2E] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-theme-purple/20 rounded-full -mr-20 -mt-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-theme-gold/10 rounded-full -ml-10 -mb-10 blur-[80px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <Users className="h-6 w-6 text-theme-gold" />
            </div>
            <div>
              <p className="text-theme-lavender/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Growth Network</p>
              <h1 className="text-2xl font-black tracking-tighter">My Team Hub</h1>
            </div>
          </div>
          <button onClick={() => router.back()} className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 active:scale-95 transition-all">
            <ChevronRight className="h-5 w-5 text-theme-lavender rotate-180" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Network Capital Stats */}
        <div className="grid grid-cols-2 gap-5">
          <Card className="p-8 bg-white shadow-xl shadow-theme-purple/5 border border-theme-lavender rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-theme-lavender/40 rounded-full -mr-12 -mt-12" />
            <div className="relative z-10">
              <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Active Link</p>
              <h2 className="text-4xl font-black text-[#2D1A4A] tracking-tighter italic">0</h2>
              <Badge className="bg-theme-gold/5 text-theme-gold border border-theme-gold/10 text-[8px] font-black uppercase mt-3">Direct Partners</Badge>
            </div>
          </Card>
          <Card className="p-8 bg-white shadow-xl shadow-theme-purple/5 border border-theme-lavender rounded-[3rem] group">
            <div className="h-12 w-12 bg-theme-lavender rounded-[1.5rem] flex items-center justify-center mb-4 transition-transform group-hover:rotate-12">
              <Target className="h-6 w-6 text-theme-purple" />
            </div>
            <div>
              <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-widest mb-1">Incentives</p>
              <h2 className="text-3xl font-black text-[#2D1A4A] tracking-tighter italic">₹{user.referralRewards || 0}</h2>
            </div>
          </Card>
        </div>

        {/* Level Breakdown Cards */}
        <div className="space-y-4">
          <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.3em] pl-6">Generation Allocation</p>

          {/* Level A */}
          <Card className="p-8 bg-white border border-theme-purple/5 shadow-xl shadow-theme-purple/5 rounded-[3.5rem] group hover:bg-theme-lavender/10 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-theme-gold/10 rounded-bl-[2rem]" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-[#1A0B2E] rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl">
                  <Star className="h-8 w-8 text-theme-gold" />
                </div>
                <div>
                  <h4 className="font-black text-[#2D1A4A] leading-tight text-xl italic">Direct Team</h4>
                  <p className="text-[10px] text-theme-purple/30 font-black uppercase tracking-widest">Level Alpha (10%)</p>
                </div>
              </div>
              <div className="h-10 w-10 bg-theme-lavender rounded-full flex items-center justify-center">
                <ChevronRight className="h-5 w-5 text-theme-purple/20 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-theme-lavender/50">
              <div className="p-4 bg-theme-lavender/40 rounded-2xl border border-theme-purple/5">
                <p className="text-[9px] text-theme-purple/40 font-black uppercase mb-1 tracking-widest">Members</p>
                <p className="text-2xl font-black text-[#2D1A4A]">0</p>
              </div>
              <div className="p-4 bg-theme-gold/5 rounded-2xl border border-theme-gold/10">
                <p className="text-[9px] text-theme-gold/60 font-black uppercase mb-1 tracking-widest">Capital Yield</p>
                <p className="text-2xl font-black text-[#2D1A4A]">₹0</p>
              </div>
            </div>
          </Card>

          {/* Level B */}
          <Card className="p-8 bg-white border border-theme-purple/5 shadow-xl shadow-theme-purple/5 rounded-[3.5rem] group hover:bg-theme-lavender/10 transition-all cursor-pointer relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-theme-lavender rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl">
                  <TrendingUp className="h-8 w-8 text-theme-purple" />
                </div>
                <div>
                  <h4 className="font-black text-[#2D1A4A] leading-tight text-xl italic">Extended Team</h4>
                  <p className="text-[10px] text-theme-purple/30 font-black uppercase tracking-widest">Level Beta (5%)</p>
                </div>
              </div>
              <div className="h-10 w-10 bg-theme-lavender rounded-full flex items-center justify-center">
                <ChevronRight className="h-5 w-5 text-theme-purple/20 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-theme-lavender/50 text-black">
              <div className="p-4 bg-white rounded-2xl border border-theme-purple/5">
                <p className="text-[9px] text-theme-purple/40 font-black uppercase mb-1 tracking-widest">Members</p>
                <p className="text-2xl font-black ">0</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-theme-purple/5">
                <p className="text-[9px] text-theme-purple/40 font-black uppercase mb-1 tracking-widest">Capital Yield</p>
                <p className="text-2xl font-black">₹0</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Network Milestone Progress */}
        <div className="space-y-4">
          <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.3em] pl-6">Elite Status Track</p>
          <Card className="p-1 bg-gradient-to-br from-[#1A0B2E] to-[#2D1A4A] rounded-[3.5rem] shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-purple/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-all duration-1000" />
            <div className="bg-white/5 backdrop-blur-3xl m-1 rounded-[3.3rem] p-10 relative z-10">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h4 className="text-3xl font-black text-white mb-1 tracking-tighter italic">Elite Principal</h4>
                  <p className="text-[10px] text-theme-gold font-black uppercase tracking-[0.2em]">Requirement: 50+ Partners</p>
                </div>
                <div className="h-16 w-16 bg-theme-gold rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-theme-gold/20">
                  <Trophy className="h-8 w-8 text-[#1A0B2E]" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-theme-lavender/40 uppercase tracking-widest">Node Saturation</span>
                    <span className="text-[10px] font-black text-theme-gold">0% Complete</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-0 bg-theme-gold rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                  </div>
                </div>
                <div className="flex items-center gap-4 px-2">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="h-5 w-5 text-theme-gold" />
                  </div>
                  <p className="text-xs font-bold text-theme-lavender">Unlock <span className="text-white font-black italic">₹10,000</span> Settlement Bonus</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Global Propagation Link */}
        <div className="space-y-4 pb-12">
          <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.3em] pl-6">Invite Protocol</p>
          <Card className="p-10 bg-white border border-theme-purple/5 shadow-xl shadow-theme-purple/5 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-theme-lavender/30 rounded-full -mr-16 -mb-16 blur-2xl transition-all duration-1000 group-hover:scale-125" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-3xl font-black text-[#2D1A4A] tracking-tighter italic mb-1">Global Expansion</h4>
                  <p className="text-[10px] text-theme-purple/30 font-black uppercase tracking-widest leading-none">Your unique network identifier</p>
                </div>
                <div className="h-14 w-14 bg-theme-lavender rounded-2xl flex items-center justify-center shadow-inner">
                  <Share2 className="h-6 w-6 text-theme-purple" />
                </div>
              </div>

              <div className="bg-[#F8F7FF] p-6 rounded-[2.5rem] border border-theme-lavender flex items-center justify-between gap-5 group/copy hover:border-theme-purple/20 transition-all">
                <span className="text-[10px] font-mono font-bold truncate opacity-40 px-2">{referralLink}</span>
                <button
                  onClick={() => handleCopy(referralLink, "Link")}
                  className="h-14 w-14 bg-[#1A0B2E] text-white rounded-[1.2rem] flex items-center justify-center active:scale-90 transition-all shadow-2xl shadow-[#1A0B2E]/20 shrink-0"
                >
                  <Copy className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-theme-gold/5 rounded-3xl border border-theme-gold/10 flex flex-col items-center">
                  <ShieldCheck className="h-6 w-6 text-theme-gold mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#2D1A4A]">Encrypted</p>
                </div>
                <div className="p-6 bg-theme-lavender/50 rounded-3xl border border-theme-purple/10 flex flex-col items-center">
                  <Award className="h-6 w-6 text-theme-purple mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#2D1A4A]">Tiered Yield</p>
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
