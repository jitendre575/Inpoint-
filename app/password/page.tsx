"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"
import { Lock, ArrowLeft, ShieldCheck, Key, ChevronRight, Fingerprint, Zap } from "lucide-react"

export default function PasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({ title: "Verification Failed", description: "New protocols do not match.", variant: "destructive" })
      return
    }

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      toast({ title: "Protocol Updated", description: "Encryption keys modified successfully." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      router.push("/mine")
    } catch (error: any) {
      toast({ title: "Access Denied", description: error.message, variant: "destructive" })
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0B1020] pb-32 font-sans selection:bg-purple-500/30">
      {/* Refined Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-5 pt-12 pb-16 relative overflow-hidden rounded-b-2xl shadow-xl border-b border-white/5">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-95 transition-all shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 text-[#00F0FF]" />
            </button>
            <div>
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest leading-none mb-1.5">Security Node</p>
              <h1 className="text-xl font-bold tracking-tight uppercase text-white leading-none">Credential Core</h1>
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
            <Fingerprint className="h-5 w-5 text-[#5B2EFF]" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 font-sans">
        <Card className="p-6 bg-[#121A33]/80 glass-card border-white/5 shadow-xl rounded-2xl relative overflow-hidden group border-0">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-[#5B2EFF]/10 flex items-center justify-center border border-white/5 shadow-lg group-hover:rotate-3 transition-transform">
              <ShieldCheck className="h-6 w-6 text-[#00F0FF]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight uppercase leading-none mb-1">Firewall Update</h2>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Protocol: PURPLE-RSA</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current" className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Access Node</Label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#5B2EFF] transition-colors h-4 w-4" />
                <Input
                  id="current"
                  type="password"
                  placeholder="Existing key"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-12 pl-12 rounded-xl border-white/5 bg-black/20 focus:bg-black/30 focus:ring-1 focus:ring-[#5B2EFF]/20 font-bold text-xs transition-all text-white placeholder:text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new" className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Identity Key</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#5B2EFF] transition-colors h-4 w-4" />
                <Input
                  id="new"
                  type="password"
                  placeholder="New secure protocol"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 pl-12 rounded-xl border-white/5 bg-black/20 focus:bg-black/30 focus:ring-1 focus:ring-[#5B2EFF]/20 font-bold text-xs transition-all text-white placeholder:text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">Verify Identity Key</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#5B2EFF] transition-colors h-4 w-4" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm new protocol"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 pl-12 rounded-xl border-white/5 bg-black/20 focus:bg-black/30 focus:ring-1 focus:ring-[#5B2EFF]/20 font-bold text-xs transition-all text-white placeholder:text-slate-800"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 premium-gradient text-white border-0 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4"
            >
              Update Security Protocol
            </Button>
          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-8 p-5 bg-[#0F1C3F]/40 border border-white/5 rounded-2xl flex gap-4">
          <div className="h-10 w-10 bg-black/20 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-lg">
            <Zap className="h-5 w-5 text-[#5B2EFF] animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-[#00F0FF] uppercase tracking-widest mb-1">Encrypted Node</p>
            <p className="text-slate-500 text-[8px] font-bold leading-relaxed uppercase tracking-widest">Changes apply immediately across the global registry for maximum security.</p>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
