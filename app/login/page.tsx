"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, ArrowRight, Loader2, Sparkles, User, Fingerprint } from "lucide-react"

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

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast({
        title: "Success",
        description: "Successfully logged into your account.",
        className: "bg-emerald-50 border-emerald-100 text-emerald-900"
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-600">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50/50 rounded-full blur-[120px] -ml-40 -mb-20 animate-pulse delay-700" />
      </div>

      <div className={`relative w-full max-w-[440px] z-10 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center mb-4 border border-indigo-50 group hover:rotate-12 transition-transform duration-500">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center p-2 shadow-inner">
              <Fingerprint className="text-white w-full h-full" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inpoint<span className="text-indigo-600">Rose</span></h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Institutional Grade Trading</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-slate-100 p-8 md:p-10 relative overflow-hidden">
          {/* Subtle Glow inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -tr-10 -rt-10" />

          <div className="relative">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
              <p className="text-slate-400 font-medium text-sm mt-1">Please enter your credentials to login.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-500 font-bold text-xs uppercase tracking-wider ml-1">
                  Email / Username
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="text"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 pr-4 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Password
                  </Label>
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 pr-4 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-300 group overflow-hidden"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      Secure Login
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 font-medium text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push("/create-account")}
                  className="text-indigo-600 font-black hover:text-indigo-800 transition-colors underline decoration-2 underline-offset-4"
                >
                  Create for free
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-amber-400" /> Secure Encryption
          </div>
          <div className="w-1 h-1 bg-slate-200 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Fingerprint className="h-3 w-3 text-indigo-400" /> Privacy First
          </div>
        </div>
      </div>
    </div>
  )
}
