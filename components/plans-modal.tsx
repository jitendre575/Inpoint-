"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X, Check, Timer, TrendingUp, Zap, ShieldCheck, ArrowRightCircle, Sparkles, Activity, ShieldAlert } from "lucide-react"

const PLANS = [
  { id: 1, name: "Starter Asset", amount: 1000, dailyReturn: 50, duration: 60, totalReturn: 3000, bonus: 300, level: "Tier 1" },
  { id: 2, name: "Growth Asset", amount: 2000, dailyReturn: 110, duration: 60, totalReturn: 6600, bonus: 600, level: "Tier 2" },
  { id: 3, name: "Pro Yield Engine", amount: 5000, dailyReturn: 300, duration: 60, totalReturn: 18000, bonus: 1500, level: "Tier 3" },
  { id: 4, name: "Enterprise Alpha", amount: 15000, dailyReturn: 1000, duration: 60, totalReturn: 60000, bonus: 4500, level: "Tier 4" },
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
      toast({ title: "Account Restricted", description: "Your account is temporarily blocked.", variant: "destructive" })
      return
    }
    if (user.wallet < selectedPlan.amount) {
      toast({ title: "Insufficient Capital", description: "Deposit funds to activate this engine.", variant: "destructive" })
      onClose()
      router.push("/deposit")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch('/api/user/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, plan: selectedPlan, amount: selectedPlan.amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Investment failed');
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      toast({ title: "Activation Successful", description: `${selectedPlan.name} is now yielding returns.` })
      onClose()
      window.location.reload();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const isActive = (planId: number) => user?.plans?.some((p: any) => p.id === planId && p.status === 'active')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto bg-[#F0FDF4] border-0 p-0 rounded-[3rem] shadow-3xl font-sans">
        {/* Superior Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm px-8 py-7 flex items-center justify-between border-b border-green-50 backdrop-blur-md bg-white/90">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="h-6 w-6 rounded-lg bg-green-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <DialogTitle className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Market Alpha</DialogTitle>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">Live Asset Deployment</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-green-50/50 rounded-2xl flex items-center justify-center hover:bg-green-100 transition-all border-0 shadow-inner group">
            <X className="h-5 w-5 text-slate-400 group-hover:text-green-600 transition-colors" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {!selectedPlan ? (
            <div className="flex flex-col gap-5">
              {PLANS.map((plan) => {
                const active = isActive(plan.id);
                return (
                  <Card
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative overflow-hidden cursor-pointer group transition-all duration-500 border-0 bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(20,83,45,0.04)] hover:shadow-[0_25px_60px_rgba(20,83,45,0.12)] hover:-translate-y-1.5 active:scale-95 border-2 border-transparent hover:border-green-100/50 ${active ? 'ring-2 ring-green-500 ring-offset-4' : ''}`}
                  >
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-40 transition-opacity group-hover:opacity-80" />
                    <div className="absolute bottom-0 left-0 h-24 w-24 bg-emerald-50 rounded-full blur-2xl -ml-12 -mb-12 opacity-30" />

                    <div className="p-7 flex flex-col gap-7 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100/50 text-[8px] font-black uppercase tracking-widest">{plan.level}</div>
                            {active && <div className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><Activity className="h-2.5 w-2.5 shadow-sm" /> Running</div>}
                          </div>
                          <h3 className="font-black text-xl text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-green-600 transition-colors">{plan.name}</h3>
                        </div>
                        <div className="text-right bg-slate-50/50 px-4 py-2.5 rounded-2xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all">
                          <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">₹{plan.amount.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[2px] mt-1.5 opacity-50">Entry Req</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50/40 rounded-[1.8rem] border border-green-50/50 transition-all group-hover:bg-white group-hover:shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-nowrap">Daily Yield</span>
                          </div>
                          <p className="text-2xl font-black text-green-700 tracking-tight leading-none italic">₹{plan.dailyReturn}</p>
                        </div>
                        <div className="p-4 bg-emerald-600/[0.03] rounded-[1.8rem] border border-emerald-500/10 transition-all group-hover:bg-emerald-600 group-hover:border-emerald-600 group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 group-hover:text-white" />
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-emerald-100">Net Return</span>
                            </div>
                            <div className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[7px] font-black uppercase group-hover:bg-white group-hover:text-emerald-600 shadow-sm">300%</div>
                          </div>
                          <p className="text-2xl font-black text-emerald-600 tracking-tighter leading-none group-hover:text-white">₹{plan.totalReturn.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3 text-slate-400 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
                          <Timer className="h-4 w-4 text-green-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{plan.duration} Day Cycle</span>
                        </div>
                        <div className="h-12 w-12 rounded-2xl premium-gradient flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform active:scale-95 duration-300">
                          <ArrowRightCircle className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-6 duration-700 font-sans pb-10">
              <Card className="p-10 bg-[#14532D] text-white rounded-[3.5rem] shadow-2xl relative overflow-hidden group border-0 text-center font-sans selection:bg-green-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] -mr-20 -mt-20 transition-all duration-1000 group-hover:bg-green-500/20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -ml-20 -mb-20" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md shadow-inner animate-pulse">
                    <ShieldCheck className="h-8 w-8 text-green-300" />
                  </div>
                  <span className="text-green-400 font-bold text-[10px] uppercase tracking-[4px] mb-3 block opacity-60">Asset Protocol Confirmation</span>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">{selectedPlan.name}</h3>
                  <div className="h-1 w-12 bg-green-500 rounded-full mb-10 opacity-40 mx-auto" />

                  <div className="grid grid-cols-2 gap-x-12 w-full max-w-[280px]">
                    <div className="text-center">
                      <p className="text-green-300/40 text-[9px] font-bold uppercase tracking-widest mb-3">Daily Payout</p>
                      <p className="text-3xl font-black text-white tracking-tighter italic">₹{selectedPlan.dailyReturn}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-300/40 text-[9px] font-bold uppercase tracking-widest mb-3">Goal ROI</p>
                      <p className="text-3xl font-black text-emerald-400 tracking-tighter">₹{selectedPlan.totalReturn.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4 px-2">
                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full h-16 premium-gradient text-white rounded-[1.8rem] font-bold text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(34,197,94,0.3)] active:scale-95 transition-all border-0 text-white"
                >
                  {isProcessing ? "Transmitting Protocol..." : "Activate Liquidity Engine"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPlan(null)}
                  className="w-full h-14 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors rounded-[1.5rem]"
                >
                  Return to Market Hub
                </Button>
              </div>

              <div className="flex items-center justify-center gap-5 opacity-40 h-10 px-8">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-green-600" />
                  <span className="text-[9px] font-bold uppercase tracking-[2px]">Encrypted Site</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-[9px] font-bold uppercase tracking-[2px]">Sync Node B</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
