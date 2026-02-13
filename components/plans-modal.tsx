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
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto bg-[#0B1020] border-0 p-0 rounded-[3rem] shadow-3xl font-sans selection:bg-purple-500/30">
        {/* Superior Header */}
        <div className="sticky top-0 z-40 bg-[#0B1020]/80 shadow-sm px-8 py-7 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="h-7 w-7 rounded-lg bg-[#5B2EFF] flex items-center justify-center purple-glow">
                <Zap className="h-4.5 w-4.5 text-white fill-white" />
              </div>
              <DialogTitle className="text-xl font-black text-white tracking-tighter uppercase leading-none">Market Alpha</DialogTitle>
            </div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px] ml-1">Live Asset Deployment</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border-0 shadow-inner group">
            <X className="h-5 w-5 text-slate-500 group-hover:text-[#00F0FF] transition-colors" />
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
                    className={`relative overflow-hidden cursor-pointer group transition-all duration-500 border-0 bg-[#0F1C3F]/40 glass-card rounded-[2.5rem] shadow-xl hover:shadow-[#5B2EFF]/10 hover:-translate-y-1.5 active:scale-95 border-2 border-white/5 hover:border-[#5B2EFF]/30 ${active ? 'ring-2 ring-[#5B2EFF] ring-offset-[#0B1020]' : ''}`}
                  >
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-[#5B2EFF]/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-40 transition-opacity group-hover:opacity-80" />
                    <div className="absolute bottom-0 left-0 h-24 w-24 bg-[#00F0FF]/5 rounded-full blur-2xl -ml-12 -mb-12 opacity-30" />

                    <div className="p-7 flex flex-col gap-7 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="px-2.5 py-1 rounded-lg bg-[#5B2EFF]/10 text-[#00F0FF] border-0 text-[8px] font-black uppercase tracking-widest">{plan.level}</div>
                            {active && <div className="px-2.5 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981] border-0 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><Activity className="h-2.5 w-2.5 shadow-sm" /> Running</div>}
                          </div>
                          <h3 className="font-black text-xl text-white uppercase tracking-tighter leading-tight group-hover:text-[#5B2EFF] transition-colors">{plan.name}</h3>
                        </div>
                        <div className="text-right bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                          <p className="text-2xl font-black text-white tracking-tighter leading-none">₹{plan.amount.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[2px] mt-1.5 opacity-50">Entry Req</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-[1.8rem] border border-white/5 transition-all group-hover:bg-white/10 group-hover:shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-3.5 w-3.5 text-[#00F0FF]" />
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest text-nowrap">Daily Yield</span>
                          </div>
                          <p className="text-2xl font-black text-white tracking-tight leading-none">₹{plan.dailyReturn}</p>
                        </div>
                        <div className="p-4 bg-[#5B2EFF]/5 rounded-[1.8rem] border border-[#5B2EFF]/20 transition-all group-hover:bg-[#5B2EFF] group-hover:border-[#5B2EFF] group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981] group-hover:text-white" />
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest group-hover:text-purple-100">Net Return</span>
                            </div>
                            <div className="px-1.5 py-0.5 rounded-md bg-[#5B2EFF] text-white text-[7px] font-black uppercase group-hover:bg-white group-hover:text-[#5B2EFF] shadow-sm">300%</div>
                          </div>
                          <p className="text-2xl font-black text-[#5B2EFF] tracking-tighter leading-none group-hover:text-white">₹{plan.totalReturn.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3 text-slate-500 bg-white/5 px-3.5 py-2 rounded-xl border border-white/5">
                          <Timer className="h-4 w-4 text-[#00F0FF]" />
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{plan.duration} Day Cycle</span>
                        </div>
                        <div className="h-12 w-12 rounded-2xl premium-gradient flex items-center justify-center shadow-xl shadow-purple-900/40 group-hover:scale-110 transition-transform active:scale-95 duration-300 purple-glow">
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
              <Card className="p-10 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white rounded-[3.5rem] shadow-3xl relative overflow-hidden group border border-white/5 text-center font-sans selection:bg-purple-900">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B2EFF]/10 rounded-full blur-[100px] -mr-20 -mt-20 transition-all duration-1000 group-hover:bg-[#5B2EFF]/20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00F0FF]/10 rounded-full blur-[80px] -ml-20 -mb-20" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md shadow-inner purple-glow">
                    <ShieldCheck className="h-8 w-8 text-[#00F0FF]" />
                  </div>
                  <span className="text-[#5B2EFF] font-black text-[10px] uppercase tracking-[4px] mb-3 block opacity-80">Asset Protocol Confirmation</span>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tight leading-none">{selectedPlan.name}</h3>
                  <div className="h-1 w-12 bg-[#5B2EFF] rounded-full mb-10 opacity-40 mx-auto" />

                  <div className="grid grid-cols-2 gap-x-12 w-full max-w-[280px]">
                    <div className="text-center">
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-3">Daily Payout</p>
                      <p className="text-3xl font-black text-white tracking-tighter">₹{selectedPlan.dailyReturn}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-3">Goal ROI</p>
                      <p className="text-3xl font-black text-[#10B981] tracking-tighter">₹{selectedPlan.totalReturn.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4 px-2">
                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full h-16 premium-gradient text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[4px] shadow-3xl border-0 active:scale-95 transition-all purple-glow"
                >
                  {isProcessing ? "Transmitting Protocol..." : "Activate Liquidity Engine"}
                </Button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="w-full h-14 text-slate-500 font-black text-[10px] uppercase tracking-[4px] hover:text-white transition-colors rounded-[1.5rem]"
                >
                  Return to Market Hub
                </button>
              </div>

              <div className="flex items-center justify-center gap-5 opacity-40 h-10 px-8">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#5B2EFF]" />
                  <span className="text-[9px] font-black uppercase tracking-[2px]">Encrypted Site</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#5B2EFF]" />
                  <span className="text-[9px] font-black uppercase tracking-[2px]">Sync Node B</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
