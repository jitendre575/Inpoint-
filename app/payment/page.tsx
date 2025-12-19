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
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const amountParam = searchParams.get("amount")
    if (amountParam) {
      setAmount(amountParam)
    }
  }, [searchParams])

  const handlePayment = async (method: string) => {
    setProcessing(true)

    // Simulate "Redirecting to Payment Gateway" delay
    setTimeout(async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
        if (!currentUser.email) {
          throw new Error("User session invalid. Please login again.");
        }

        const res = await fetch('/api/user/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            amount: amount,
            method: method
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Deposit failed');

        // Update Local Storage with new wallet balance
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        toast({
          title: "Payment Successful",
          description: `₹${amount} added to your wallet successfully via ${method}.`,
        })

        router.push("/dashboard")
      } catch (error: any) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setProcessing(false)
      }
    }, 2000); // 2 second delay to simulate payment processing
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
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="p-6 shadow-lg border-0 bg-white">
          <Label className="text-gray-500 font-medium text-sm uppercase tracking-wide">Total Payable Amount</Label>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-gray-900">₹{amount}</span>
            <span className="text-gray-500 font-medium">INR</span>
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Select Payment Method</h3>
          <div className="grid gap-4">
            <Button
              onClick={() => handlePayment("PhonePe")}
              disabled={processing}
              className="h-16 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 shadow-sm flex items-center justify-between px-6 rounded-xl group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                  Pe
                </div>
                <span className="font-semibold text-lg">PhonePe</span>
              </div>
              {processing && <div className="animate-spin h-5 w-5 border-2 border-emerald-500 rounded-full border-t-transparent" />}
            </Button>

            <Button
              onClick={() => handlePayment("Paytm")}
              disabled={processing}
              className="h-16 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 shadow-sm flex items-center justify-between px-6 rounded-xl group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  Pay
                </div>
                <span className="font-semibold text-lg">Paytm</span>
              </div>
              {processing && <div className="animate-spin h-5 w-5 border-2 border-emerald-500 rounded-full border-t-transparent" />}
            </Button>

            <Button
              onClick={() => handlePayment("Google Pay")}
              disabled={processing}
              className="h-16 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 shadow-sm flex items-center justify-between px-6 rounded-xl group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                  G
                </div>
                <span className="font-semibold text-lg">Google Pay</span>
              </div>
              {processing && <div className="animate-spin h-5 w-5 border-2 border-emerald-500 rounded-full border-t-transparent" />}
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 mt-8">
          By clicking pay, you agree to our terms and conditions.
        </p>
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
