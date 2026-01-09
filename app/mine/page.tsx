"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Share2, Copy, LogOut, Shield, Settings, Gift, Headphones, Landmark, History, Wallet, Camera, User as UserIcon, Phone, Mail, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    toast({ title: `${title} copied to clipboard!` })
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-32">
      {/* Premium Header */}
      <div className="bg-neutral-900 px-6 pt-16 pb-24 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full -mr-20 -mt-20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full -ml-32 -mb-32 blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative group">
            <div className="h-32 w-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl transform transition-transform group-hover:rotate-6 duration-500">
              <div className="h-full w-full rounded-[2rem] overflow-hidden bg-neutral-100 flex items-center justify-center">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-5xl font-black">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-1 right-1 h-10 w-10 bg-white shadow-xl rounded-2xl flex items-center justify-center hover:bg-neutral-50 active:scale-90 transition-all border border-neutral-100"
            >
              {isUploading ? <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" /> : <Camera className="h-5 w-5 text-indigo-600" />}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h1 className="text-3xl font-black text-white mt-6 mb-2 tracking-tight">{user.name}</h1>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-xl">
              <span className="text-neutral-300 text-[10px] font-black uppercase tracking-widest">UID: {user.id?.slice(0, 8) || "N/A"}</span>
              <button onClick={() => handleCopyCode(user.id, "User ID")} className="text-white/40 hover:text-white transition-colors">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            {user.isBlocked && (
              <div className="bg-rose-500/20 text-rose-400 px-4 py-2 rounded-2xl border border-rose-500/20 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest">
                Blocked
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-12 space-y-6">
        {/* Contact Info Card */}
        <Card className="p-6 bg-white border-0 shadow-xl shadow-neutral-200/50 rounded-[2.5rem]">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-bold text-neutral-800">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-neutral-800">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Financial Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white border-0 shadow-xl shadow-neutral-200/50 rounded-[2.5rem] flex flex-col justify-between h-44">
            <div className="bg-emerald-50 h-12 w-12 rounded-[1.25rem] flex items-center justify-center mb-4 border border-emerald-100">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Wallet</p>
              <h2 className="text-3xl font-black text-neutral-900">₹{user.wallet?.toLocaleString()}</h2>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-xl shadow-neutral-200/50 rounded-[2.5rem] flex flex-col justify-between h-44">
            <div className="bg-amber-50 h-12 w-12 rounded-[1.25rem] flex items-center justify-center mb-4 border border-amber-100">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Plans</p>
              <h2 className="text-3xl font-black text-neutral-900">{user.plans?.length || 0}</h2>
            </div>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card className="p-8 bg-indigo-600 text-white border-0 shadow-2xl shadow-indigo-600/30 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black mb-1">Invite & Earn</h3>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider opacity-80">Referral Benefit System</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <Share2 className="h-7 w-7" />
              </div>
            </div>

            <div className="bg-black/20 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
              <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest mb-3">Copy Invite Link</p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-mono font-bold truncate opacity-90 select-all">{referralLink}</p>
                <button
                  onClick={() => handleCopyCode(referralLink, "Referral link")}
                  className="bg-white text-indigo-600 h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-neutral-50 active:scale-90 transition-all shadow-xl"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Plans Summary */}
        {user.plans && user.plans.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] pl-4">Active Investments</h3>
            <div className="space-y-3">
              {user.plans.map((plan: any, idx: number) => (
                <Card key={idx} className="p-5 bg-white border border-neutral-100 shadow-sm rounded-3xl flex justify-between items-center">
                  <div>
                    <p className="font-black text-neutral-800">{plan.name}</p>
                    <p className="text-xs text-neutral-400 font-bold uppercase">₹{plan.amount} • {new Date(plan.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-600 font-black text-lg">₹{plan.dailyReturn}/day</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">ROI</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions List */}
        <div className="space-y-3 pt-4">
          <h3 className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] pl-4">Account Settings</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Bank Details', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50', path: '/withdraw' },
              { label: 'Chat Support', icon: Headphones, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/support' },
              { label: 'Change Password', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50', path: '/password' },
              { label: 'Transaction History', icon: History, color: 'text-amber-600', bg: 'bg-amber-50', path: '/dashboard' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className="flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-neutral-100 shadow-sm hover:bg-neutral-50 active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 ${item.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <span className="font-bold text-neutral-800">{item.label}</span>
                </div>
                <div className="h-8 w-8 rounded-full border border-neutral-100 flex items-center justify-center">
                  <Copy className="h-4 w-4 text-neutral-200 group-hover:text-neutral-400 rotate-90" />
                </div>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 p-5 bg-rose-50 text-rose-600 rounded-[1.5rem] border border-rose-100 font-black text-xs uppercase tracking-widest hover:bg-rose-100 active:scale-[0.98] transition-all mt-4"
            >
              <LogOut className="h-4 w-4" />
              Sign Out Securely
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
