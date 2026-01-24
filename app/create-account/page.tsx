"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react"
import Link from "next/link"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    promoCode: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.replace("/dashboard")
    }
  }, [router])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (formData.fullName.length < 2) newErrors.fullName = "Name is too short"
    if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Enter a valid 10-digit number"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const ref = searchParams.get("ref")

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.mobileNumber,
          password: formData.password,
          referralCode: ref,
          promoCode: formData.promoCode
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      toast({ title: "Account Created!", description: "Your account has been set up successfully." })
      router.push("/login")
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -ml-20 -mb-20" />

      <div className="w-full max-w-sm relative z-10 py-8">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-green-100 rounded-2xl shadow-sm mb-4">
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Join <span className="text-green-600">Green Grow</span></h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Start your wealth journey today</p>
        </div>

        {/* Feature Image */}
        <div className="mb-8 relative flex justify-center px-4">
          <div className="relative p-1 bg-white rounded-3xl shadow-lg border border-green-50 group overflow-hidden">
            <img
              src="/landing-hero.png"
              alt="Trading Terminal"
              className="w-full h-auto object-contain rounded-2xl transform transition-transform group-hover:scale-105 duration-700"
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-[0_20px_50px_rgba(34,197,94,0.06)] border border-green-50 p-6 rounded-[2rem] relative overflow-hidden">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-green-500 transition-colors" />
                <Input
                  name="fullName"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`h-11 pl-11 rounded-xl border-green-50 bg-green-50/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-semibold text-sm ${errors.fullName ? 'border-red-400' : 'group-hover:border-green-200'}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-green-500 transition-colors" />
                <Input
                  name="mobileNumber"
                  placeholder="10-digit number"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`h-11 pl-11 rounded-xl border-green-50 bg-green-50/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-semibold text-sm ${errors.mobileNumber ? 'border-red-400' : 'group-hover:border-green-200'}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-green-500 transition-colors" />
                <Input
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-11 pl-11 rounded-xl border-green-50 bg-green-50/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-semibold text-sm ${errors.email ? 'border-red-400' : 'group-hover:border-green-200'}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-green-500 transition-colors" />
                <Input
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-11 pl-11 pr-11 rounded-xl border-green-50 bg-green-50/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-semibold text-sm ${errors.password ? 'border-red-400' : 'group-hover:border-green-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-green-500 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-green-600 uppercase tracking-widest ml-1">Promo Code (Optional)</Label>
              <div className="relative group">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 opacity-50 transition-opacity" />
                <Input
                  name="promoCode"
                  placeholder="e.g. GREEN2026"
                  value={formData.promoCode}
                  onChange={handleChange}
                  className="h-11 pl-11 rounded-xl border-green-100 bg-green-50/40 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-semibold text-sm group-hover:border-green-200"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 premium-gradient text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-70 mt-4 text-sm uppercase tracking-widest border-0"
            >
              {loading ? "Joining..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Already a member?
              <Link href="/login" className="text-green-600 hover:underline ml-1 font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[8px] font-bold text-slate-900 uppercase tracking-widest">SSL Secure</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-bold text-slate-900 uppercase tracking-widest">E2E Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}
