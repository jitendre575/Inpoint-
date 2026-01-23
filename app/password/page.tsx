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
import { Lock, ArrowLeft, ShieldCheck, Key, ChevronRight, Fingerprint } from "lucide-react"

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
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" })
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

      toast({ title: "Updated!", description: "Access credentials modified successfully." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      router.push("/mine")
    } catch (error: any) {
      toast({ title: "Denied", description: error.message, variant: "destructive" })
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#FDFCFF] pb-32 font-sans selection:bg-theme-lavender selection:text-theme-purple">
      {/* Dynamic Header */}
      <div className="bg-[#1A0B2E] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-theme-purple/20 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
              <ArrowLeft className="h-6 w-6 text-theme-violet cursor-pointer" onClick={() => router.back()} />
            </div>
            <div>
              <p className="text-theme-lavender/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Security Node</p>
              <h1 className="text-2xl font-black tracking-tighter">Modify Credentials</h1>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <Fingerprint className="h-6 w-6 text-theme-gold" />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20">
        <Card className="p-10 bg-white border border-theme-purple/5 shadow-[0_16px_32px_rgba(109,40,217,0.04)] rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-theme-lavender/30 rounded-full -mr-12 -mt-12" />

          <div className="flex items-center gap-5 mb-10">
            <div className="h-16 w-16 rounded-[2rem] bg-theme-lavender flex items-center justify-center transition-transform group-hover:rotate-12">
              <ShieldCheck className="h-8 w-8 text-theme-purple" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#2D1A4A] tracking-tighter italic">Firewall Update</h2>
              <p className="text-[10px] text-theme-purple/30 font-black uppercase tracking-widest">Last changed: 30 days ago</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current" className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Current Access Key</Label>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors h-5 w-5" />
                <Input
                  id="current"
                  type="password"
                  placeholder="Existing password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-16 pl-14 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 text-lg font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new" className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">New Protocol Key</Label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors h-5 w-5" />
                <Input
                  id="new"
                  type="password"
                  placeholder="New secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-16 pl-14 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 text-lg font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[10px] font-black text-theme-purple/50 uppercase tracking-[0.2em] ml-2">Verify Protocol Key</Label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors h-5 w-5" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-16 pl-14 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 text-lg font-bold"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-18 bg-gradient-to-r from-[#1A0B2E] to-[#2D1A4A] text-white border-0 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all mt-6"
            >
              Update Protocol Key
            </Button>
          </form>
        </Card>

        <div className="mt-10 p-6 bg-theme-gold/5 border border-theme-gold/10 rounded-[2.5rem] flex gap-5">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-theme-gold/10">
            <Fingerprint className="h-6 w-6 text-theme-gold animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black text-theme-gold uppercase tracking-[0.2em] mb-1">Encrypted Node</p>
            <p className="text-theme-gold/60 text-[11px] font-bold leading-relaxed">Changes are applied immediately across all synced sessions for maximum security.</p>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
