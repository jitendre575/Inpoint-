"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlansModal } from "@/components/plans-modal"
import { BottomNav } from "@/components/bottom-nav"
import { DownloadAppButton } from "@/components/download-app-button"
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Users, Gift, UserCircle, Bell, Timer, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [historyTab, setHistoryTab] = useState<'deposits' | 'withdrawals'>('deposits')
  const [isClaiming, setIsClaiming] = useState<number | null>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
    } else {
      const dbUser = JSON.parse(currentUser)
      setUser(dbUser)

      if (dbUser.id) {
        refreshUserData(dbUser.id)
      } else {
        localStorage.removeItem("currentUser")
        router.push("/login")
      }

      const hasSeenModal = sessionStorage.getItem("hasSeenPlansModal")
      if (!hasSeenModal) {
        setShowPlansModal(true)
        sessionStorage.setItem("hasSeenPlansModal", "true")
      }

      const poll = setInterval(() => {
        if (dbUser.id) refreshUserData(dbUser.id);
      }, 5000);

      return () => clearInterval(poll);
    }
  }, [router])

  const refreshUserData = async (userId: string) => {
    try {
      const res = await fetch('/api/user/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.user) {
        // Notification check
        if (user) {
          // Check for deposit status changes
          data.user.deposits?.forEach((d: any) => {
            const prevD = user.deposits?.find((p: any) => p.id === d.id);
            if (prevD && prevD.status !== d.status) {
              toast({ title: "Deposit Status Update", description: `Your deposit of ₹${d.amount} is now ${d.status}.` });
            }
          });
          // Check for withdrawal status changes
          data.user.withdrawals?.forEach((w: any) => {
            const prevW = user.withdrawals?.find((p: any) => p.id === w.id);
            if (prevW && prevW.status !== w.status) {
              toast({ title: "Withdrawal Status Update", description: `Your withdrawal of ₹${w.amount} is now ${w.status}.` });
            }
          });
          // Check for new chat messages
          const newAdminChats = (data.user.supportChats?.filter((c: any) => c.sender === 'admin' && !c.read).length || 0) - (user.supportChats?.filter((c: any) => c.sender === 'admin' && !c.read).length || 0);
          if (newAdminChats > 0) {
            toast({ title: "New Support Message", description: "You have a new message from support." });
          }
        }
        setUser(data.user)
        localStorage.setItem("currentUser", JSON.stringify(data.user))
      }
    } catch (err) {
      console.error("Failed to refresh user data", err)
    }
  }

  const handleClaimBonus = async (planIndex: number) => {
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
        setUser(data.user)
        localStorage.setItem("currentUser", JSON.stringify(data.user))
      } else {
        toast({ title: "Claim failed", description: data.message, variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
    } finally {
      setIsClaiming(null)
    }
  }

  if (!user) return null

  const claimablePlans = user.plans?.filter((p: any) => new Date() >= new Date(p.nextClaimAt)) || []

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-32">
      {/* 1. Dynamic Header */}
      <div className="bg-neutral-900 text-white px-6 pt-16 pb-28 relative overflow-hidden rounded-b-[3.5rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              onClick={() => router.push('/mine')}
              className="h-14 w-14 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-white/10 shadow-xl cursor-pointer"
            >
              {user.profilePhoto ? (
                <img src={user.profilePhoto} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-emerald-400 font-black text-xl bg-neutral-800">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Welcome Back</p>
              <h1 className="text-xl font-black tracking-tight">{user.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 relative">
              <Bell className="h-5 w-5 text-neutral-300" />
              {(claimablePlans.length > 0) && <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-amber-500 rounded-full border-2 border-neutral-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Wallet Matrix */}
      <div className="px-5 -mt-16 relative z-20">
        <Card className="bg-white shadow-2xl shadow-neutral-200 border-0 rounded-[2.5rem] p-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-all duration-700" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <Wallet className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Wallet</span>
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 font-black">Verified</Badge>
            </div>

            <div className="mb-8">
              <h2 className="text-5xl font-black text-neutral-900 tracking-tighter mb-1">₹{user.wallet?.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+₹{(user.referralRewards || 0).toFixed(0)} rewards earned</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => router.push("/deposit")}
                className="flex-1 h-14 bg-neutral-900 hover:bg-neutral-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-neutral-900/10"
              >
                Deposit
              </Button>
              <Button
                onClick={() => router.push("/withdraw")}
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-2 border-neutral-100 font-black text-xs uppercase tracking-widest hover:bg-neutral-50 transition-all"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Action Grid */}
      <div className="px-5 mt-8 grid grid-cols-4 gap-4">
        {[
          { label: 'Plans', icon: Gift, color: 'text-indigo-600', bg: 'bg-indigo-50', action: () => setShowPlansModal(true) },
          { label: 'Team', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/team' },
          { label: 'Bonus', icon: StarIcon, color: 'text-amber-600', bg: 'bg-amber-50', path: '/bonus' },
          { label: 'Profile', icon: UserCircle, color: 'text-neutral-600', bg: 'bg-neutral-50', path: '/mine' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action || (() => router.push(item.path!))}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`h-16 w-16 ${item.bg} rounded-2xl flex items-center justify-center transition-all group-hover:shadow-lg group-active:scale-90 border border-transparent group-hover:border-white shadow-sm`}>
              <item.icon className={`h-7 w-7 ${item.color}`} />
            </div>
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Claim Bonus Alert */}
      {claimablePlans.length > 0 && (
        <div className="px-5 mt-8">
          <Card className="p-6 bg-amber-500 text-white border-0 shadow-xl shadow-amber-500/20 rounded-[2rem] relative overflow-hidden animate-pulse">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Timer className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Daily Bonus Ready!</h3>
                  <p className="text-amber-100 text-xs font-bold opacity-80 uppercase tracking-widest">Claim your investment rewards</p>
                </div>
              </div>
              <ArrowUpRight className="h-6 w-6 text-white/50" />
            </div>
          </Card>
        </div>
      )}

      {/* 5. Active Investments */}
      <div className="px-5 mt-10">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">Active Investments</h2>
          <Button
            onClick={() => setShowPlansModal(true)}
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl px-4 py-1.5 h-auto text-xs font-black uppercase tracking-widest border-0"
          >
            New Plan
          </Button>
        </div>

        {user.plans && user.plans.length > 0 ? (
          <div className="space-y-4">
            {user.plans.map((plan: any, idx: number) => {
              const isClaimable = new Date() >= new Date(plan.nextClaimAt);
              return (
                <Card key={idx} className={`p-6 bg-white border-0 shadow-xl shadow-neutral-200/50 rounded-[2.5rem] relative overflow-hidden ${isClaimable ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-neutral-900 text-lg mb-1">{plan.name}</h4>
                      <p className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">Invested: ₹{plan.amount}</p>
                    </div>
                    <div className="bg-neutral-50 px-3 py-1 rounded-xl">
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">Ongoing</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-neutral-50 rounded-2xl">
                      <p className="text-emerald-600 font-black text-xl">₹{plan.dailyReturn}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Base Return</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl">
                      <p className="text-amber-600 font-black text-xl">₹{plan.bonusPerDay || 0}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Bonus Reward</p>
                    </div>
                  </div>

                  {isClaimable ? (
                    <Button
                      onClick={() => handleClaimBonus(idx)}
                      disabled={isClaiming === idx}
                      className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20"
                    >
                      {isClaiming === idx ? "Processing..." : "Claim Today's Bonus"}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-neutral-100 rounded-2xl text-neutral-400">
                      <Timer className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Next claim in {Math.max(0, Math.ceil((new Date(plan.nextClaimAt).getTime() - new Date().getTime()) / 3600000))} Hours</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 border-0 shadow-lg bg-white rounded-[3rem] text-center">
            <div className="h-20 w-20 bg-neutral-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-10 w-10 text-neutral-300" />
            </div>
            <h3 className="text-xl font-black text-neutral-900 mb-2">No Active Portfolio</h3>
            <p className="text-neutral-400 text-sm font-medium mb-8">Start your first investment to earn daily returns with 30% bonus.</p>
            <Button onClick={() => setShowPlansModal(true)} className="bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl px-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
              Pick a Plan
            </Button>
          </Card>
        )}
      </div>

      <div className="px-5 mt-10 mb-10">
        <DownloadAppButton className="w-full h-18 rounded-[2rem] bg-neutral-900 text-white border-0 py-6" />
      </div>

      <PlansModal open={showPlansModal} onClose={() => setShowPlansModal(false)} />
      <BottomNav active="home" />
    </div>
  )
}

function StarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
