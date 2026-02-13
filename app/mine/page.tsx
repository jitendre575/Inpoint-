"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Share2, Copy, LogOut, Shield, Settings, Gift, Headphones, Landmark, History, Wallet, Camera, User as UserIcon, Phone, Mail, TrendingUp, ChevronRight, Bell, Zap, MessageCircle, LandmarkIcon, LayoutGrid, ShieldCheck } from "lucide-react"
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
      router.push("/")
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
        router.push("/")
      }
    }

    refresh()
    const poll = setInterval(refresh, 10000)
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

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${user.referralCode || user.id}` : ''

  const handleCopyCode = (text: string, title: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: `${title} copied!` })
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#0B1020] pb-32 font-sans selection:bg-purple-500/30">
      {/* 1. Purple Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] px-5 pt-12 pb-32 rounded-b-[4rem] relative overflow-hidden shadow-3xl border-b border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B2EFF]/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center mt-4">
          <div className="relative group">
            <div className="h-28 w-28 rounded-[2.5rem] bg-[#5B2EFF]/20 flex items-center justify-center p-1.5 shadow-3xl relative overflow-hidden transform transition-all duration-700 hover:rotate-6 purple-glow border border-white/10">
              <div className="h-full w-full rounded-[2.2rem] overflow-hidden bg-black/40 flex items-center justify-center backdrop-blur-md">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-white text-4xl font-black uppercase">{user.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 h-9 w-9 bg-[#5B2EFF] rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all border border-white/20 z-20 purple-glow"
              >
                <Camera className="h-4.5 w-4.5 text-white" />
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h1 className="text-2xl font-black text-white mt-6 mb-3 tracking-tighter uppercase leading-none">{user.name}</h1>

          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md">
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[3px] leading-none">ID: {user.id?.slice(0, 8).toUpperCase()}</span>
              <button onClick={() => handleCopyCode(user.id, "User ID")} className="text-[#00F0FF] hover:scale-110 transition-transform border-0 bg-transparent">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-[#5B2EFF] font-black text-[10px] uppercase tracking-[4px] bg-[#5B2EFF]/10 px-4 py-2 rounded-xl border border-[#5B2EFF]/20 purple-glow">Elite Node</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 space-y-6 relative z-20 font-sans">
        {/* 2. Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-[#121A33]/80 glass-card border-white/5 shadow-3xl rounded-[3rem] flex flex-col justify-between h-44 transition-all active:scale-95 group overflow-hidden border-0">
            <div className="h-12 w-12 bg-[#5B2EFF]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all border border-[#5B2EFF]/20 purple-glow">
              <Wallet className="h-6 w-6 text-[#5B2EFF] transition-all" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[4px] mb-2 leading-none">Vault Balance</p>
              <h2 className="text-3xl font-black text-white tracking-tighter leading-none">₹{user.wallet?.toLocaleString()}</h2>
            </div>
          </Card>
          <Card className="p-6 bg-[#121A33]/80 glass-card border-white/5 shadow-3xl rounded-[3rem] flex flex-col justify-between h-44 transition-all active:scale-95 group overflow-hidden border-0">
            <div className="h-12 w-12 bg-[#00F0FF]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all border border-[#00F0FF]/20 shadow-xl">
              <TrendingUp className="h-6 w-6 text-[#00F0FF] transition-all" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[4px] mb-2 leading-none">Active Nodes</p>
              <h2 className="text-3xl font-black text-white tracking-tighter leading-none">{user.plans?.length || 0}</h2>
            </div>
          </Card>
        </div>

        {/* 3. Purple Referral Hub */}
        <Card className="p-8 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] border-white/5 shadow-3xl rounded-[3.5rem] relative overflow-hidden group border-0 text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#5B2EFF]/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <Badge className="bg-[#5B2EFF] text-white border-0 mb-3 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[3px] purple-glow">Affiliate Program</Badge>
                <p className="text-[#00F0FF] text-[11px] font-black uppercase tracking-[4px] leading-none">Earn 10% Recurring Yield</p>
              </div>
              <button className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all border-0 shadow-inner group">
                <Share2 className="h-6 w-6 text-white group-hover:text-[#5B2EFF] transition-colors" />
              </button>
            </div>

            <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[5px] mb-4 text-center">Referral Node Link</p>
              <div className="flex items-center justify-between gap-3 bg-black/40 p-2.5 rounded-2xl border border-white/5 overflow-hidden shadow-inner">
                <p className="text-[11px] font-black text-[#5B2EFF] truncate flex-1 px-3 tracking-widest">{referralLink}</p>
                <button
                  onClick={() => handleCopyCode(referralLink, "Invite Link")}
                  className="bg-[#5B2EFF] text-white h-11 w-11 rounded-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all border-0 shadow-2xl purple-glow"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* 4. List Operations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[5px]">Maintenance Hub</p>
            <ShieldCheck className="h-5 w-5 text-[#5B2EFF]" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Settlements', sub: 'Payout Configuration', icon: LandmarkIcon, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10', path: '/withdraw', dot: true },
              { label: 'Support Node', sub: 'Encrypted Ticket Desk', icon: Headphones, color: 'text-white', bg: 'bg-white/5', path: '/support' },
              { label: 'Activity Reg', sub: 'Portfolio Audit Log', icon: History, color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10', path: '/dashboard' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center justify-between p-6 bg-[#0F1C3F]/40 glass-card border-white/5 rounded-[2.5rem] shadow-xl hover:shadow-[#5B2EFF]/10 active:scale-[0.98] transition-all border-0 text-white"
              >
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 ${item.bg} rounded-2xl flex items-center justify-center shadow-xl border border-white/5 purple-glow`}>
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <div className="text-left">
                    <span className="font-black text-white text-[15px] block tracking-tight uppercase leading-none mb-1.5">{item.label}</span>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block leading-none">{item.sub}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {item.dot && <div className="h-2 w-2 bg-[#5B2EFF] rounded-full animate-pulse shadow-[0_0_10px_rgba(91,46,255,0.8)]" />}
                  <ChevronRight className="h-5 w-5 text-slate-700" />
                </div>
              </button>
            ))}

            <Button
              onClick={handleLogout}
              className="w-full h-15 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-[2rem] border border-red-500/20 font-black text-[11px] uppercase tracking-[4px] active:scale-95 transition-all mt-10 shadow-none"
            >
              <LogOut className="h-4.5 w-4.5 mr-3" />
              Terminate Secure Session
            </Button>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
