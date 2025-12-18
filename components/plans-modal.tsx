"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

const PLANS = [
  { name: "Starter Plan", amount: 1000, return: 12, duration: "7 days", hourlyReturn: 5, expectedProfit: 1120 },
  { name: "Growth Plan", amount: 5000, return: 18, duration: "7 days", hourlyReturn: 5, expectedProfit: 5900 },
  { name: "Premium Plan", amount: 10000, return: 25, duration: "21 days", hourlyReturn: 5, expectedProfit: 12500 },
]

export function PlansModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [customAmount, setCustomAmount] = useState("")

  const handlePurchase = async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const amount = customAmount ? Number.parseFloat(customAmount) : selectedPlan.amount

    if (currentUser.wallet < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch('/api/user/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          plan: selectedPlan,
          amount
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Investment failed');
      }

      // Update local storage with new user state from server
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      const instantCredit = amount * 0.2
      toast({
        title: "Plan Purchased",
        description: `20% (₹${instantCredit}) credited instantly to your wallet!`,
      })

      onClose()
      // Force reload to update dashboard UI immediately
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">Investment Plans</DialogTitle>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        {!selectedPlan ? (
          <div className="space-y-4 py-4">
            {PLANS.map((plan, index) => (
              <Card
                key={plan.name}
                className="p-5 cursor-pointer hover:shadow-2xl transition-all border-0 shadow-lg active:scale-98 relative overflow-hidden"
                onClick={() => setSelectedPlan(plan)}
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                      : index === 1
                        ? "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)"
                        : "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20"
                  style={{
                    background: index === 0 ? "#fbbf24" : index === 1 ? "#3b82f6" : "#ec4899",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-4xl font-bold"
                        style={{
                          color: index === 0 ? "#d97706" : index === 1 ? "#2563eb" : "#db2777",
                        }}
                      >
                        {plan.return}%
                      </p>
                      <p className="text-xs text-gray-500">Return</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-semibold text-gray-900">₹{plan.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Profit:</span>
                      <span
                        className="font-semibold"
                        style={{
                          color: index === 0 ? "#d97706" : index === 1 ? "#2563eb" : "#db2777",
                        }}
                      >
                        ₹{plan.expectedProfit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Increment:</span>
                      <span className="font-semibold text-gray-900">₹{plan.hourlyReturn}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 shadow-lg">
              <h3 className="font-bold text-xl text-gray-900 mb-3">{selectedPlan.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Default Investment:</span>
                  <span className="font-semibold">₹{selectedPlan.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Return Rate:</span>
                  <span className="font-semibold text-emerald-600">{selectedPlan.return}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedPlan.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hourly Increment:</span>
                  <span className="font-semibold">₹{selectedPlan.hourlyReturn}</span>
                </div>
              </div>
            </Card>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Amount (Optional)</label>
              <Input
                type="number"
                placeholder={`Default: ₹${selectedPlan.amount}`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="h-12 text-base border-2 focus:border-emerald-500"
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-4 rounded-2xl border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-1">💰 Instant Benefit</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Get 20% of your investment amount credited instantly to your wallet. Remaining amount will be credited
                hourly at ₹{selectedPlan.hourlyReturn}/hour.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setSelectedPlan(null)} variant="outline" className="flex-1 h-12 border-2">
                Back
              </Button>
              <Button
                onClick={handlePurchase}
                className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
              >
                Purchase Now
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
