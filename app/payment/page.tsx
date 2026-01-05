"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Clock, Upload, CheckCircle2, AlertCircle, ArrowLeft, Loader2, IndianRupee, QrCode, Building2 } from "lucide-react"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [processing, setProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [selectedMethod, setSelectedMethod] = useState("")
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [step, setStep] = useState<"SELECT" | "CONFIRM">("SELECT")
  const [currentDepositStatus, setCurrentDepositStatus] = useState("Processing")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const amountParam = searchParams.get("amount")
    if (amountParam) {
      setAmount(amountParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (timeLeft <= 0 && step === "SELECT") {
      toast({
        title: "Session Expired",
        description: "Payment session expired. Redirecting to home.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    if (step === "SELECT") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, router, toast, step])

  // Poll for status update when in CONFIRM step
  useEffect(() => {
    if (step === "CONFIRM") {
      const pollInterval = setInterval(async () => {
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
          if (!currentUser.id) return;

          const res = await fetch('/api/user/details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
          });
          const data = await res.json();
          if (data.user) {
            const lastDeposit = data.user.deposits?.slice(-1)[0];
            if (lastDeposit && lastDeposit.status !== currentDepositStatus) {
              setCurrentDepositStatus(lastDeposit.status);
              if (lastDeposit.status === 'Approved') {
                toast({ title: "Deposit Approved!", description: `₹${amount} added to wallet.` });
              }
            }
            localStorage.setItem("currentUser", JSON.stringify(data.user));
          }
        } catch (err) {
          console.error("Polling failed", err);
        }
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [step, currentDepositStatus, amount, toast])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshot(reader.result as string)
        setIsUploading(false)
        toast({ title: "Screenshot uploaded successfully" })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPayment = async () => {
    if (!selectedMethod) {
      toast({ title: "Please select a payment method", variant: "destructive" })
      return
    }
    if (!screenshot) {
      toast({ title: "Please upload payment screenshot", variant: "destructive" })
      return
    }

    setProcessing(true)

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
          amount: parseFloat(amount),
          method: selectedMethod,
          screenshot: screenshot
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Deposit failed');

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setStep("CONFIRM")
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (step === "CONFIRM") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-2xl transition-all duration-700 ${currentDepositStatus === 'Approved' ? 'bg-emerald-500 scale-110 shadow-emerald-500/20' : 'bg-white shadow-neutral-200 animate-pulse'}`}>
          {currentDepositStatus === 'Approved' ? (
            <CheckCircle2 className="h-12 w-12 text-white" />
          ) : currentDepositStatus === 'Rejected' ? (
            <AlertCircle className="h-12 w-12 text-rose-500" />
          ) : (
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          )}
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">
          {currentDepositStatus === 'Approved' ? 'Deposit Approved!' :
            currentDepositStatus === 'Rejected' ? 'Submission Rejected' : 'Payment Submitted!'}
        </h2>

        <div className="max-w-xs mx-auto mb-8">
          <p className="text-gray-500 font-medium">
            {currentDepositStatus === 'Approved' ?
              `₹${amount} has been successfully added to your wallet.` :
              currentDepositStatus === 'Rejected' ?
                'Your payment proof was not accepted. Contact support for help.' :
                `Your payment of ₹${amount} is being processed by our team.`}
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className={`flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs px-6 py-4 rounded-2xl shadow-sm border ${currentDepositStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              currentDepositStatus === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                'bg-white text-blue-600 border-neutral-100'
            }`}>
            {currentDepositStatus !== 'Approved' && currentDepositStatus !== 'Rejected' && <Loader2 className="h-4 w-4 animate-spin" />}
            Status: {currentDepositStatus}
          </div>

          <Button
            onClick={() => router.push("/dashboard")}
            className="h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-neutral-800"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header with Timer */}
      <div className="bg-neutral-900 text-white p-6 rounded-b-[3rem] shadow-2xl sticky top-0 z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <button onClick={() => router.back()} className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2 bg-rose-500 px-4 py-2 rounded-2xl border border-rose-400 shadow-lg shadow-rose-500/20 animate-pulse">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-black text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="text-center pb-8 relative z-10">
          <p className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Order Amount</p>
          <h1 className="text-6xl font-black">₹{amount}</h1>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-6">
        <Card className="p-8 shadow-2xl border-0 bg-white rounded-[2.5rem]">
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 pl-2">Selection Logic</h3>

          <div className="grid grid-cols-1 gap-4">
            {[
              { id: 'upi', label: 'UPI Instant', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'qr', label: 'Scan QR Code', icon: QrCode, color: 'text-rose-600', bg: 'bg-rose-50' },
              { id: 'bank', label: 'Bank Transfer', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all active:scale-[0.98] ${selectedMethod === method.id
                    ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50'
                    : 'border-neutral-100 bg-white hover:bg-neutral-50'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 ${method.bg} rounded-2xl flex items-center justify-center`}>
                    <method.icon className={`h-6 w-6 ${method.color}`} />
                  </div>
                  <span className="font-bold text-neutral-800">{method.label}</span>
                </div>
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'border-indigo-600 bg-indigo-600' : 'border-neutral-200'
                  }`}>
                  {selectedMethod === method.id && <div className="h-2 w-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Upload Proof */}
        <Card className="p-8 shadow-2xl border-0 bg-white rounded-[2.5rem]">
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 pl-2">Verification Proof</h3>

          {!screenshot ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition-all group"
            >
              <div className="h-16 w-16 bg-neutral-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-all">
                <Upload className="h-8 w-8 text-neutral-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="font-black text-neutral-800 uppercase tracking-widest text-xs mb-1">Upload Screenshot</p>
                <p className="text-[10px] text-neutral-400 font-bold">PDF, JPG or PNG (MAX 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-[2rem] overflow-hidden border-2 border-neutral-100 shadow-lg">
              <img src={screenshot} alt="Proof" className="w-full h-48 object-cover" />
              <button
                onClick={() => setScreenshot(null)}
                className="absolute top-4 right-4 h-10 w-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-all"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Card>

        <Button
          onClick={handleSubmitPayment}
          disabled={processing || isUploading || !selectedMethod || !screenshot}
          className="w-full h-18 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] shadow-2xl shadow-indigo-600/20 font-black text-xl uppercase tracking-widest transition-all active:scale-95 disabled:bg-neutral-200 disabled:shadow-none"
        >
          {processing ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              Verifying...
            </div>
          ) : "Submit Payment"}
        </Button>

        <p className="text-center text-[10px] text-neutral-400 font-black uppercase tracking-widest flex items-center justify-center gap-2">
          <Shield className="h-3 w-3" /> Secure Crypto-Layer Encryption
        </p>
      </div>
    </div>
  )
}

function XCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>}>
      <PaymentContent />
    </Suspense>
  )
}
