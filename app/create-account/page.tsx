"use client"

import type React from "react"
import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Users, Camera, User as UserIcon, ShieldCheck } from "lucide-react"
import Link from "next/link"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [refCode, setRefCode] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.replace("/dashboard")
    }

    const ref = searchParams.get("ref")
    if (ref) {
      setRefCode(ref)
    }
  }, [router, searchParams])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, referralCode: refCode, profilePhoto })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: "Account Created!",
        description: "You can now login with your credentials.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="relative w-full max-w-lg z-10">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl shadow-black/50">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-3 tracking-tighter italic">Join Inpoint<span className="text-emerald-500">.</span></h1>
            <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Start your high-yield journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center mb-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-28 w-28 rounded-[2.5rem] bg-neutral-800 border-2 border-dashed border-neutral-600 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all overflow-hidden relative group"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-neutral-500 flex flex-col items-center gap-1 group-hover:text-emerald-400">
                    <Camera className="h-8 w-8" />
                    <span className="text-[10px] font-black uppercase">Upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-3">Profile Photo Required</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-neutral-300 text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-2xl focus:bg-white/10 transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300 text-[10px] font-black uppercase tracking-widest ml-1">Referral Code</Label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input
                    placeholder="Optional"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-2xl focus:bg-white/10 transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300 text-[10px] font-black uppercase tracking-widest ml-1">Email / Mobile</Label>
              <Input
                type="text"
                placeholder="Enter Email or Phone Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-2xl focus:bg-white/10 transition-all font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300 text-[10px] font-black uppercase tracking-widest ml-1">Password</Label>
              <Input
                type="password"
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-2xl focus:bg-white/10 transition-all font-bold"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 disabled:bg-neutral-800"
              disabled={loading}
            >
              {loading ? "Establishing Protocol..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-8 text-neutral-500 text-xs font-bold">
            Already a member? <Link href="/login" className="text-emerald-500 hover:text-emerald-400 ml-1">Sign In</Link>
          </p>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-neutral-700" />
            <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">End-to-End SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900 flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>}>
      <RegisterContent />
    </Suspense>
  )
}
