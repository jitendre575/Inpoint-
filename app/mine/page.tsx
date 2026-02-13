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
      {/* Refined Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] px-5 pt-12 pb-20 rounded-b-2xl relative overflow-hidden shadow-xl border-b border-white/5">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative group">
            <div className="h-20 w-20 rounded-xl bg-[#5B2EFF]/20 flex items-center justify-center p-1 shadow-lg relative overflow-hidden border border-white/10">
              <div className="h-full w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center backdrop-blur-md">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold uppercase">{user.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-7 w-7 bg-[#5B2EFF] rounded-lg flex items-center justify-center shadow-lg active:scale-90 transition-all border border-white/20 z-20"
              >
                <Camera className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h1 className="text-lg font-bold text-white mt-4 mb-2 tracking-tight uppercase leading-none">{user.name}</h1>

          <div className="flex items-center gap-2.5">
            <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-2 backdrop-blur-md">
              <span className="text-slate-500 text-[7px] font-semibold uppercase tracking-widest leading-none">ID: {user.id?.slice(0, 8).toUpperCase()}</span>
              <button onClick={() => handleCopyCode(user.id, "User ID")} className="text-[#00F0FF] hover:scale-110 transition-transform">
                <Copy className="h-2.5 w-2.5" />
              </button>
            </div>
            <span className="text-[#5B2EFF] font-bold text-[8px] uppercase tracking-widest bg-[#5B2EFF]/10 px-2.5 py-1 rounded-lg border border-[#5B2EFF]/20">Elite Node</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-5 relative z-20 font-sans">
        {/* 2. Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-[#121A33]/80 glass-card border-white/5 shadow-xl rounded-2xl flex flex-col justify-between h-32 transition-all active:scale-[0.98] group border-0">
            <div className="h-10 w-10 bg-[#5B2EFF]/10 rounded-xl flex items-center justify-center mb-4 transition-all border border-[#5B2EFF]/20 shadow-lg">
              <Wallet className="h-5 w-5 text-[#5B2EFF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-widest mb-1 leading-none">Vault Balance</p>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none">₹{user.wallet?.toLocaleString()}</h2>
            </div>
          </Card>
          <Card className="p-4 bg-[#121A33]/80 glass-card border-white/5 shadow-xl rounded-2xl flex flex-col justify-between h-32 transition-all active:scale-[0.98] group border-0">
            <div className="h-10 w-10 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center mb-4 transition-all border border-[#00F0FF]/20 shadow-lg">
              <TrendingUp className="h-5 w-5 text-[#00F0FF]" />
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-widest mb-1 leading-none">Active Nodes</p>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{user.plans?.length || 0}</h2>
            </div>
          </Card>
        </div>

        {/* 3. Purple Referral Hub */}
        {/* 3. Referral Hub */}
        <Card className="p-5 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] border-white/5 shadow-xl rounded-2xl relative overflow-hidden group border-0">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <Badge className="bg-[#5B2EFF] text-white border-0 mb-1.5 px-2.5 py-0.5 rounded-lg text-[7px] font-bold uppercase tracking-widest">Affiliate Program</Badge>
                <p className="text-[#00F0FF] text-[9px] font-bold uppercase tracking-widest leading-none">Earn 10% Recurring Yield</p>
              </div>
              <button className="h-9 w-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all shadow-inner group">
                <Share2 className="h-4 w-4 text-white transition-colors" />
              </button>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
              <p className="text-[7px] text-slate-500 font-semibold uppercase tracking-widest mb-2.5 text-center">Referral Node Link</p>
              <div className="flex items-center justify-between gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 overflow-hidden shadow-inner">
                <p className="text-[9px] font-semibold text-[#5B2EFF] truncate flex-1 px-1.5 tracking-widest uppercase">{referralLink}</p>
                <button
                  onClick={() => handleCopyCode(referralLink, "Invite Link")}
                  className="bg-[#5B2EFF] text-white h-8 w-8 rounded-lg flex items-center justify-center hover:scale-105 active:scale-90 transition-all border-0 shadow-lg"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* 4. List Operations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-widest">Maintenance Hub</p>
            <ShieldCheck className="h-3.5 w-3.5 text-[#5B2EFF]" />
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Settlements', sub: 'Payout Configuration', icon: LandmarkIcon, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10', path: '/withdraw', dot: true },
              { label: 'Support Node', sub: 'Encrypted Ticket Desk', icon: Headphones, color: 'text-white', bg: 'bg-white/5', path: '/support' },
              { label: 'Activity Reg', sub: 'Portfolio Audit Log', icon: History, color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10', path: '/dashboard' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center justify-between p-4 bg-[#0F1C3F]/40 glass-card border-white/5 rounded-xl shadow-lg hover:shadow-[#5B2EFF]/5 active:scale-[0.99] transition-all border-0 text-white"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 ${item.bg} rounded-xl flex items-center justify-center shadow-lg border border-white/5`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-white text-sm block tracking-tight uppercase leading-none mb-1">{item.label}</span>
                    <span className="text-[7px] text-slate-500 font-semibold uppercase tracking-widest block leading-none">{item.sub}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.dot && <div className="h-1.5 w-1.5 bg-[#5B2EFF] rounded-full shadow-[0_0_8px_rgba(91,46,255,0.6)]" />}
                  <ChevronRight className="h-4 w-4 text-slate-800" />
                </div>
              </button>
            ))}

            <Button
              onClick={handleLogout}
              className="w-full h-11 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-xl border border-red-500/20 font-bold text-[9px] uppercase tracking-widest active:scale-95 transition-all mt-4 border-0"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Terminate Session
            </Button>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
