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
      router.push("/login")
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
    <div className="min-h-screen bg-[#F0FDF4] pb-24 font-sans selection:bg-green-100">
      {/* 1. Refined Premium Header */}
      <div className="bg-white border-b border-green-50 px-5 pt-8 pb-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-green-500 p-0.5 bg-green-50">
              <div className="h-full w-full rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg uppercase shadow-inner">
                {user.name?.charAt(0)}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Verified Profile</p>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Hi, {user.name}</h1>
            </div>
          </div>
          <button className="h-10 w-10 bg-green-50/50 border border-green-100 rounded-full flex items-center justify-center relative hover:bg-green-100 transition-colors">
            <Bell className="h-5 w-5 text-green-700" />
            {(claimablePlans.length > 0) && <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-green-600 rounded-full border-2 border-white shadow-sm animate-pulse" />}
          </button>
        </div>
      </div>

      {/* 2. Wallet Summary Section */}
      <div className="px-4 mt-6">
        <div className="bg-[#14532D] rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(20,83,45,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-green-500/20 transition-colors" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -ml-16 -mb-16" />

          <div className="relative z-10 text-center">
            <span className="text-green-300/60 text-[11px] font-bold uppercase tracking-[3px] mb-2 block">Available Capital</span>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-2xl font-bold text-green-300 opacity-40">₹</span>
              <h2 className="text-4xl font-black text-white tracking-tight">
                {user.wallet?.toLocaleString()}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => router.push("/deposit")}
                className="h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/40 border-0 flex gap-2 active:scale-95 transition-all"
              >
                <ArrowDownCircle className="h-4 w-4" />
                Deposit
              </Button>
              <Button
                onClick={() => router.push("/withdraw")}
                className="h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest border border-white/20 shadow-lg flex gap-2 active:scale-95 transition-all backdrop-blur-sm"
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
        <Card className="p-4 bg-white border-green-50 shadow-sm rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Today's Stats</p>
            <p className="text-sm font-bold text-green-600">+₹{todayEarnings}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border-green-50 shadow-sm rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Plans</p>
            <p className="text-sm font-bold text-slate-900">{user.plans?.length || 0}</p>
          </div>
        </Card>
      </div>

      {/* 4. Feature Quick Links */}
      <div className="px-4 mt-8">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Market', icon: Zap, color: 'text-green-600', bg: 'bg-green-50', action: () => setShowPlansModal(true) },
            { label: 'Casino', icon: Gamepad2, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/casino' },
            { label: 'Network', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/team' },
            { label: 'Rewards', icon: Gift, color: 'text-green-500', bg: 'bg-green-50', path: '/bonus' },
          ].map((item, idx) => (

            <button
              key={idx}
              onClick={item.action || (() => router.push(item.path!))}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`h-14 w-14 ${item.bg} border border-transparent rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm group-active:scale-95`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Verifying Status UI / Lock Screen */}
      {user.status === 'Verifying' ? (
        <div className="px-6 py-20 animate-in fade-in zoom-in duration-500">
          <Card className="p-10 bg-white border-0 shadow-[0_20px_60px_rgba(20,83,45,0.08)] rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="h-20 w-20 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-amber-100 shadow-inner group">
                <Clock className="h-10 w-10 text-amber-500 animate-[spin_10s_linear_infinite]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4">Verifying Node</h2>
              <div className="h-1 w-12 bg-amber-500 rounded-full mx-auto mb-8 opacity-40" />

              <p className="text-slate-400 text-xs font-bold leading-loose uppercase tracking-widest px-2 mb-10">
                Your recent deposit protocol is currently under manual audit. System access is restricted until verification is successful.
              </p>

              <div className="p-5 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200 mb-8">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-[2px]">Audit Reference: {user.deposits?.[user.deposits.length - 1]?.id?.slice(-8) || 'SYSTEM_SYNC'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 opacity-40">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="h-5 w-5 text-slate-300" />
                  <span className="text-[8px] font-black uppercase tracking-widest leading-none">Hardened</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Activity className="h-5 w-5 text-slate-300" />
                  <span className="text-[8px] font-black uppercase tracking-widest leading-none">Syncing...</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <button
              onClick={() => refreshUserData(user.id)}
              className="inline-flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-[3px] py-1 border-b border-green-500/20 hover:border-green-500 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh Registry Status
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 5. Recent Activity / Portfolio Center */}
          <div className="px-4 mt-10">
            <div className="flex items-center justify-between mb-5 px-1">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Managed Portfolio</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Engines</p>
              </div>
              {(user.plans?.length > 0) && (
                <Button
                  onClick={() => setShowPlansModal(true)}
                  variant="outline"
                  className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-widest border-green-100 text-green-600"
                >
                  Expand
                </Button>
              )}
            </div>

            {user.plans && user.plans.length > 0 ? (
              <div className="space-y-4">
                {user.plans.map((plan: any, idx: number) => {
                  const isClaimable = new Date() >= new Date(plan.nextClaimAt);
                  return (
                    <Card key={idx} className={`p-5 bg-white border border-green-50 shadow-sm rounded-3xl relative transition-all duration-300 ${isClaimable ? 'ring-2 ring-green-500 shadow-xl scale-[1.02]' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <Zap className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm tracking-tight mb-0.5">{plan.name}</h4>
                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Stake: ₹{plan.amount}</p>
                          </div>
                        </div>
                        <Badge className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${isClaimable ? 'bg-green-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                          {isClaimable ? 'Ready' : 'Yielding'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-3 bg-green-50/50 rounded-xl border border-green-50">
                          <p className="text-green-600 font-bold text-lg leading-none mb-1">₹{plan.dailyReturn}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Main Yield</p>
                        </div>
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-50">
                          <p className="text-emerald-600 font-bold text-lg leading-none mb-1">₹{plan.bonusPerDay || 0}</p>
                          <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-tight">Bonus Alpha</p>
                        </div>
                      </div>

                      {isClaimable ? (
                        <Button
                          onClick={() => handleClaimBonus(idx)}
                          disabled={isClaiming === idx}
                          className="w-full h-11 premium-gradient text-white border-0 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all"
                        >
                          {isClaiming === idx ? "Processing Yield..." : "Claim Rewards"}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-50 rounded-xl text-slate-400 border border-dashed border-slate-200">
                          <Timer className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Next payout in {Math.max(0, Math.ceil((new Date(plan.nextClaimAt).getTime() - new Date().getTime()) / 3600000))} Hours</span>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <Card className="p-10 border border-dashed border-green-200 bg-white rounded-[2.5rem] text-center group transition-all">
                  <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-100">
                    <PieChart className="h-8 w-8 text-green-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight uppercase">Empty Portfolio</h3>
                  <p className="text-slate-400 text-[11px] font-medium mb-8 max-w-[180px] mx-auto leading-relaxed uppercase">
                    Initialize your first high-yield engine to start generating passive returns.
                  </p>

                  <Button
                    onClick={() => setShowPlansModal(true)}
                    className="w-full h-12 premium-gradient text-white rounded-xl px-10 font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-green-200 active:scale-95 flex items-center justify-center gap-2 border-0"
                  >
                    <Plus className="h-4 w-4" />
                    Start Investing
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
