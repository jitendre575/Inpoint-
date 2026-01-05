"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Share2, Copy, LogOut, Shield, Settings, Gift, Headphones, Landmark, History, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MinePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
    } else {
      const dbUser = JSON.parse(currentUser)
      setUser(dbUser)

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
    }
  }, [router])

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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header Profile Section */}
      <div className="bg-emerald-600 px-6 pt-12 pb-20 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-24 w-24 rounded-3xl bg-white p-1.5 shadow-2xl rotate-3 mb-4">
            <div className="h-full w-full rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-4xl font-black">
              {user.name?.charAt(0) || "U"}
            </div>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">{user.name}</h1>
          <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
            <span className="text-emerald-100 text-xs font-bold uppercase tracking-widest">ID: {user.id}</span>
            <button onClick={() => handleCopyCode(user.id, "User ID")} className="text-white/60 hover:text-white transition-colors">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-6">
        {/* Wallet Balances Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 bg-white border-0 shadow-lg rounded-[2rem] flex flex-col justify-between h-40">
            <div className="bg-emerald-100 h-10 w-10 rounded-2xl flex items-center justify-center mb-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Balance</p>
              <h2 className="text-2xl font-black text-gray-900">₹{user.wallet?.toFixed(0)}</h2>
            </div>
          </Card>
          <Card className="p-5 bg-white border-0 shadow-lg rounded-[2rem] flex flex-col justify-between h-40">
            <div className="bg-amber-100 h-10 w-10 rounded-2xl flex items-center justify-center mb-2">
              <Gift className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Referral</p>
              <h2 className="text-2xl font-black text-gray-900">₹{user.referralRewards || 0}</h2>
            </div>
          </Card>
        </div>

        {/* Refer & Earn Mandatory Section */}
        <Card className="p-6 bg-indigo-600 text-white border-0 shadow-xl rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black mb-1">Refer & Earn ₹100</h3>
                <p className="text-indigo-100 text-xs font-medium opacity-80">Instant bonus for every friend join</p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Share2 className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-2xl border border-white/20">
                <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest mb-2">Your link</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-mono font-bold truncate opacity-90">{referralLink}</p>
                  <button
                    onClick={() => handleCopyCode(referralLink, "Referral link")}
                    className="bg-white text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 active:scale-90 transition-all shadow-lg"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Functional Menu */}
        <div className="space-y-3">
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] pl-2 mb-2">Manage Account</h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Deposit', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50', path: '/deposit' },
              { label: 'Withdraw', icon: History, color: 'text-orange-600', bg: 'bg-orange-50', path: '/withdraw' },
              { label: 'Support', icon: Headphones, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/support' },
              { label: 'Security', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50', path: '/password' },
              { label: 'Settings', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50', path: '/settings' },
              { label: 'Logout', icon: LogOut, color: 'text-red-500', bg: 'bg-red-50', action: handleLogout },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.action || (() => router.push(item.path!))}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.97] transition-all hover:bg-gray-50/50 text-left"
              >
                <div className={`h-10 w-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="font-bold text-gray-700 text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
