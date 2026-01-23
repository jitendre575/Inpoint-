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
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      if (data.bonusMessage) {
        toast({
          title: "Congratulations!",
          description: data.bonusMessage,
          className: "bg-theme-gold border-theme-gold/20 text-theme-indigo shadow-xl"
        })
      } else {
        toast({
          title: "Welcome Back",
          description: "Successfully logged into your account.",
          className: "bg-theme-lavender border-theme-purple/10 text-theme-purple"
        })
      }

      router.push("/dashboard")
    } catch (error: any) {
      toast({ title: "Login Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#0F071F] font-sans selection:bg-theme-violet selection:text-white overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-purple/20 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-theme-violet/10 rounded-full blur-[120px] -ml-40 -mb-20 animate-pulse" />
      </div>

      <div className={`relative w-full max-w-[440px] z-10 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-[2.2rem] shadow-2xl flex items-center justify-center mb-6 border border-white/10 group hover:rotate-12 transition-transform duration-500">
            <div className="w-12 h-12 bg-gradient-to-tr from-theme-purple to-theme-violet rounded-2xl flex items-center justify-center p-2.5 shadow-inner">
              <Fingerprint className="text-white w-full h-full" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighterLEADING-NONE">Inpoint<span className="text-theme-violet italic">Rose</span></h1>
          <p className="text-theme-lavender/40 font-black text-[10px] uppercase tracking-[0.3em] mt-2">Institutional Trading Link</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_32px_80px_rgba(109,40,217,0.15)] border border-theme-lavender p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-theme-lavender/50 rounded-full blur-3xl -tr-10 -rt-10" />

          <div className="relative">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-[#2D1A4A] tracking-tighter italic">Welcome Back</h2>
              <p className="text-theme-purple/40 font-bold text-xs uppercase tracking-widest mt-2">Enter your secure credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-theme-purple/50 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
                  Identity (Email/UID)
                </Label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 pl-14 pr-4 bg-[#FDFCFF] border-theme-lavender rounded-2xl focus:ring-8 focus:ring-theme-purple/5 border-2 transition-all font-bold text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <Label htmlFor="password" className="text-theme-purple/50 font-black text-[10px] uppercase tracking-[0.2em]">
                    Access Key
                  </Label>
                  <button type="button" className="text-[10px] font-black text-theme-violet hover:text-theme-purple uppercase tracking-widest transition-all">
                    Reset
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-16 pl-14 pr-4 bg-[#FDFCFF] border-theme-lavender rounded-2xl focus:ring-8 focus:ring-theme-purple/5 border-2 transition-all font-bold text-lg"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white border-0 font-black rounded-[1.5rem] shadow-2xl shadow-theme-purple/20 transition-all duration-300 group overflow-hidden active:scale-95 text-lg"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <>
                      Confirm Access
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-theme-violet to-theme-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-theme-purple/40 text-[11px] font-black uppercase tracking-widest">
                New to the network?{' '}
                <button
                  onClick={() => router.push("/create-account")}
                  className="text-theme-violet font-black hover:text-theme-purple transition-all underline-offset-4 hover:underline"
                >
                  Join Today
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-10 flex items-center justify-center gap-6 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-theme-gold animate-pulse" /> AES-256
          </div>
          <div className="w-1 h-1 bg-white/10 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Fingerprint className="h-3 w-3 text-theme-violet" /> SSL Protected
          </div>
        </div>
      </div>
    </div>
  )
}
