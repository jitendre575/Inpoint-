"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff } from "lucide-react"
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
    // Clear error for this field
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
          referralCode: ref
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: "Account Created!",
        description: "Your account has been set up successfully.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background shape */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5842F4] rounded-2xl shadow-lg shadow-indigo-200 mb-4 animate-in fade-in zoom-in duration-500">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join InpointRose trading platform today</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#5842F4] transition-colors" />
                <Input
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 border-2 transition-all ${errors.fullName ? 'border-red-400 focus:ring-red-50' : 'group-hover:border-slate-300'}`}
                />
                {errors.fullName && <p className="text-[10px] text-red-500 font-medium mt-1 ml-1">{errors.fullName}</p>}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Mobile Number</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#5842F4] transition-colors" />
                <Input
                  name="mobileNumber"
                  placeholder="9876543210"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 border-2 transition-all ${errors.mobileNumber ? 'border-red-400 focus:ring-red-50' : 'group-hover:border-slate-300'}`}
                />
                {errors.mobileNumber && <p className="text-[10px] text-red-500 font-medium mt-1 ml-1">{errors.mobileNumber}</p>}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#5842F4] transition-colors" />
                <Input
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 border-2 transition-all ${errors.email ? 'border-red-400 focus:ring-red-50' : 'group-hover:border-slate-300'}`}
                />
                {errors.email && <p className="text-[10px] text-red-500 font-medium mt-1 ml-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#5842F4] transition-colors" />
                <Input
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-12 pl-12 pr-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 border-2 transition-all ${errors.password ? 'border-red-400 focus:ring-red-50' : 'group-hover:border-slate-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {errors.password && <p className="text-[10px] text-red-500 font-medium mt-1 ml-1">{errors.password}</p>}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#5842F4] transition-colors" />
                <Input
                  name="confirmPassword"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-50 border-2 transition-all ${errors.confirmPassword ? 'border-red-400 focus:ring-red-50' : 'group-hover:border-slate-300'}`}
                />
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-medium mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#5842F4] hover:bg-[#4731e0] text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?
              <Link href="/login" className="text-[#5842F4] hover:text-[#4731e0] ml-1 font-bold underline-offset-4 hover:underline transition-all">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Secure Server</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">256-bit AES</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#5842F4] border-t-transparent rounded-full" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
