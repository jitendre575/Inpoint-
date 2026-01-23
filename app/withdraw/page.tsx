"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Wallet, Landmark, QrCode, ShieldCheck, Timer, ChevronRight } from "lucide-react"

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
    <div className="min-h-screen bg-[#FDFCFF] pb-32 font-sans selection:bg-theme-lavender selection:text-theme-purple">
      {/* Dynamic Header */}
      <div className="bg-[#1A0B2E] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-theme-purple/20 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <ArrowLeft className="h-6 w-6 text-theme-violet cursor-pointer" onClick={() => router.back()} />
            </div>
            <div>
              <p className="text-theme-lavender/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Elite Settlement</p>
              <h1 className="text-2xl font-black tracking-tighter">Withdraw Capital</h1>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <ShieldCheck className="h-6 w-6 text-theme-gold" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20">
        <Card className="bg-white/95 backdrop-blur-3xl shadow-xl shadow-theme-purple/5 border border-theme-lavender rounded-[3rem] p-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-theme-lavender/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />

          <div className="relative">
            <p className="text-theme-purple/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-2">Total Redeemable</p>
            <h2 className="text-5xl font-black text-[#2D1A4A] tracking-tighter italic mb-1">₹{user.wallet?.toLocaleString()}</h2>
            <div className="flex items-center gap-2 text-theme-gold font-black text-[10px] uppercase tracking-widest px-1">
              <Timer className="h-3 w-3" />
              <span>Next Settlement available in 24h</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-5 space-y-6 mt-6">
        <Card className="p-8 bg-white border border-theme-purple/5 shadow-[0_16px_32px_rgba(109,40,217,0.04)] rounded-[3rem]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Withdraw Amount</Label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-purple/30 font-black text-lg">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Min 1000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-16 pl-12 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 font-black text-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Channel</Label>
              <div className="flex p-1.5 bg-theme-lavender rounded-3xl gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "bank" })}
                  className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.bankOrUpi === "bank" ? "bg-white text-theme-purple shadow-sm" : "text-theme-purple/30"}`}
                >
                  <Landmark className="h-4 w-4" /> Bank
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "upi" })}
                  className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.bankOrUpi === "upi" ? "bg-white text-theme-purple shadow-sm" : "text-theme-purple/30"}`}
                >
                  <QrCode className="h-4 w-4" /> UPI ID
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Beneficiary Name</Label>
                <Input
                  id="name"
                  placeholder="Verify your passbook name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">
                  {formData.bankOrUpi === "bank" ? "Account Identifier" : "Virtual Payment Address"}
                </Label>
                <Input
                  id="accountNumber"
                  placeholder={formData.bankOrUpi === "bank" ? "Account Number" : "name@upi"}
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="h-14 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 font-bold"
                />
              </div>

              {formData.bankOrUpi === "bank" && (
                <div className="space-y-2">
                  <Label htmlFor="ifsc" className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">IFSC Designation</Label>
                  <Input
                    id="ifsc"
                    placeholder="Bank Branch Code"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    className="h-14 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 font-black uppercase"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Info Alert */}
        <div className="px-4 py-6 bg-theme-gold/5 border border-theme-gold/10 rounded-[2.5rem] flex gap-5">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-theme-gold/10">
            <Timer className="h-6 w-6 text-theme-gold animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black text-theme-gold uppercase tracking-[0.2em] mb-1">Standard Processing</p>
            <p className="text-theme-gold/60 text-xs font-bold leading-relaxed">Typical audit timeline is 24 to 48 hours for institutional security.</p>
          </div>
        </div>

        <Button
          onClick={handleWithdraw}
          disabled={loading || (user?.wallet < 1000)}
          className={`w-full h-18 text-white font-black rounded-3xl shadow-2xl transition-all border-0 text-lg active:scale-95 disabled:opacity-50 ${user?.wallet < 1000
            ? "bg-slate-200 text-slate-400"
            : "bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple shadow-theme-purple/20"
            }`}
        >
          {loading ? "Establishing Link..." : user?.wallet < 1000 ? "Minimum ₹1000 Required" : "Submit Request"}
        </Button>
        {user?.wallet < 1000 && (
          <p className="text-center text-rose-500 text-[10px] font-black uppercase tracking-widest">
            Portfolio must meet ₹1000 threshold for liquidity.
          </p>
        )}
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
