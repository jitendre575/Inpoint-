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
    <div className="min-h-screen bg-[#F0FDF4] pb-24 font-sans selection:bg-green-100">
      {/* 1. Deep Green Header */}
      <div className="bg-[#14532D] px-5 pt-8 pb-32 rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center mt-4">
          <div className="relative group">
            <div className="h-28 w-28 rounded-[2rem] bg-green-500 flex items-center justify-center p-1 shadow-2xl relative overflow-hidden transform transition-transform group-hover:scale-105 duration-500">
              <div className="h-full w-full rounded-[1.8rem] overflow-hidden bg-green-600 flex items-center justify-center">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-white text-4xl font-black">{user.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border-2 border-green-900 z-20"
              >
                <Camera className="h-4 w-4 text-green-900" />
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h1 className="text-xl font-bold text-white mt-5 mb-3 tracking-tight">{user.name}</h1>

          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
              <span className="text-green-300/40 text-[9px] font-bold uppercase tracking-widest leading-none">ID: {user.id?.slice(0, 8).toUpperCase()}</span>
              <button onClick={() => handleCopyCode(user.id, "User ID")} className="text-white/30 hover:text-white transition-colors border-0">
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <span className="text-green-400 font-bold text-[10px] uppercase tracking-widest bg-green-400/10 px-3 py-1.5 rounded-xl border border-green-400/20">Elite Node</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 space-y-6 relative z-20 font-sans">
        {/* 2. Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white border border-green-50 shadow-sm rounded-3xl flex flex-col justify-between h-40 transition-all active:scale-95 group overflow-hidden border-0">
            <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:rotate-12 transition-all">
              <Wallet className="h-5 w-5 text-green-600 group-hover:text-white transition-all" />
            </div>
            <div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1 leading-none uppercase">Vault Balance</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">₹{user.wallet?.toLocaleString()}</h2>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-green-50 shadow-sm rounded-3xl flex flex-col justify-between h-40 transition-all active:scale-95 group overflow-hidden border-0">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:rotate-12 transition-all">
              <TrendingUp className="h-5 w-5 text-emerald-600 group-hover:text-white transition-all" />
            </div>
            <div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1 leading-none uppercase">Active Nodes</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{user.plans?.length || 0}</h2>
            </div>
          </Card>
        </div>

        {/* 3. Green Referral Hub */}
        <Card className="p-7 bg-[#14532D] border-0 shadow-2xl rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-green-500 text-white border-0 mb-3 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-[2px]">Affiliate Program</Badge>
                <p className="text-green-300/60 text-[10px] font-bold uppercase tracking-[2px] leading-none">Earn 10% Recurring Yield</p>
              </div>
              <button className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all border-0">
                <Share2 className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
              <p className="text-[9px] text-green-300/30 font-bold uppercase tracking-[3px] mb-3 text-center">Referral Node Link</p>
              <div className="flex items-center justify-between gap-3 bg-black/10 p-2 rounded-xl border border-white/5 overflow-hidden">
                <p className="text-[10px] font-mono text-green-200/50 truncate flex-1 px-2">{referralLink}</p>
                <button
                  onClick={() => handleCopyCode(referralLink, "Invite Link")}
                  className="bg-green-500 text-white h-9 w-9 rounded-lg flex items-center justify-center hover:bg-green-600 active:scale-90 transition-all border-0 shadow-lg shadow-green-900/20"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* 4. List Operations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[4px]">Maintenance Hub</p>
            <ShieldCheck className="h-4 w-4 text-green-200" />
          </div>
          <div className="space-y-3">
            {[
              { label: 'Settlements', sub: 'Payout Configuration', icon: LandmarkIcon, color: 'text-green-600', bg: 'bg-green-50', path: '/withdraw', dot: true },
              { label: 'Support Node', sub: 'Encrypted Ticket Desk', icon: Headphones, color: 'text-slate-900', bg: 'bg-slate-50', path: '/support' },
              { label: 'Activity Reg', sub: 'Portfolio Audit Log', icon: History, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/dashboard' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] shadow-sm hover:shadow-md active:scale-[0.99] transition-all border border-green-50 border-0"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 ${item.bg} rounded-xl flex items-center justify-center shadow-inner`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 text-sm block tracking-tight uppercase leading-none mb-1">{item.label}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.sub}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.dot && <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                  <ChevronRight className="h-4 w-4 text-slate-200" />
                </div>
              </button>
            ))}

            <Button
              onClick={handleLogout}
              className="w-full h-14 bg-red-50 text-red-500 hover:bg-red-100 rounded-[2rem] border border-red-100 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all mt-6 shadow-none"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Terminate Secure Session
            </Button>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
