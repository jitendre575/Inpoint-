"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

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

      // Store user to localStorage for session management (simple approach)
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })

      // Check for bonus in history to show toast
      const hasBonus = data.user.history.some((h: any) => h.type === 'bonus' && new Date(h.date).getTime() > Date.now() - 10000);
      // Only show if recent, but here we just rely on standard flow.
      if (hasBonus && data.user.wallet === 50) {
        toast({
          title: "Welcome Bonus! 🎁",
          description: "₹50 has been added to your wallet as a first-time login gift!",
        })
      }

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your investment account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email / Mobile
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or mobile"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-3">Don't have an account?</p>
            <Button
              onClick={() => router.push("/create-account")}
              variant="outline"
              className="w-full h-12 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-semibold text-base"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
