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
  const [showScanner, setShowScanner] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const amountParam = searchParams.get("amount")
    if (amountParam) {
      setAmount(amountParam)
    }
  }, [searchParams])

  const handlePayment = () => {
    if (utr.length !== 12) {
      toast({
        title: "Invalid UTR",
        description: "UTR number must be exactly 12 digits.",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      currentUser.wallet = (currentUser.wallet || 0) + Number.parseFloat(amount)
      localStorage.setItem("currentUser", JSON.stringify(currentUser))

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id)
      users[userIndex] = currentUser
      localStorage.setItem("users", JSON.stringify(users))

      toast({
        title: "Payment Successful",
        description: `₹${amount} has been added to your wallet.`,
      })

      setProcessing(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

        {!showScanner ? (
          <div className="space-y-4">
            <Card className="p-6 shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="h-20 w-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">QR Code Scanner</p>
                  <p className="text-sm text-gray-500 mt-1">Scan to pay securely</p>
                </div>
              </div>
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Proceed to Payment
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-6 shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                <div className="text-center text-white">
                  <svg className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-bold text-lg">Payment Processing...</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-lg">
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
              <p className="text-xs text-gray-500 mt-2">
                Enter the 12-digit transaction reference number from your payment confirmation
              </p>
            </Card>

            <Button
              onClick={handlePayment}
              disabled={utr.length !== 12 || processing}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {processing ? "Verifying Payment..." : "Confirm Payment"}
            </Button>
          </div>
        )}
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
