"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlansModal } from "@/components/plans-modal"
import {
  Wallet, TrendingUp, Users, Gift, Bell, Timer, ShieldCheck,
  ArrowUpCircle, ArrowDownCircle, ChevronRight, Star, Plus,
  CreditCard, LayoutDashboard, History, Zap, Activity, PieChart,
  Clock, RefreshCw, Gamepad2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { BottomNav } from "@/components/bottom-nav"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [isClaiming, setIsClaiming] = useState<number | null>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }
    const userData = JSON.parse(currentUser)
    setUser(userData)
    refreshUserData(userData.id)
  }, [router])

  const refreshUserData = async (userId: string) => {
    try {
      const res = await fetch(`/api/user?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        localStorage.setItem("currentUser", JSON.stringify(data.user))
      }
    } catch (e) {
      console.error("Failed to refresh user data")
    }
  }

  const handleClaimBonus = async (planIndex: number) => {
    if (!user) return
    setIsClaiming(planIndex)
    try {
      const res = await fetch('/api/user/claim-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planIndex })
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: "Yield Claimed Successfully!", description: `₹${data.amount} credited to your secure wallet.` })
        refreshUserData(user.id)
      } else {
        toast({ title: "Claim Error", description: data.message, variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Internal Server Error", variant: "destructive" })
    } finally {
      setIsClaiming(null)
    }
  }

  if (!user) return null

  const claimablePlans = user.plans?.filter((p: any) => new Date() >= new Date(p.nextClaimAt)) || []
  const todayEarnings = user.plans?.reduce((acc: number, p: any) => acc + (p.dailyReturn || 0) + (p.bonusPerDay || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#0B1020] pb-24 font-sans selection:bg-purple-500/30">
      {/* 1. Refined Premium Header */}
      <div className="bg-[#0B1020]/80 border-b border-white/5 px-5 pt-8 pb-6 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-[#5B2EFF] p-0.5 bg-[#5B2EFF]/10">
              <div className="h-full w-full rounded-full premium-gradient flex items-center justify-center text-white font-black text-lg uppercase shadow-inner">
                {user.name?.charAt(0)}
              </div>
            </div>
            <div>
              <p className="text-[#00F0FF] text-[8px] font-black uppercase tracking-[3px] mb-0.5">Authorised Node</p>
              <h1 className="text-base font-black text-white tracking-tight leading-tight uppercase">Terminal: {user.name}</h1>
            </div>
          </div>
          <button className="h-10 w-10 bg-white/5 border border-white/5 rounded-full flex items-center justify-center relative hover:bg-white/10 transition-colors">
            <Bell className="h-5 w-5 text-slate-400" />
            {(claimablePlans.length > 0) && <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[#5B2EFF] rounded-full border-2 border-[#0B1020] shadow-sm animate-pulse" />}
          </button>
        </div>
      </div>

      {/* 2. Wallet Summary Section */}
      <div className="px-4 mt-6">
        <div className="glass-card bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] rounded-[2rem] p-8 shadow-3xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#5B2EFF]/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-[#5B2EFF]/20 transition-colors" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00F0FF]/10 rounded-full blur-[40px] -ml-16 -mb-16" />

          <div className="relative z-10 text-center">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[5px] mb-2 block">Liquidity Cluster</span>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-2xl font-black text-[#5B2EFF] opacity-40">₹</span>
              <h2 className="text-4xl font-black text-white tracking-tighter">
                {user.wallet?.toLocaleString()}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => router.push("/deposit")}
                className="h-12 premium-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-[3px] shadow-lg shadow-purple-900/40 border-0 flex gap-2 active:scale-95 transition-all purple-glow"
              >
                <ArrowDownCircle className="h-4 w-4" />
                Deposit
              </Button>
              <Button
                onClick={() => router.push("/withdraw")}
                className="h-12 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-[3px] border border-white/10 shadow-lg flex gap-2 active:scale-95 transition-all backdrop-blur-md"
              >
                <ArrowUpCircle className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's Stats Grid */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-4">
        <Card className="p-4 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-sm rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 bg-[#5B2EFF]/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#00F0FF]" />
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
            <p className="text-sm font-black text-[#10B981]">+₹{todayEarnings}</p>
          </div>
        </Card>
        <Card className="p-4 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-sm rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5 text-[#5B2EFF]" />
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Hubs</p>
            <p className="text-sm font-black text-white">{user.plans?.length || 0}</p>
          </div>
        </Card>
      </div>

      {/* 4. Feature Quick Links */}
      <div className="px-4 mt-8">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Cluster', icon: Zap, color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10', action: () => setShowPlansModal(true) },
            { label: 'Duel', icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-400/10', path: '/casino' },
            { label: 'Network', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', path: '/team' },
            { label: 'Alpha', icon: Gift, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10', path: '/bonus' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action || (() => router.push(item.path!))}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`h-14 w-14 ${item.bg} border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl group-active:scale-95`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Verifying Status UI / Lock Screen */}
      {user.status === 'Verifying' ? (
        <div className="px-6 py-20 animate-in fade-in zoom-in duration-700">
          <Card className="p-10 glass-card bg-[#0F1C3F]/60 border-white/10 shadow-3xl rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B2EFF]/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="h-20 w-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl group">
                <Clock className="h-10 w-10 text-[#00F0FF] animate-[spin_10s_linear_infinite]" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-4">Node Syncing</h2>
              <div className="h-1 w-12 bg-[#5B2EFF] mx-auto mb-8 opacity-40 rounded-full" />

              <p className="text-slate-500 text-[10px] font-black leading-loose uppercase tracking-[3px] px-2 mb-10">
                Your recent capital deployment is undergoing distributed audit. System access is restricted to read-only mode during this cycle.
              </p>

              <div className="p-5 bg-black/20 rounded-2xl border border-dashed border-white/10 mb-8">
                <p className="text-[9px] font-black text-[#00F0FF] uppercase tracking-[3px]">Audit ID: {user.deposits?.[user.deposits.length - 1]?.id?.slice(-8) || 'PURPLE_SYNC'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-1 opacity-40">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest leading-none">Hardened</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-40">
                  <Activity className="h-5 w-5 text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest leading-none">Syncing...</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <button
              onClick={() => refreshUserData(user.id)}
              className="inline-flex items-center gap-2 text-[#5B2EFF] font-black text-[9px] uppercase tracking-[4px] py-1 border-b border-[#5B2EFF]/20 hover:border-[#5B2EFF] transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              Sync Protocol Registry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 5. Recent Activity / Portfolio Center */}
          <div className="px-4 mt-10">
            <div className="flex items-center justify-between mb-5 px-1">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight uppercase">Active Nodes</h2>
                <p className="text-[9px] text-[#00F0FF] font-black uppercase tracking-[3px]">Deployment Clusters</p>
              </div>
              {(user.plans?.length > 0) && (
                <Button
                  onClick={() => setShowPlansModal(true)}
                  variant="outline"
                  className="rounded-xl h-8 text-[9px] font-black uppercase tracking-widest border-white/10 bg-white/5 text-[#5B2EFF] hover:bg-white/10"
                >
                  Scale
                </Button>
              )}
            </div>

            {user.plans && user.plans.length > 0 ? (
              <div className="space-y-4">
                {user.plans.map((plan: any, idx: number) => {
                  const isClaimable = new Date() >= new Date(plan.nextClaimAt);
                  return (
                    <Card key={idx} className={`p-6 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-xl rounded-[2rem] relative transition-all duration-500 overflow-hidden ${isClaimable ? 'ring-2 ring-[#5B2EFF] shadow-[#5B2EFF]/20 scale-[1.02]' : ''}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[#5B2EFF]/10 rounded-xl flex items-center justify-center border border-white/5">
                            <Zap className="h-5 w-5 text-[#00F0FF]" />
                          </div>
                          <div>
                            <h4 className="font-black text-white text-sm tracking-tight mb-0.5 uppercase leading-none">{plan.name}</h4>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Entry: ₹{plan.amount}</p>
                          </div>
                        </div>
                        <Badge className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-lg border-0 ${isClaimable ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white/5 text-slate-500'}`}>
                          {isClaimable ? 'Harvest' : 'Stabilizing'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[#00F0FF] font-black text-xl leading-none mb-1.5">₹{plan.dailyReturn}</p>
                          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Base Alpha</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-emerald-400 font-black text-xl leading-none mb-1.5">₹{plan.bonusPerDay || 0}</p>
                          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Node Boost</p>
                        </div>
                      </div>

                      {isClaimable ? (
                        <Button
                          onClick={() => handleClaimBonus(idx)}
                          disabled={isClaiming === idx}
                          className="w-full h-12 premium-gradient text-white border-0 rounded-xl font-black text-[10px] uppercase tracking-[4px] shadow-xl purple-glow active:scale-95 transition-all"
                        >
                          {isClaiming === idx ? "Harvesting Yield..." : "Harvest Alpha Rewards"}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-3 py-3 px-4 bg-black/20 rounded-xl text-slate-500 border border-dashed border-white/5">
                          <Timer className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest leading-none">Next Payout: {Math.max(0, Math.ceil((new Date(plan.nextClaimAt).getTime() - new Date().getTime()) / 3600000))}h</span>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <Card className="p-10 border border-dashed border-white/10 bg-[#0F1C3F]/40 glass-card rounded-[3rem] text-center group transition-all">
                  <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
                    <PieChart className="h-8 w-8 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 tracking-tight uppercase">Void Registry</h3>
                  <p className="text-slate-500 text-[10px] font-black mb-8 max-w-[180px] mx-auto leading-loose uppercase tracking-widest">
                    Initialize your first capital node to begin alpha generation cycles.
                  </p>

                  <Button
                    onClick={() => setShowPlansModal(true)}
                    className="w-full h-12 premium-gradient text-white rounded-xl px-10 font-black text-[10px] uppercase tracking-[4px] shadow-2xl border-0 active:scale-95 flex items-center justify-center gap-2 purple-glow"
                  >
                    <Plus className="h-4 w-4" />
                    Deploy First Node
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </>
      )}

      <PlansModal open={showPlansModal} onClose={() => setShowPlansModal(false)} />
      <BottomNav active="home" />
    </div>
  )
}
