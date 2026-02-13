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
      {/* Refined Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-5 pt-12 pb-16 relative overflow-hidden rounded-b-2xl shadow-xl border-b border-white/5">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <ArrowLeft className="h-4 w-4 text-[#00F0FF] cursor-pointer" onClick={() => router.back()} />
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-widest mb-0.5">Standard Settlement</p>
              <h1 className="text-lg font-bold tracking-tight uppercase text-white leading-none">Exit Capital</h1>
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <ShieldCheck className="h-4 w-4 text-[#5B2EFF]" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-20">
        <Card className="glass-card bg-[#121A33]/80 shadow-2xl border border-white/5 rounded-2xl p-6 overflow-hidden relative group">
          <div className="relative text-center">
            <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-widest mb-1.5">Redeemable Balance</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">₹{user.wallet?.toLocaleString()}</h2>
            <div className="flex items-center justify-center gap-1.5 text-[#00F0FF] font-semibold text-[8px] uppercase tracking-widest px-1">
              <Timer className="h-3 w-3" />
              <span>Audit available every 24h</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-4 space-y-4 mt-4">
        <Card className="p-6 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-sm rounded-2xl">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Transfer Amount</Label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Min 1000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-12 pl-8 rounded-xl border-white/5 bg-black/20 focus:bg-black/40 focus:ring-2 focus:ring-[#5B2EFF]/10 font-bold text-lg border-2 transition-all text-white placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest ml-1 mb-1.5">Payout Channel</p>
              <div className="flex p-0.5 bg-black/20 border border-white/5 rounded-xl gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "bank" })}
                  className={`flex-1 h-9 rounded-lg font-semibold text-[9px] uppercase tracking-widest transition-all ${formData.bankOrUpi === "bank" ? "bg-white/10 text-[#00F0FF] shadow-sm border border-white/10" : "text-slate-500 hover:text-white"}`}
                >
                  Bank Node
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "upi" })}
                  className={`flex-1 h-9 rounded-lg font-semibold text-[9px] uppercase tracking-widest transition-all ${formData.bankOrUpi === "upi" ? "bg-white/10 text-[#00F0FF] shadow-sm border border-white/10" : "text-slate-500 hover:text-white"}`}
                >
                  UPI ID
                </button>
              </div>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <Label className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Beneficiary Legal Name</Label>
                <Input
                  placeholder="As per bank records"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-lg bg-black/20 border-white/5 focus:bg-black/30 focus:ring-2 focus:ring-[#5B2EFF]/10 font-semibold text-xs px-4 text-white placeholder:text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  {formData.bankOrUpi === "bank" ? "Account Identifier" : "Virtual Payment Address"}
                </Label>
                <Input
                  placeholder={formData.bankOrUpi === "bank" ? "Enter account number" : "e.g. user@bank"}
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="h-11 rounded-lg bg-black/20 border-white/5 focus:bg-black/30 focus:ring-2 focus:ring-[#5B2EFF]/10 font-semibold text-xs px-4 text-white placeholder:text-slate-800"
                />
              </div>
              {formData.bankOrUpi === "bank" && (
                <div className="space-y-1">
                  <Label className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest ml-1">IFSC Designation</Label>
                  <Input
                    placeholder="Bank branch code"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    className="h-11 rounded-lg bg-black/20 border-white/5 focus:bg-black/30 focus:ring-2 focus:ring-[#5B2EFF]/10 font-semibold uppercase text-xs px-4 text-white placeholder:text-slate-800"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Info Alert */}
        <Card className="px-5 py-4 bg-[#0F1C3F]/40 border border-white/5 rounded-xl flex gap-3 items-center">
          <div className="h-9 w-9 bg-black/20 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
            <Activity className="h-4 w-4 text-[#00F0FF]" />
          </div>
          <div>
            <p className="text-[8px] font-semibold text-white uppercase tracking-widest mb-0.5">Audit Duration</p>
            <p className="text-slate-500 text-[8px] font-medium uppercase tracking-widest leading-none">Settle within 24-48h registry cycle.</p>
          </div>
        </Card>

        <Button
          onClick={handleWithdraw}
          disabled={loading || (user?.wallet < 1000)}
          className="w-full h-12 premium-gradient text-white font-bold rounded-xl shadow-lg transition-all border-0 text-[10px] uppercase tracking-widest active:scale-95 disabled:opacity-30"
        >
          {loading ? "Establishing Link..." : user?.wallet < 1000 ? "Under Minimum Limit" : "Initiate Withdrawal"}
        </Button>
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
