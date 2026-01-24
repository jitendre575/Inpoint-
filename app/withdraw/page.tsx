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
    <div className="min-h-screen bg-[#F8FAF8] pb-32 font-sans selection:bg-green-100">
      {/* Dynamic Header */}
      <div className="bg-[#14532D] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <ArrowLeft className="h-5 w-5 text-green-300 cursor-pointer" onClick={() => router.back()} />
            </div>
            <div>
              <p className="text-green-300/40 text-[9px] font-bold uppercase tracking-widest mb-1">Standard Settlement</p>
              <h1 className="text-xl font-bold tracking-tight uppercase not-italic">Exit Capital</h1>
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <ShieldCheck className="h-5 w-5 text-green-400" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20">
        <Card className="bg-white shadow-[0_20px_60px_rgba(20,83,45,0.06)] border border-green-50 rounded-[3rem] p-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform duration-1000" />

          <div className="relative text-center">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-2">Redeemable Balance</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">₹{user.wallet?.toLocaleString()}</h2>
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[9px] uppercase tracking-widest px-1">
              <Timer className="h-3.5 w-3.5" />
              <span>Audit available every 24h</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-5 space-y-6 mt-6">
        <Card className="p-8 bg-white border border-green-50 shadow-sm rounded-[3rem]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Transfer Amount</Label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Min 1000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-14 pl-10 rounded-xl border-green-50 bg-[#F0FDF4]/30 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-bold text-xl border-2 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">Payout Channel</p>
              <div className="flex p-1 bg-green-50/50 border border-green-100 rounded-2xl gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "bank" })}
                  className={`flex-1 h-11 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${formData.bankOrUpi === "bank" ? "bg-white text-green-700 shadow-sm border border-green-100" : "text-slate-400"}`}
                >
                  Bank Node
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "upi" })}
                  className={`flex-1 h-11 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${formData.bankOrUpi === "upi" ? "bg-white text-green-700 shadow-sm border border-green-100" : "text-slate-400"}`}
                >
                  UPI ID
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Beneficiary Legal Name</Label>
                <Input
                  placeholder="As per bank records"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-bold text-sm px-5"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  {formData.bankOrUpi === "bank" ? "Account Identifier" : "Virtual Payment Address"}
                </Label>
                <Input
                  placeholder={formData.bankOrUpi === "bank" ? "Enter account number" : "e.g. user@bank"}
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-bold text-sm px-5"
                />
              </div>
              {formData.bankOrUpi === "bank" && (
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">IFSC Designation</Label>
                  <Input
                    placeholder="Bank branch code"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-bold uppercase text-sm px-5"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Info Alert */}
        <Card className="px-5 py-5 bg-green-50/50 border border-green-100 rounded-[2rem] flex gap-4 items-center">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-green-100 shrink-0">
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Audit Duration</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Withdrawals are processed within 24–48 hours for security.</p>
          </div>
        </Card>

        <Button
          onClick={handleWithdraw}
          disabled={loading || (user?.wallet < 1000)}
          className={`w-full h-14 premium-gradient text-white font-bold rounded-2xl shadow-xl shadow-green-100 transition-all border-0 text-sm uppercase tracking-widest active:scale-95 disabled:opacity-50`}
        >
          {loading ? "Establishing Link..." : user?.wallet < 1000 ? "Minimum ₹1000 Required" : "Initiate Withdrawal"}
        </Button>
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
