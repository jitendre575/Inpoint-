"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, ArrowRight, Loader2, Sparkles, User, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.replace("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast({
        title: "Welcome Back",
        description: "Successfully logged into your account.",
        className: "bg-green-50 border-green-100 text-green-800"
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({ title: "Login Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#F8FAF8] font-sans selection:bg-green-100 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -ml-40 -mt-20" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -mr-20 -mb-20" />

      <div className={`relative w-full max-w-sm z-10 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white border border-green-100 rounded-2xl shadow-sm flex items-center justify-center mb-4">
            <ShieldCheck className="text-green-500 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Green <span className="text-green-600">Grow</span></h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Institutional Access</p>
        </div>

        {/* Feature Image */}
        <div className="mb-8 relative flex justify-center px-4">
          <div className="relative p-1 bg-white rounded-3xl shadow-lg border border-green-50 group overflow-hidden">
            <img
              src="/landing-hero.png"
              alt="Trading Terminal"
              className="w-full h-auto object-contain rounded-2xl transform transition-transform group-hover:scale-105 duration-700 hover:rotate-2"
            />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white shadow-[0_20px_50px_rgba(34,197,94,0.06)] border border-green-50 rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="relative">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Secure Sign In</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Identity Verification</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-400 font-bold text-[9px] uppercase tracking-widest ml-1">
                  Access Identifier (Email)
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-12 pr-4 bg-green-50/20 border-green-50 rounded-xl focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                    Security Key
                  </Label>
                  <button type="button" className="text-[9px] font-bold text-green-600 hover:text-green-700 uppercase tracking-widest">
                    Recovery
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-12 pr-4 bg-green-50/20 border-green-50 rounded-xl focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 premium-gradient text-white rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 text-sm font-bold uppercase tracking-widest border-0"
                disabled={loading}
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Auth Link Established
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </span>
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                New user?{' '}
                <Link
                  href="/create-account"
                  className="text-green-600 font-bold hover:underline"
                >
                  Apply for Membership
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-10 flex items-center justify-center gap-6 opacity-30 text-slate-900 text-[9px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-green-600" /> AES-256
          </div>
          <div className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-green-600" /> Root Secure
          </div>
        </div>
      </div>
    </div>
  )
}
