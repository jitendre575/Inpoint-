"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"

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
  })

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleWithdraw = async () => {
    const amount = Number.parseFloat(formData.amount)

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    if (user && amount > user.wallet) {
      toast({
        title: "Insufficient Balance",
        description: "You do not have enough balance to withdraw this amount.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.accountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
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
            accountNumber: formData.accountNumber
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Withdraw failed');

      // Update Local Storage
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request is pending approval.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={() => router.back()} variant="ghost" className="text-white hover:bg-white/20 p-2">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold">Withdraw Money</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-5">
          <p className="text-orange-100 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold">₹{user.wallet?.toFixed(2) || "0.00"}</p>
        </Card>
      </div>

      <div className="p-6 space-y-4">
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-gray-700 font-medium">
                Withdrawal Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-2 h-12 text-base"
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Account Holder Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 h-12 text-base"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Payment Method</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "bank" })}
                  className={`flex-1 h-12 ${formData.bankOrUpi === "bank"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                >
                  Bank Account
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, bankOrUpi: "upi" })}
                  className={`flex-1 h-12 ${formData.bankOrUpi === "upi"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                >
                  UPI ID
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="accountNumber" className="text-gray-700 font-medium">
                {formData.bankOrUpi === "bank" ? "Account Number" : "UPI ID"}
              </Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder={formData.bankOrUpi === "bank" ? "Enter account number" : "Enter UPI ID"}
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="mt-2 h-12 text-base"
              />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-orange-50 border-orange-200">
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900 mb-1">Processing Time</p>
              <p className="text-xs text-orange-700 leading-relaxed">
                Withdrawal requests are typically processed within 24-48 hours.
              </p>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold text-lg shadow-md"
        >
          {loading ? "Processing..." : "Submit Withdrawal Request"}
        </Button>
      </div>

      <BottomNav active="wallet" />
    </div>
  )
}
