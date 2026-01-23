"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Share2, Copy, LogOut, Shield, Settings, Gift, Headphones, Landmark, History, Wallet, Camera, User as UserIcon, Phone, Mail, TrendingUp, ChevronRight, Bell, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function MinePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const dbUser = JSON.parse(currentUser)
    setUser(dbUser)

    const refresh = () => {
      if (dbUser.id) {
        fetch('/api/user/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: dbUser.id })
        })
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              setUser(data.user)
              localStorage.setItem("currentUser", JSON.stringify(data.user))
            }
          })
          .catch(err => console.error("Failed to refresh user data", err))
      } else {
        localStorage.removeItem("currentUser")
        router.push("/login")
      }
    }

    refresh()
    const poll = setInterval(refresh, 5000)
    return () => clearInterval(poll)
  }, [router])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        try {
          const res = await fetch('/api/user/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, profilePhoto: base64String })
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user)
            localStorage.setItem("currentUser", JSON.stringify(data.user))
            toast({ title: "Profile photo updated!" })
          } else {
            throw new Error(data.message)
          }
        } catch (err: any) {
          toast({ title: "Upload failed", description: err.message, variant: "destructive" })
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) return null

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/create-account?ref=${user.referralCode || user.id}` : ''

  const handleCopyCode = (text: string, title: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: `${title} copied!` })
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#FDFCFF] pb-32 selection:bg-theme-lavender selection:text-theme-purple">
      {/* Premium Luxury Header */}
      <div className="bg-[#1A0B2E] px-6 pt-16 pb-32 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-theme-purple/20 rounded-full -mr-20 -mt-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-theme-gold/5 rounded-full -ml-32 -mb-32 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative group">
            <div className="h-36 w-36 rounded-[3.5rem] bg-white p-1.5 shadow-2xl transform transition-transform group-hover:rotate-3 duration-500 relative">
              <div className="h-full w-full rounded-[3rem] overflow-hidden bg-[#F8F7FF] flex items-center justify-center border-2 border-theme-lavender shadow-inner">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-theme-purple to-theme-violet flex items-center justify-center text-white text-5xl font-black">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-1 right-1 h-12 w-12 bg-white shadow-2xl rounded-2xl flex items-center justify-center hover:bg-theme-lavender active:scale-90 transition-all border-4 border-theme-lavender"
            >
              {isUploading ? <div className="h-5 w-5 border-2 border-theme-purple border-t-transparent animate-spin rounded-full" /> : <Camera className="h-6 w-6 text-theme-purple" />}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h1 className="text-3xl font-black text-white mt-8 mb-2 tracking-tighter italic">{user.name}</h1>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-xl">
              <span className="text-theme-lavender/60 text-[10px] font-black uppercase tracking-[0.2em]">ID: {user.id?.slice(0, 10).toUpperCase()}</span>
              <button onClick={() => handleCopyCode(user.id, "User ID")} className="text-white/20 hover:text-theme-gold transition-colors">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            {user.isBlocked ? (
              <Badge className="bg-rose-500 text-white border-0 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Blocked</Badge>
            ) : (
              <Badge className="bg-theme-gold text-[#2D1A4A] border-0 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Elite Member</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 space-y-8 relative z-20">
        {/* Wallet & Stats Overview */}
        <div className="grid grid-cols-2 gap-5">
          <Card className="p-8 bg-white/95 backdrop-blur-2xl border border-theme-lavender shadow-xl shadow-theme-purple/5 rounded-[3rem] flex flex-col justify-between h-48 group">
            <div className="bg-theme-lavender h-14 w-14 rounded-[1.8rem] flex items-center justify-center mb-4 transition-transform group-hover:rotate-12">
              <Wallet className="h-7 w-7 text-theme-purple" />
            </div>
            <div>
              <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Asset Value</p>
              <h2 className="text-3xl font-black text-[#2D1A4A] tracking-tighter italic">₹{user.wallet?.toLocaleString()}</h2>
            </div>
          </Card>
          <Card className="p-8 bg-white/95 backdrop-blur-2xl border border-theme-lavender shadow-xl shadow-theme-purple/5 rounded-[3rem] flex flex-col justify-between h-48 group">
            <div className="bg-theme-gold/10 h-14 w-14 rounded-[1.8rem] flex items-center justify-center mb-4 transition-transform group-hover:rotate-12">
              <TrendingUp className="h-7 w-7 text-theme-gold" />
            </div>
            <div>
              <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Yielding Node</p>
              <h2 className="text-3xl font-black text-[#2D1A4A] tracking-tighter italic">{user.plans?.length || 0}</h2>
            </div>
          </Card>
        </div>

        {/* Dynamic Referral Invite Card */}
        <Card className="p-10 bg-gradient-to-br from-[#1A0B2E] to-[#2D1A4A] text-white border-0 shadow-3xl shadow-theme-purple/30 rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-56 h-56 bg-theme-purple/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-110 transition-all duration-1000" />
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-theme-gold text-[#1A0B2E] border-0 mb-3 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase">Passive Scaling</Badge>
                <h3 className="text-3xl font-black tracking-tighter leading-none italic mb-1">Network Hub</h3>
                <p className="text-theme-lavender/40 text-[10px] font-black uppercase tracking-widest">Earn 20% commission on referrals</p>
              </div>
              <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-3xl border border-white/10 shadow-inner">
                <Share2 className="h-6 w-6 text-theme-gold" />
              </div>
            </div>

            <div className="bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
              <p className="text-[9px] text-theme-lavender/40 font-black uppercase tracking-[0.3em] mb-4 text-center">Your Protocol Link</p>
              <div className="flex items-center justify-between gap-5 bg-black/20 p-2 rounded-2xl border border-white/5 overflow-hidden">
                <p className="text-[10px] font-mono font-bold truncate opacity-50 flex-1 px-4">{referralLink}</p>
                <button
                  onClick={() => handleCopyCode(referralLink, "Link")}
                  className="bg-theme-gold text-[#1A0B2E] h-12 w-12 rounded-xl flex items-center justify-center hover:brightness-110 active:scale-90 transition-all shadow-lg shrink-0"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Security & Action Grid */}
        <div className="space-y-4">
          <p className="text-theme-purple/30 text-[10px] font-black uppercase tracking-[0.3em] pl-6">Governance & Security</p>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Settlement Node', sub: 'Bank & UPI Details', icon: Landmark, color: 'text-theme-purple', bg: 'bg-theme-lavender', path: '/withdraw' },
              { label: 'Support Desk', sub: '24/7 Priority Help', icon: Headphones, color: 'text-theme-violet', bg: 'bg-theme-lavender', path: '/support' },
              { label: 'Security Firewall', sub: 'Password & Encryption', icon: Shield, color: 'text-theme-gold', bg: 'bg-theme-gold/10', path: '/password' },
              { label: 'Asset Ledger', sub: 'Transaction History', icon: History, color: 'text-theme-purple', bg: 'bg-[#F8F7FF]', path: '/dashboard' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className="flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-theme-lavender shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all group group"
              >
                <div className="flex items-center gap-5">
                  <div className={`h-16 w-16 ${item.bg} rounded-[1.8rem] flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    <item.icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <div className="text-left">
                    <span className="font-black text-[#2D1A4A] text-lg italic block leading-none mb-1">{item.label}</span>
                    <span className="text-[10px] text-theme-purple/30 font-black uppercase tracking-widest">{item.sub}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full border border-theme-lavender flex items-center justify-center group-hover:bg-theme-lavender transition-colors">
                  <ChevronRight className="h-5 w-5 text-theme-purple/20" />
                </div>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 h-20 bg-rose-50/50 text-rose-500 rounded-[3rem] border-2 border-dashed border-rose-100 font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-50 active:scale-[0.98] transition-all mt-6 shadow-sm"
            >
              <LogOut className="h-5 w-5" />
              Disconnect Session
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
