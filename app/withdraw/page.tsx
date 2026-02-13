"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Wallet, Landmark, QrCode, ShieldCheck, Timer, ChevronRight, Activity } from "lucide-react"

export default function WithdrawPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    bankOrUpi: "bank",
    accountNumber: "",
    ifsc: "",
  })

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleWithdraw = async () => {
    const amount = Number.parseFloat(formData.amount)

    if (!amount || amount < 1000) {
      toast({ title: "Min Withdrawal", description: "Minimum withdrawal amount is ₹1000", variant: "destructive" })
      return
    }

    if (user && amount > user.wallet) {
      toast({ title: "Insufficient Balance", description: "You do not have enough balance.", variant: "destructive" })
      return
    }

    if (!formData.name || !formData.accountNumber || (formData.bankOrUpi === 'bank' && !formData.ifsc)) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount,
          bankDetails: {
            name: formData.name,
            type: formData.bankOrUpi,
            accountNumber: formData.accountNumber,
            ifsc: formData.bankOrUpi === 'bank' ? formData.ifsc : undefined
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Withdraw failed');
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast({ title: "Request Sent", description: "Your withdrawal request is pending approval." })
      router.push("/dashboard")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0B1020] pb-32 font-sans selection:bg-purple-500/30">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-3xl border-b border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B2EFF]/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <ArrowLeft className="h-5 w-5 text-[#00F0FF] cursor-pointer" onClick={() => router.back()} />
            </div>
            <div>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[3px] mb-1">Standard Settlement</p>
              <h1 className="text-xl font-black tracking-tight uppercase text-white leading-none">Exit Capital</h1>
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <ShieldCheck className="h-5 w-5 text-[#5B2EFF]" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20">
        <Card className="glass-card bg-[#121A33]/80 shadow-3xl border border-white/5 rounded-[3rem] p-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B2EFF]/5 rounded-full -mr-16 -mt-16 transition-transform duration-1000" />

          <div className="relative text-center">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[5px] mb-2">Redeemable Balance</p>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">₹{user.wallet?.toLocaleString()}</h2>
            <div className="flex items-center justify-center gap-2 text-[#00F0FF] font-black text-[9px] uppercase tracking-[3px] px-1">
              <Timer className="h-3.5 w-3.5" />
              <span>Audit available every 24h</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-5 space-y-6 mt-6">
        <Card className="p-8 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-sm rounded-[3rem]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-1">Transfer Amount</Label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-lg">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Min 1000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-14 pl-10 rounded-xl border-white/5 bg-black/20 focus:bg-black/40 focus:ring-4 focus:ring-[#5B2EFF]/10 font-black text-xl border-2 transition-all text-white placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-1 mb-2">Payout Channel</p>
              <div className="flex p-1 bg-black/20 border border-white/5 rounded-2xl gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "bank" })}
                  className={`flex-1 h-11 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.bankOrUpi === "bank" ? "bg-white/10 text-[#00F0FF] shadow-sm border border-white/10" : "text-slate-500 hover:text-white"}`}
                >
                  Bank Node
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "upi" })}
                  className={`flex-1 h-11 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.bankOrUpi === "upi" ? "bg-white/10 text-[#00F0FF] shadow-sm border border-white/10" : "text-slate-500 hover:text-white"}`}
                >
                  UPI ID
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-1">Beneficiary Legal Name</Label>
                <Input
                  placeholder="As per bank records"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-xl bg-black/20 border-white/5 focus:bg-black/30 focus:ring-4 focus:ring-[#5B2EFF]/10 font-bold text-sm px-5 text-white placeholder:text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-1">
                  {formData.bankOrUpi === "bank" ? "Account Identifier" : "Virtual Payment Address"}
                </Label>
                <Input
                  placeholder={formData.bankOrUpi === "bank" ? "Enter account number" : "e.g. user@bank"}
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="h-12 rounded-xl bg-black/20 border-white/5 focus:bg-black/30 focus:ring-4 focus:ring-[#5B2EFF]/10 font-bold text-sm px-5 text-white placeholder:text-slate-800"
                />
              </div>
              {formData.bankOrUpi === "bank" && (
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-1">IFSC Designation</Label>
                  <Input
                    placeholder="Bank branch code"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    className="h-12 rounded-xl bg-black/20 border-white/5 focus:bg-black/30 focus:ring-4 focus:ring-[#5B2EFF]/10 font-bold uppercase text-sm px-5 text-white placeholder:text-slate-800"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Info Alert */}
        <Card className="px-6 py-5 bg-[#0F1C3F]/40 border border-white/5 rounded-[2rem] flex gap-4 items-center">
          <div className="h-10 w-10 bg-black/20 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
            <Activity className="h-5 w-5 text-[#00F0FF]" />
          </div>
          <div>
            <p className="text-[9px] font-black text-white uppercase tracking-[4px] mb-0.5">Audit Duration</p>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed">Settle within 24-48h registry cycle.</p>
          </div>
        </Card>

        <Button
          onClick={handleWithdraw}
          disabled={loading || (user?.wallet < 1000)}
          className={`w-full h-14 premium-gradient text-white font-black rounded-2xl shadow-3xl shadow-purple-900/20 transition-all border-0 text-sm uppercase tracking-[4px] active:scale-95 disabled:opacity-30 purple-glow`}
        >
          {loading ? "Establishing Link..." : user?.wallet < 1000 ? "Under Minimum Limit" : "Initiate Withdrawal"}
        </Button>
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
