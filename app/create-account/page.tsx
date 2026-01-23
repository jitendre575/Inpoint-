"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react"
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
    <div className="min-h-screen bg-[#0F071F] flex items-center justify-center p-4 overflow-hidden relative selection:bg-theme-violet selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-purple/20 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-theme-violet/10 rounded-full blur-[100px] -ml-20 -mb-20" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-theme-purple/20 to-theme-violet/20 backdrop-blur-xl rounded-[2rem] border-2 border-theme-violet/30 shadow-[0_0_30px_rgba(124,58,237,0.2)] mb-6 animate-in zoom-in duration-700">
            <User className="w-10 h-10 text-theme-violet" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Join the <span className="text-theme-violet italic">Elite</span></h1>
          <p className="text-theme-lavender/40 text-sm font-medium mt-2">Create your account and unlock daily payouts.</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-[3.5rem] shadow-[0_32px_80px_rgba(109,40,217,0.15)] border border-theme-lavender">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Display Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors" />
                <Input
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`h-14 pl-12 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 transition-all font-bold ${errors.fullName ? 'border-rose-400 focus:ring-rose-50' : 'group-hover:border-theme-purple/20'}`}
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Mobile Number</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors" />
                <Input
                  name="mobileNumber"
                  placeholder="10-digit number"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`h-14 pl-12 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 transition-all font-bold ${errors.mobileNumber ? 'border-rose-400 focus:ring-rose-50' : 'group-hover:border-theme-purple/20'}`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors" />
                <Input
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-14 pl-12 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 transition-all font-bold ${errors.email ? 'border-rose-400 focus:ring-rose-50' : 'group-hover:border-theme-purple/20'}`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Access Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors" />
                <Input
                  name="password"
                  placeholder="Secure password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-14 pl-12 pr-12 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 transition-all font-bold ${errors.password ? 'border-rose-400 focus:ring-rose-50' : 'group-hover:border-theme-purple/20'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-purple/30 hover:text-theme-purple transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Promo Code with Gold Highlight */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-theme-gold uppercase tracking-[0.2em] ml-2">Referrer Code (Optional)</Label>
              <div className="relative group">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-gold opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <Input
                  name="promoCode"
                  placeholder="e.g. JR007"
                  value={formData.promoCode}
                  onChange={handleChange}
                  className="h-14 pl-12 rounded-2xl border-theme-gold/20 bg-theme-gold/[0.02] focus:ring-8 focus:ring-theme-gold/5 border-2 transition-all font-bold group-hover:border-theme-gold/30"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white font-black rounded-[1.5rem] shadow-2xl shadow-theme-purple/20 transition-all border-0 active:scale-95 disabled:opacity-70 mt-4 text-lg"
            >
              {loading ? "Establishing Account..." : "Confirm & Join"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-theme-purple/40 text-[11px] font-black uppercase tracking-widest">
              Already verified?
              <Link href="/login" className="text-theme-violet hover:text-theme-purple ml-2 font-black transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-10 flex items-center justify-center gap-6 opacity-40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-theme-gold rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Secure Node</span>
          </div>
          <div className="w-1 h-1 bg-theme-violet rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F071F] flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-theme-violet border-t-transparent rounded-full" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}
