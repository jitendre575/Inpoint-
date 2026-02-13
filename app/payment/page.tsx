"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Clock, Upload, CheckCircle2, AlertCircle, ArrowLeft, Loader2, IndianRupee, QrCode, Building2, Shield } from "lucide-react"

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
  const [countdownStarted, setCountdownStarted] = useState(false)
  const [depositId, setDepositId] = useState<string | null>(null)
  const [utr, setUtr] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const amountParam = searchParams.get("amount")
    if (amountParam) {
      setAmount(amountParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (step === "SELECT" || countdownStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (countdownStarted) handleAutoSuccess();
            return 0;
          }
          return prev - 1;
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, router, toast, step, countdownStarted])

  const handleAutoSuccess = async () => {
    setCurrentDepositStatus("Approved");
    setStep("CONFIRM");
    toast({ title: "Payment Successful!", description: `₹${amount} has been added to your wallet.` });

    // Update status in DB
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      if (!currentUser.id || !depositId) return;

      await fetch('/api/user/deposit/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, depositId, status: 'Approved' })
      });
    } catch (err) {
      console.error("Auto-success DB update failed", err);
    }
  }

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

    if (!utr) {
      toast({ title: "UTR Number is mandatory", variant: "destructive" })
      return
    }

    if (utr.length < 12) {
      toast({ title: "Invalid UTR", description: "UTR must be at least 12 digits.", variant: "destructive" })
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
          screenshot: screenshot,
          utr: utr
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Deposit failed');

      setDepositId(data.deposit.id);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setCountdownStarted(true);
      setTimeLeft(90); // 1.5 minutes countdown after upload/submission
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
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-8 text-center font-sans uppercase">
        <div className={`h-32 w-32 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-3xl transition-all duration-700 border-0 ${currentDepositStatus === 'Approved' ? 'bg-[#10B981] scale-110 shadow-emerald-900/40 purple-glow' : 'bg-white/5 border border-white/10 shadow-neutral-200 animate-pulse'}`}>
          {currentDepositStatus === 'Approved' ? (
            <CheckCircle2 className="h-16 w-16 text-white" />
          ) : currentDepositStatus === 'Rejected' ? (
            <AlertCircle className="h-16 w-16 text-[#EF4444]" />
          ) : (
            <Loader2 className="h-16 w-16 text-[#5B2EFF] animate-spin" />
          )}
        </div>

        <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter leading-none">
          {currentDepositStatus === 'Approved' ? 'Deposit Approved!' :
            currentDepositStatus === 'Rejected' ? 'Submission Rejected' : 'Payment Submitted!'}
        </h2>

        <div className="max-w-xs mx-auto mb-10">
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[4px] leading-loose">
            {currentDepositStatus === 'Approved' ?
              `₹${amount} has been successfully added to your wallet.` :
              currentDepositStatus === 'Rejected' ?
                'Your payment proof was not accepted. Contact support for help.' :
                `Your payment of ₹${amount} is being processed by our team.`}
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-sm">
          <div className={`flex items-center justify-center gap-3 font-black uppercase tracking-[5px] text-[10px] px-8 py-5 rounded-2xl shadow-3xl border ${currentDepositStatus === 'Approved' ? 'bg-emerald-500/10 text-[#10B981] border-emerald-500/20' :
            currentDepositStatus === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
              'bg-[#5B2EFF]/10 text-[#00F0FF] border-[#5B2EFF]/20 shadow-xl purple-glow'
            }`}>
            {currentDepositStatus !== 'Approved' && currentDepositStatus !== 'Rejected' && <Loader2 className="h-4 w-4 animate-spin" />}
            Status: {currentDepositStatus}
          </div>

          <Button
            onClick={() => router.push("/dashboard")}
            className="h-16 premium-gradient text-white rounded-[2rem] font-black text-xs uppercase tracking-[4px] shadow-3xl shadow-purple-900/40 active:scale-95 transition-all border-0 purple-glow"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020] pb-32 font-sans uppercase">
      {/* 1. Purple Header with Timer */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white p-8 rounded-b-[4rem] shadow-3xl sticky top-0 z-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B2EFF]/10 rounded-full -mr-20 -mt-20 blur-[100px]" />
        <div className="flex items-center justify-between mb-10 relative z-10">
          <button onClick={() => router.back()} className="h-11 w-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 active:scale-95 transition-all">
            <ArrowLeft className="h-6 w-6 text-slate-500" />
          </button>
          <div className="flex items-center gap-3 bg-[#EF4444]/20 px-5 py-2.5 rounded-2xl border border-[#EF4444]/30 shadow-3xl shadow-red-900/20 animate-pulse">
            <Clock className="h-4 w-4 text-[#EF4444]" />
            <span className="font-black text-xl tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="text-center pb-10 relative z-10 font-sans">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[5px] mb-3">Order Amount</p>
          <h1 className="text-6xl font-black tracking-tighter">₹{amount}</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 -mt-8 relative z-10">
        {/* 2. Amount Display Card */}
        <Card className="p-10 bg-gradient-to-br from-[#5B2EFF] to-[#3B82F6] text-white border-0 shadow-3xl rounded-[3.5rem] overflow-hidden relative border-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-[10px] font-black uppercase tracking-[5px] text-white/60 mb-3">Payable Amount</p>
            <h2 className="text-5xl font-black tracking-tighter">₹{amount}</h2>
          </div>
        </Card>

        {countdownStarted && (
          <Card className="p-8 bg-[#F59E0B] text-white border-0 shadow-3xl rounded-[3rem] animate-pulse">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                <Clock className="h-8 w-8" />
              </div>
              <div className="font-sans">
                <p className="text-[10px] font-black uppercase tracking-[4px] text-amber-100 mb-1">Verifying Payment</p>
                <p className="text-2xl font-black uppercase leading-none tracking-tighter">Instant Success {formatTime(timeLeft)}</p>
              </div>
            </div>
          </Card>
        )}

        {/* 3. Selection Logic Card */}
        <Card className="p-10 shadow-3xl border-0 bg-[#0F1C3F]/40 glass-card rounded-[3.5rem] border-0">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[5px] mb-8 pl-4">Payment Option</h3>

          <div className="grid grid-cols-1 gap-5">
            {[
              { id: 'upi', label: 'UPI NODE', icon: IndianRupee, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10' },
              { id: 'qr', label: 'SCANNER NODE', icon: QrCode, color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] ${selectedMethod === method.id
                  ? 'border-[#5B2EFF] bg-[#5B2EFF]/5 ring-8 ring-[#5B2EFF]/5'
                  : 'border-white/5 bg-black/20 hover:bg-black/40'
                  }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 ${method.bg} rounded-2xl flex items-center justify-center shadow-xl purple-glow`}>
                    <method.icon className={`h-7 w-7 ${method.color}`} />
                  </div>
                  <span className="font-black text-white text-base uppercase tracking-tight leading-none">{method.label}</span>
                </div>
                <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'border-[#5B2EFF] bg-[#5B2EFF]' : 'border-slate-800'
                  }`}>
                  {selectedMethod === method.id && <div className="h-2.5 w-2.5 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          {selectedMethod === 'qr' && (
            <div className="mt-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <div className="relative p-3 bg-white rounded-[2.5rem] shadow-3xl border-8 border-white/5 overflow-hidden purple-glow">
                <img
                  src="/scanner-qr.png"
                  alt="Payment QR"
                  className="w-64 h-64 object-cover rounded-[2rem]"
                />
              </div>
              <p className="mt-8 text-[10px] text-slate-500 font-black uppercase tracking-[5px] text-center px-6 leading-loose">
                Scan this QR code using any UPI app to pay ₹{amount}
              </p>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div className="mt-10 p-8 bg-black/20 rounded-[3rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-[10px] text-[#5B2EFF] font-black uppercase tracking-[5px] mb-4 text-center">UPI ID (Copy & Pay)</p>
              <div className="flex items-center justify-between bg-[#0B1020] p-5 rounded-[2rem] shadow-3xl border border-white/5 overflow-hidden">
                <span className="font-black text-white px-2 tracking-widest text-sm">jitender567@fam</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("jitender567@fam");
                    toast({ title: "UPI ID Copied!" });
                  }}
                  className="h-12 w-12 bg-[#5B2EFF] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all border-0 shadow-xl purple-glow"
                >
                  <QrCode className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 space-y-4">
            <Label htmlFor="utr" className="text-[10px] font-black uppercase tracking-[5px] text-slate-500 ml-6">UTR/Ref Number (Mandatory)</Label>
            <Input
              id="utr"
              placeholder="12 Digit Transaction ID"
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={12}
              className="h-16 rounded-[2rem] border-2 border-white/5 bg-black/20 focus:border-[#5B2EFF]/30 focus:bg-black/40 focus:ring-8 focus:ring-[#5B2EFF]/5 font-black text-xl px-8 tracking-[0.2em] text-white transition-all placeholder:text-slate-800"
            />
          </div>
        </Card>

        {/* 4. Upload Proof Card */}
        <Card className="p-10 shadow-3xl border-0 bg-[#0F1C3F]/40 glass-card rounded-[3.5rem] border-0">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[5px] mb-8 pl-4">Verification Proof</h3>

          {!screenshot ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-[#5B2EFF]/40 hover:bg-[#5B2EFF]/5 transition-all group active:scale-95"
            >
              <div className="h-18 w-18 bg-white/5 rounded-[1.5rem] flex items-center justify-center group-hover:bg-[#5B2EFF]/10 transition-all shadow-2xl purple-glow border border-white/5">
                <Upload className="h-9 w-9 text-slate-500 group-hover:text-[#5B2EFF] transition-colors" />
              </div>
              <div className="text-center font-sans">
                <p className="font-black text-white uppercase tracking-[4px] text-xs mb-2">Upload Screenshot</p>
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">JPG or PNG (MAX 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-3xl group">
              <img src={screenshot} alt="Proof" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
              <button
                onClick={() => setScreenshot(null)}
                className="absolute top-6 right-6 h-12 w-12 bg-black/60 backdrop-blur-xl text-white rounded-2xl flex items-center justify-center hover:bg-[#EF4444] transition-all border border-white/10 active:scale-90"
              >
                <XCircle className="h-7 w-7" />
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
          disabled={processing || isUploading || !selectedMethod || !screenshot || !utr}
          className="w-full h-20 premium-gradient text-white rounded-[2.5rem] shadow-3xl shadow-purple-900/40 font-black text-lg uppercase tracking-[8px] transition-all active:scale-95 disabled:bg-white/5 disabled:text-slate-700 disabled:shadow-none border-0 purple-glow"
        >
          {processing ? (
            <div className="flex items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              SYNCING...
            </div>
          ) : "Submit Link"}
        </Button>

        <p className="text-center text-[10px] text-slate-600 font-black uppercase tracking-[8px] flex items-center justify-center gap-3 pt-6 pb-12">
          <Shield className="h-4 w-4 text-[#10B981]" /> Secure Node Layer
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
    <Suspense fallback={<div className="min-h-screen bg-[#0B1020] flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-[#5B2EFF]" /></div>}>
      <PaymentContent />
    </Suspense>
  )
}
