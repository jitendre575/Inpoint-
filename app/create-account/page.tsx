"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Users } from "lucide-react"
import Link from "next/link"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [refCode, setRefCode] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.replace("/dashboard")
    }

    const ref = searchParams.get("ref")
    if (ref) {
      setRefCode(ref)
    }
  }, [router, searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, referralCode: refCode })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: "Account Created!",
        description: "You can now login with your credentials.",
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-700 to-rose-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(244,63,94,0.15),transparent_50%)]" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base">
              Start your investment journey today
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {refCode && (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none mb-1">Referred By</p>
                  <p className="text-white text-sm font-black font-mono">{refCode}</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="name" className="text-white/90 font-medium text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:bg-white/20 transition-all backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white/90 font-medium text-sm">
                Email / Mobile
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or mobile"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:bg-white/20 transition-all backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white/90 font-medium text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:bg-white/20 transition-all backdrop-blur-sm"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-rose-500 hover:from-emerald-600 hover:to-rose-600 text-white font-black text-base shadow-lg transition-all duration-300 border-0 rounded-2xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-emerald-900 flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>}>
      <RegisterContent />
    </Suspense>
  )
}
