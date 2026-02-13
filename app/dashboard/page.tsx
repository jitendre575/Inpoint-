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
      {/* Refined Header */}
      <div className="bg-[#0B1020]/90 border-b border-white/5 px-5 pt-10 pb-6 sticky top-0 z-30 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#5B2EFF]/10 flex items-center justify-center border border-[#5B2EFF]/20 shadow-lg">
              <div className="h-full w-full rounded-lg premium-gradient flex items-center justify-center text-white font-bold text-sm tracking-tight">
                {user.name?.charAt(0)}
              </div>
            </div>
            <div>
              <p className="text-[#00F0FF] text-[8px] font-bold uppercase tracking-widest leading-none mb-1">Authorised Node</p>
              <h1 className="text-base font-bold text-white tracking-tight leading-none uppercase">{user.name}</h1>
            </div>
          </div>
          <button className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center relative hover:bg-white/10 transition-all active:scale-95 shadow-lg">
            <Bell className="h-4 w-4 text-[#00F0FF]" />
            {(claimablePlans.length > 0) && <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-[#5B2EFF] rounded-full ring-2 ring-[#0B1020]" />}
          </button>
        </div>
      </div>

      {/* 2. Wallet Summary Section */}
      <div className="px-5 mt-6">
        <Card className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] rounded-2xl p-6 shadow-2xl border-white/5 relative overflow-hidden group border-0">
          <div className="relative z-10 text-center">
            <span className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-1.5 block">Liquidity Cluster</span>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl font-bold text-[#5B2EFF]">₹</span>
              <h2 className="text-4xl font-bold text-white tracking-tight">
                {user.wallet?.toLocaleString()}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push("/deposit")}
                className="h-12 premium-gradient text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl border-0 flex gap-2 active:scale-95 transition-all"
              >
                <ArrowDownCircle className="h-4 w-4" />
                Deposit
              </Button>
              <Button
                onClick={() => router.push("/withdraw")}
                className="h-12 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest border border-white/10 shadow-xl flex gap-2 active:scale-95 transition-all backdrop-blur-md"
              >
                <ArrowUpCircle className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Stats Grid */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Card className="p-3.5 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-lg rounded-xl flex items-center gap-3 border-0">
          <div className="h-10 w-10 bg-[#5B2EFF]/10 rounded-xl flex items-center justify-center border border-white/5">
            <TrendingUp className="h-5 w-5 text-[#00F0FF]" />
          </div>
          <div>
            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Efficiency</p>
            <p className="text-sm font-bold text-[#10B981] leading-none tracking-tight">+₹{todayEarnings}</p>
          </div>
        </Card>
        <Card className="p-3.5 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-lg rounded-xl flex items-center gap-3 border-0">
          <div className="h-10 w-10 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center border border-white/5">
            <Activity className="h-5 w-5 text-[#5B2EFF]" />
          </div>
          <div>
            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Active Hubs</p>
            <p className="text-sm font-bold text-white leading-none tracking-tight">{user.plans?.length || 0}</p>
          </div>
        </Card>
      </div>

      {/* 4. Feature Links */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Cluster', icon: Zap, color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10', action: () => setShowPlansModal(true) },
            { label: 'Duel', icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-400/10', path: '/casino' },
            { label: 'Network', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', path: '/team' },
            { label: 'Alpha', icon: Gift, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10', path: '/bonus' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action || (() => router.push(item.path!))}
              className="flex flex-col items-center gap-2 group active:scale-90 transition-all"
            >
              <div className={`h-12 w-12 ${item.bg} border border-white/5 rounded-xl flex items-center justify-center shadow-lg`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Verifying Status UI */}
      {user.status === 'Verifying' ? (
        <div className="px-4 py-12 animate-in fade-in zoom-in duration-500">
          <Card className="p-6 glass-card bg-[#0F1C3F]/60 border-white/10 shadow-3xl rounded-2xl text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="h-14 w-14 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg group">
                <Clock className="h-7 w-7 text-[#00F0FF] animate-spin-slow" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase mb-3">Node Syncing</h2>
              <div className="h-0.5 w-8 bg-[#5B2EFF] mx-auto mb-6 opacity-40 rounded-full" />

              <p className="text-slate-500 text-[10px] font-medium leading-relaxed uppercase tracking-wider px-2 mb-8">
                Your capital deployment is undergoing distributed audit. System access restricted during node cycle.
              </p>

              <div className="p-3 bg-black/20 rounded-xl border border-dashed border-white/10 mb-6">
                <p className="text-[9px] font-semibold text-[#00F0FF] uppercase tracking-wider">Audit ID: {user.deposits?.[user.deposits.length - 1]?.id?.slice(-8) || 'PURPLE_SYNC'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-1 opacity-40">
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  <span className="text-[8px] font-semibold uppercase tracking-wider">Hardened</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-40">
                  <Activity className="h-4 w-4 text-slate-400" />
                  <span className="text-[8px] font-semibold uppercase tracking-wider">Syncing...</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <button
              onClick={() => refreshUserData(user.id)}
              className="inline-flex items-center gap-2 text-[#5B2EFF] font-semibold text-[9px] uppercase tracking-wider py-1 border-b border-[#5B2EFF]/20"
            >
              <RefreshCw className="h-3 w-3" />
              Sync Protocol Registry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 5. Active Nodes */}
          <div className="px-5 mt-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight uppercase">Active Nodes</h2>
                <p className="text-[8px] text-[#00F0FF] font-bold uppercase tracking-widest">Deployment Clusters</p>
              </div>
              {(user.plans?.length > 0) && (
                <Button
                  onClick={() => setShowPlansModal(true)}
                  variant="outline"
                  className="rounded-lg h-8 text-[8px] font-bold uppercase tracking-widest border-white/10 bg-white/5 text-[#5B2EFF] active:scale-95 transition-all"
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
                    <Card key={idx} className={`p-5 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-xl rounded-2xl relative transition-all duration-500 ${isClaimable ? 'ring-1 ring-[#5B2EFF]/50' : ''} border-0`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[#5B2EFF]/10 rounded-xl flex items-center justify-center border border-white/5">
                            <Zap className="h-4 w-4 text-[#00F0FF]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm tracking-tight uppercase leading-none mb-1">{plan.name}</h4>
                            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">Entry: ₹{plan.amount}</p>
                          </div>
                        </div>
                        <Badge className={`text-[7px] font-bold uppercase px-2 py-0.5 rounded-md border-0 ${isClaimable ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white/5 text-slate-500'}`}>
                          {isClaimable ? 'Harvest' : 'Stabilizing'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                          <p className="text-[#00F0FF] font-bold text-xl leading-none mb-1.5 uppercase tracking-tighter">₹{plan.dailyReturn}</p>
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Base Alpha</p>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                          <p className="text-emerald-400 font-bold text-xl leading-none mb-1.5 uppercase tracking-tighter">₹{plan.bonusPerDay || 0}</p>
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Node Boost</p>
                        </div>
                      </div>

                      {isClaimable ? (
                        <Button
                          onClick={() => handleClaimBonus(idx)}
                          disabled={isClaiming === idx}
                          className="w-full h-11 premium-gradient text-white border-0 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                        >
                          {isClaiming === idx ? "Harvesting..." : "Harvest Alpha Rewards"}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-black/20 rounded-xl text-slate-500 border border-dashed border-white/10">
                          <Timer className="h-3.5 w-3.5" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Next Payout: {Math.max(0, Math.ceil((new Date(plan.nextClaimAt).getTime() - new Date().getTime()) / 3600000))}h</span>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <Card className="p-8 border border-dashed border-white/10 bg-[#0F1C3F]/40 glass-card rounded-2xl text-center">
                  <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-lg">
                    <PieChart className="h-6 w-6 text-slate-700" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 tracking-tight uppercase">Void Registry</h3>
                  <p className="text-slate-500 text-[10px] font-medium mb-6 max-w-[170px] mx-auto leading-relaxed uppercase tracking-wider">
                    Initialize your first capital node to begin alpha generation cycles.
                  </p>

                  <Button
                    onClick={() => setShowPlansModal(true)}
                    className="w-full h-10 premium-gradient text-white rounded-lg px-8 font-semibold text-[10px] uppercase tracking-wider shadow-xl border-0 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
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
