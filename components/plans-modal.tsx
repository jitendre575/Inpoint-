"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X, Check, Timer, TrendingUp, Zap, ShieldCheck } from "lucide-react"

const PLANS = [
  { id: 1, name: "Plan 1000", amount: 1000, dailyReturn: 50, duration: 60, totalReturn: 3000, bonus: 300 },
  { id: 2, name: "Plan 2000", amount: 2000, dailyReturn: 110, duration: 60, totalReturn: 6600, bonus: 600 },
  { id: 3, name: "Plan 3000", amount: 3000, dailyReturn: 170, duration: 60, totalReturn: 10200, bonus: 900 },
  { id: 4, name: "Plan 5000", amount: 5000, dailyReturn: 300, duration: 60, totalReturn: 18000, bonus: 1500 },
  { id: 5, name: "Plan 10000", amount: 10000, dailyReturn: 650, duration: 60, totalReturn: 39000, bonus: 3000 },
  { id: 6, name: "Plan 15000", amount: 15000, dailyReturn: 1000, duration: 60, totalReturn: 60000, bonus: 4500 },
  { id: 7, name: "Plan 20000", amount: 20000, dailyReturn: 1400, duration: 60, totalReturn: 84000, bonus: 6000 },
  { id: 8, name: "Plan 30000", amount: 30000, dailyReturn: 2200, duration: 60, totalReturn: 132000, bonus: 9000 },
  { id: 9, name: "Plan 50000", amount: 50000, dailyReturn: 4000, duration: 60, totalReturn: 240000, bonus: 15000 },
  { id: 10, name: "Plan 75000", amount: 75000, dailyReturn: 6200, duration: 60, totalReturn: 372000, bonus: 22500 },
  { id: 11, name: "Plan 100000", amount: 100000, dailyReturn: 9000, duration: 60, totalReturn: 540000, bonus: 30000 },
  { id: 12, name: "Plan 200000", amount: 200000, dailyReturn: 20000, duration: 60, totalReturn: 1200000, bonus: 60000 },
  { id: 13, name: "Plan 300000", amount: 300000, dailyReturn: 33000, duration: 60, totalReturn: 1980000, bonus: 90000 },
  { id: 14, name: "Plan 500000", amount: 500000, dailyReturn: 60000, duration: 60, totalReturn: 3600000, bonus: 150000 },
  { id: 15, name: "Plan 1000000", amount: 1000000, dailyReturn: 140000, duration: 60, totalReturn: 8400000, bonus: 300000 },
]

export function PlansModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (open) {
      const currentUser = localStorage.getItem("currentUser")
      if (currentUser) {
        setUser(JSON.parse(currentUser))
      }
    }
  }, [open])

  const handlePurchase = async () => {
    if (!user) return;

    if (user.isBlocked) {
      toast({
        title: "Account Restricted",
        description: "Your account is temporarily blocked. Contact support.",
        variant: "destructive",
      })
      return
    }

    if (user.wallet < selectedPlan.amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to your wallet first.",
        variant: "destructive",
      })
      onClose()
      router.push("/deposit")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch('/api/user/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          plan: selectedPlan,
          amount: selectedPlan.amount
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Investment failed');

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setUser(data.user)

      toast({
        title: "Success!",
        description: `${selectedPlan.name} activated. 30% Bonus starts now!`,
      })

      onClose()
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const isActive = (planId: number) => {
    return user?.plans?.some((p: any) => p.id === planId && p.status === 'active');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-neutral-50 border-0 p-0 rounded-[2.5rem] shadow-2xl">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl p-6 border-b border-neutral-100 flex items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
              Investment Plans
            </DialogTitle>
          </DialogHeader>
          <button onClick={onClose} className="h-10 w-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-all">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!selectedPlan ? (
            <div className="grid grid-cols-1 gap-4">
              {PLANS.map((plan) => {
                const active = isActive(plan.id);
                return (
                  <Card
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative overflow-hidden cursor-pointer group transition-all duration-300 border-0 shadow-lg rounded-[2rem] hover:scale-[1.02] active:scale-95 ${active ? 'ring-4 ring-emerald-500 ring-offset-2' : ''
                      }`}
                  >
                    <div className={`p-6 bg-white flex flex-col gap-4`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-black text-xl text-neutral-900">{plan.name}</h3>
                            {active && <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>}
                          </div>
                          <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">{plan.duration} Days Duration</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-indigo-600">₹{plan.amount}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase">Price</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-50">
                        <div>
                          <p className="text-emerald-600 font-black text-lg">₹{plan.dailyReturn}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Daily Return</p>
                        </div>
                        <div>
                          <p className="text-amber-500 font-black text-lg">+30% Bonus</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">First 3 Days</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-bold text-neutral-700">Total: ₹{plan.totalReturn + plan.bonus}</span>
                        </div>
                        <Button className="rounded-xl h-10 px-6 bg-neutral-900 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
                          Invest
                        </Button>
                      </div>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500" />
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="p-8 bg-neutral-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full -mr-12 -mt-12 blur-3xl" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-1">{selectedPlan.name}</h3>
                  <p className="text-neutral-400 text-sm font-bold uppercase tracking-[0.2em] mb-8">Investment Breakdown</p>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-1">
                      <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Daily Return</p>
                      <p className="text-2xl font-black text-emerald-400">₹{selectedPlan.dailyReturn}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Extra Bonus</p>
                      <p className="text-2xl font-black text-amber-400">₹{selectedPlan.bonus / 3}/day</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Plan Duration</p>
                      <p className="text-2xl font-black text-white">{selectedPlan.duration} Days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Total Payout</p>
                      <p className="text-2xl font-black text-indigo-400">₹{selectedPlan.totalReturn + selectedPlan.bonus}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex gap-4 items-start">
                <div className="h-10 w-10 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                  <Timer className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-amber-900 text-sm uppercase mb-1">Special 30% Bonus</h4>
                  <p className="text-amber-800 text-xs leading-relaxed font-medium">
                    You will receive an extra <span className="font-black">₹{selectedPlan.bonus / 3} daily</span> for the first 3 days of this investment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 h-16 rounded-2xl border-2 border-neutral-200 font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 transition-all"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="flex-[2] h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                  {isProcessing ? "Activating..." : `Activate ₹${selectedPlan.amount}`}
                </Button>
              </div>

              <p className="text-center text-[10px] text-neutral-400 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Secure Encrypted Transaction
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
