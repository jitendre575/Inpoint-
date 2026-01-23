"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlansModal } from "@/components/plans-modal"
import {
  ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Users, Gift,
  UserCircle, Bell, Timer, ShieldCheck, Zap, Headphones,
  Star, Info, ChevronRight, Trophy
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
  const [historyTab, setHistoryTab] = useState<'deposits' | 'withdrawals'>('deposits')

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
        toast({ title: "Bonus Claimed!", description: `₹${data.amount} added to your wallet.` })
        refreshUserData(user.id)
      } else {
        toast({ title: "Claim Failed", description: data.message, variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Internal Server Error", variant: "destructive" })
    } finally {
      setIsClaiming(null)
    }
  }

  if (!user) return null

  const claimablePlans = user.plans?.filter((p: any) => new Date() >= new Date(p.nextClaimAt)) || []

  return (
    <div className="min-h-screen bg-[#FDFCFF] pb-32 font-sans selection:bg-theme-lavender selection:text-theme-purple">
      {/* 1. Dynamic Luxury Header */}
      <div className="bg-gradient-to-b from-[#1A0B2E] to-[#2D1A4A] text-white px-6 pt-16 pb-32 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-theme-purple/20 rounded-full -mr-20 -mt-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-theme-gold/5 rounded-full -ml-32 -mb-32 blur-[100px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
            <div
              onClick={() => router.push('/mine')}
              className="h-16 w-16 rounded-[2rem] overflow-hidden bg-white/10 border-2 border-white/20 shadow-2xl cursor-pointer group"
            >
              {user.profilePhoto ? (
                <img src={user.profilePhoto} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-theme-gold font-black text-2xl bg-white/5 uppercase">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-theme-lavender/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Elite Investor</p>
              <h1 className="text-2xl font-black tracking-tighter leading-none">{user.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-700">
            <button className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 relative active:scale-95 transition-all">
              <Bell className="h-6 w-6 text-theme-lavender" />
              {(claimablePlans.length > 0) && <span className="absolute top-4 right-4 h-2.5 w-2.5 bg-theme-gold rounded-full border-2 border-[#2D1A4A]" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Glassmorphism Wallet Card */}
      <div className="px-5 -mt-20 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <Card className="bg-white/95 backdrop-blur-3xl shadow-[0_32px_80px_rgba(109,40,217,0.12)] border border-theme-lavender rounded-[3rem] p-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-theme-lavender/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2.5 bg-theme-lavender/40 px-4 py-2 rounded-2xl border border-theme-purple/10">
                <Wallet className="h-5 w-5 text-theme-purple" />
                <span className="text-[11px] font-black text-theme-purple uppercase tracking-widest">Available Balance</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-gold/10 rounded-full border border-theme-gold/20">
                <ShieldCheck className="h-3.5 w-3.5 text-theme-gold" />
                <span className="text-[9px] font-black text-theme-gold uppercase tracking-widest">Secured</span>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-6xl font-black text-[#2D1A4A] tracking-tighter mb-2 italic">₹{user.wallet?.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-theme-purple font-black text-sm uppercase tracking-tighter">
                <TrendingUp className="h-4 w-4" />
                <span>+₹{(user.referralRewards || 0).toFixed(0)} Network Rewards</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => router.push("/deposit")}
                className="flex-1 h-16 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white border-0 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-theme-purple/20 group"
              >
                Deposit
              </Button>
              <Button
                onClick={() => router.push("/withdraw")}
                variant="outline"
                className="flex-1 h-16 rounded-2xl border-2 border-theme-lavender font-black text-xs uppercase tracking-[0.2em] hover:bg-theme-lavender text-theme-purple transition-all active:scale-95 shadow-sm"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Action Grid */}
      <div className="px-5 mt-10 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        {[
          { label: 'Plans', icon: Gift, color: 'text-theme-purple', bg: 'bg-theme-lavender', action: () => setShowPlansModal(true) },
          { label: 'Network', icon: Users, color: 'text-theme-violet', bg: 'bg-theme-lavender', path: '/team' },
          { label: 'Rewards', icon: Star, color: 'text-theme-gold', bg: 'bg-theme-gold/10', path: '/bonus' },
          { label: 'Profile', icon: UserCircle, color: 'text-theme-purple', bg: 'bg-theme-lavender', path: '/mine' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action || (() => router.push(item.path!))}
            className="flex flex-col items-center gap-3 group animate-in zoom-in-50 duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`h-16 w-16 ${item.bg} border border-theme-purple/5 rounded-[1.8rem] flex items-center justify-center transition-all group-hover:shadow-xl group-hover:shadow-theme-purple/10 group-active:scale-90 group-hover:-translate-y-1`}>
              <item.icon className={`h-8 w-8 ${item.color}`} />
            </div>
            <span className="text-[10px] font-black text-theme-lavender-foreground/60 uppercase tracking-widest leading-none">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Claim Bonus Card */}
      {claimablePlans.length > 0 && (
        <div className="px-5 mt-10 animate-in bounce-in duration-700">
          <Card className="p-8 bg-gradient-to-r from-theme-gold to-yellow-500 text-theme-indigo border-0 shadow-2xl shadow-theme-gold/30 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-white/30 transition-all duration-700" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-white/30 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                  <Star className="h-8 w-8 text-theme-indigo animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-black text-xl leading-tight">Payout Ready!</h3>
                  <p className="text-theme-indigo/70 text-xs font-bold uppercase tracking-widest">Claim your rewards now</p>
                </div>
              </div>
              <Button onClick={() => handleClaimBonus(user.plans.indexOf(claimablePlans[0]))} className="h-12 bg-white text-theme-indigo hover:bg-theme-lavender rounded-xl font-black text-xs uppercase tracking-widest shadow-xl border-0">
                Claim
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 5. Active Portfolios */}
      <div className="px-5 mt-12">
        <div className="flex items-center justify-between mb-8 px-4">
          <div>
            <h2 className="text-2xl font-black text-[#2D1A4A] tracking-tight">Active Portfolios</h2>
            <p className="text-[10px] text-theme-purple/40 font-black uppercase tracking-widest mt-0.5">Your Growth Engines</p>
          </div>
          <Button
            onClick={() => setShowPlansModal(true)}
            className="text-theme-purple bg-white hover:bg-theme-lavender rounded-2xl px-5 py-2 h-auto text-[10px] font-black uppercase tracking-widest border-2 border-theme-lavender transition-all shadow-sm"
          >
            Manage
          </Button>
        </div>

        {user.plans && user.plans.length > 0 ? (
          <div className="space-y-6">
            {user.plans.map((plan: any, idx: number) => {
              const isClaimable = new Date() >= new Date(plan.nextClaimAt);
              return (
                <Card key={idx} className={`p-8 bg-white border border-theme-purple/5 shadow-[0_20px_40px_rgba(109,40,217,0.05)] rounded-[3rem] relative overflow-hidden transition-all hover:shadow-xl ${isClaimable ? 'ring-4 ring-theme-gold ring-offset-4 ring-offset-[#FDFCFF]' : ''}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-theme-lavender/30 rounded-full -mr-12 -mt-12" />
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h4 className="font-black text-[#2D1A4A] text-xl tracking-tight mb-1">{plan.name}</h4>
                      <p className="text-theme-purple/40 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Investment: ₹{plan.amount}</p>
                    </div>
                    <Badge className="bg-theme-lavender text-theme-purple border-theme-purple/10 font-black text-[9px] uppercase px-3 py-1 rounded-full">Yielding</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-5 bg-[#F8F7FF] rounded-[2rem] border border-theme-purple/5">
                      <p className="text-theme-purple font-black text-2xl truncate">₹{plan.dailyReturn}</p>
                      <p className="text-[9px] text-theme-purple/40 font-black uppercase tracking-widest mt-1">Daily Yield</p>
                    </div>
                    <div className="p-5 bg-theme-gold/5 rounded-[2rem] border border-theme-gold/10">
                      <p className="text-theme-gold font-black text-2xl truncate">₹{plan.bonusPerDay || 0}</p>
                      <p className="text-[9px] text-theme-gold/50 font-black uppercase tracking-widest mt-1">Extra Bonus</p>
                    </div>
                  </div>

                  {isClaimable ? (
                    <Button
                      onClick={() => handleClaimBonus(idx)}
                      disabled={isClaiming === idx}
                      className="w-full h-16 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white border-0 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-theme-purple/20 active:scale-95 transition-all"
                    >
                      {isClaiming === idx ? "Processing..." : "Claim Your Yield"}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-3 py-5 px-6 bg-[#F8F7FF] rounded-2xl text-theme-purple/40 border border-theme-purple/5">
                      <Timer className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Next Payout in {Math.max(0, Math.ceil((new Date(plan.nextClaimAt).getTime() - new Date().getTime()) / 3600000))} Hours</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-16 border-0 shadow-2xl shadow-theme-purple/5 bg-white rounded-[4rem] text-center group">
            <div className="h-24 w-24 bg-theme-lavender rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-theme-purple/10 group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp className="h-12 w-12 text-theme-purple/30" />
            </div>
            <h3 className="text-2xl font-black text-[#2D1A4A] mb-3 tracking-tight">Empty Portfolio</h3>
            <p className="text-theme-purple/40 text-sm font-medium mb-10 max-w-[200px] mx-auto leading-relaxed">Diversify your assets to unlock elite 30% bonus growth.</p>
            <Button onClick={() => setShowPlansModal(true)} className="bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white border-0 h-16 rounded-2xl px-12 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-theme-purple/20 active:scale-95 transition-all group">
              <span>Acquire Capital</span>
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        )}
      </div>

      {/* 6. Ledger Table */}
      <div className="px-5 mt-20 pb-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <div>
            <h2 className="text-2xl font-black text-[#2D1A4A] tracking-tight">Asset Ledger</h2>
            <p className="text-[10px] text-theme-purple/40 font-black uppercase tracking-widest mt-0.5">Financial Activity</p>
          </div>
          <div className="flex bg-theme-lavender p-1.5 rounded-2xl border border-theme-purple/5">
            <button
              onClick={() => setHistoryTab('deposits')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${historyTab === 'deposits' ? 'bg-white text-theme-purple shadow-sm' : 'text-theme-purple/40'}`}
            >
              Income
            </button>
            <button
              onClick={() => setHistoryTab('withdrawals')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${historyTab === 'withdrawals' ? 'bg-white text-rose-500 shadow-sm' : 'text-theme-purple/40'}`}
            >
              Payout
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {historyTab === 'deposits' ? (
            (user.deposits || []).length > 0 ? (
              user.deposits.slice().reverse().map((d: any) => (
                <Card key={d.id} className="p-6 bg-white border-0 shadow-sm rounded-[2.5rem] flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors shadow-sm">
                      <ArrowDownRight className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-black text-[#2D1A4A] text-lg tracking-tighter leading-none mb-1">₹{d.amount}</p>
                      <p className="text-[10px] text-theme-purple/30 font-bold uppercase tracking-widest leading-none">{new Date(d.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm ${d.status === 'Approved' ? 'bg-emerald-500 text-white' : d.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-theme-gold text-white'}`}>
                    {d.status}
                  </Badge>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-theme-lavender">
                <Info className="h-10 w-10 text-theme-lavender mx-auto mb-4" />
                <p className="text-[10px] text-theme-purple/20 font-black uppercase tracking-[0.3em]">No records found</p>
              </div>
            )
          ) : (
            (user.withdrawals || []).length > 0 ? (
              user.withdrawals.slice().reverse().map((w: any) => (
                <Card key={w.id} className="p-6 bg-white border-0 shadow-sm rounded-[2.5rem] flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-100 transition-colors shadow-sm">
                      <ArrowUpRight className="h-7 w-7 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-black text-[#2D1A4A] text-lg tracking-tighter leading-none mb-1">₹{w.amount}</p>
                      <p className="text-[10px] text-theme-purple/30 font-bold uppercase tracking-widest leading-none">{new Date(w.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm ${w.status === 'Approved' || w.status === 'Completed' ? 'bg-emerald-500 text-white' : w.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-theme-gold text-white'}`}>
                    {w.status}
                  </Badge>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-theme-lavender">
                <Info className="h-10 w-10 text-theme-lavender mx-auto mb-4" />
                <p className="text-[10px] text-theme-purple/20 font-black uppercase tracking-[0.3em]">No records found</p>
              </div>
            )
          )}
        </div>
      </div>

      <PlansModal open={showPlansModal} onClose={() => setShowPlansModal(false)} />
      <BottomNav active="home" />

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
