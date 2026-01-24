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
    <div className="min-h-screen bg-[#F8FAF8] pb-32 font-sans selection:bg-green-100">
      {/* 1. Deep Green Header */}
      <div className="bg-[#14532D] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-90 transition-all border-0 shadow-inner"
            >
              <ArrowLeft className="h-6 w-6 text-green-300" />
            </button>
            <div>
              <p className="text-green-300/40 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">Security Node</p>
              <h1 className="text-2xl font-bold tracking-tight uppercase not-italic">Credential Core</h1>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <Fingerprint className="h-6 w-6 text-green-300" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 font-sans">
        <Card className="p-8 bg-white border border-green-50 shadow-sm rounded-[3rem] relative overflow-hidden group border-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-full -mr-12 -mt-12" />

          <div className="flex items-center gap-5 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center transition-transform group-hover:rotate-6 shadow-inner">
              <ShieldCheck className="h-7 w-7 text-green-600" />
            </div>
            <div className="font-sans">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none mb-1.5">Firewall Update</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Protocol Version: RSA-4096</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2">Current Access Node</Label>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors h-4.5 w-4.5" />
                <Input
                  id="current"
                  type="password"
                  placeholder="Existing key"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-14 pl-14 rounded-xl border-green-50 bg-green-50/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-bold text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2">New Identity Key</Label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors h-4.5 w-4.5" />
                <Input
                  id="new"
                  type="password"
                  placeholder="New secure protocol"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-14 pl-14 rounded-xl border-green-50 bg-green-50/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-bold text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2">Verify Identity Key</Label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors h-4.5 w-4.5" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm new protocol"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-14 pl-14 rounded-xl border-green-50 bg-green-50/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-bold text-sm transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-15 premium-gradient text-white border-0 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-green-900/10 active:scale-95 transition-all mt-6"
            >
              Update Security Protocol
            </Button>
          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-green-50/50 border border-green-100 rounded-[2.5rem] flex gap-4">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-green-100 shadow-sm">
            <Zap className="h-6 w-6 text-green-500 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">Encrypted Node</p>
            <p className="text-slate-400 text-[10px] font-medium leading-relaxed uppercase tracking-widest">Changes apply immediately across the global registry for maximum security.</p>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
