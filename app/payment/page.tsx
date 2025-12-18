"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [utr, setUtr] = useState("")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const amountParam = searchParams.get("amount")
    if (amountParam) {
      setAmount(amountParam)
    }
  }, [searchParams])

  const handlePayment = async () => {
    if (utr.length !== 12) {
      toast({
        title: "Invalid UTR",
        description: "UTR number must be exactly 12 digits.",
        variant: "destructive",
      })
      return
    }

    if (!screenshot) {
      toast({
        title: "Missing Screenshot",
        description: "Please upload the payment screenshot.",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      if (!currentUser.email) {
        throw new Error("User session invalid. Please login again.");
      }

      const formData = new FormData();
      formData.append('email', currentUser.email);
      formData.append('amount', amount);
      formData.append('utr', utr);
      formData.append('screenshot', screenshot);

      const res = await fetch('/api/user/deposit', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Deposit failed');

      // Update Local Storage
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast({
        title: "Deposit Request Submitted",
        description: "Your deposit is pending approval. Check history for status.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={() => router.back()} variant="ghost" className="text-white hover:bg-white/20 p-2">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold">Complete Payment</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card className="p-6 shadow-lg">
          <Label className="text-gray-700 font-medium">Amount to Pay</Label>
          <div className="mt-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
            <p className="text-4xl font-bold text-emerald-600">₹{amount}</p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6 shadow-lg space-y-4">
            <div>
              <Label htmlFor="utr" className="text-gray-700 font-medium">
                Enter 12-Digit UTR Number
              </Label>
              <Input
                id="utr"
                type="text"
                placeholder="Enter UTR number"
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
                className="mt-2 h-12 text-base"
                maxLength={12}
              />
            </div>

            <div>
              <Label htmlFor="screenshot" className="text-gray-700 font-medium">
                Upload Payment Screenshot
              </Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                className="mt-2 h-12 pt-2 text-base"
              />
            </div>
          </Card>

          <Button
            onClick={handlePayment}
            disabled={utr.length !== 12 || !screenshot || processing}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md font-bold text-lg"
          >
            {processing ? "Processing..." : "Submit Deposit Request"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
