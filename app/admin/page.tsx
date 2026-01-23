"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, Lock, Fingerprint } from "lucide-react"

export default function AdminLoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (!res.ok) throw new Error('Invalid Admin Password');
            sessionStorage.setItem("adminSecret", password);
            router.push("/admin/dashboard");
        } catch (error) {
            toast({ title: "Access Denied", description: "Incorrect Admin Password", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F071F] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-purple/20 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-theme-violet/10 rounded-full blur-[100px] -ml-20 -mb-20" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="bg-white/95 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_32px_80px_rgba(109,40,217,0.15)] p-10 border border-theme-lavender">
                    <div className="text-center mb-10">
                        <div className="h-20 w-20 bg-gradient-to-br from-theme-purple to-theme-violet rounded-[2.2rem] mx-auto mb-6 flex items-center justify-center shadow-xl shadow-theme-purple/20 border-2 border-white/20">
                            <Fingerprint className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-[#2D1A4A] tracking-tighter">Admin Portal</h1>
                        <p className="text-theme-purple/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Classified Terminal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-theme-purple/50 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
                                Encrypted Access Key
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-purple/30 group-focus-within:text-theme-purple transition-colors h-5 w-5" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter secure key..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-16 pl-14 rounded-2xl border-theme-lavender bg-[#FDFCFF] focus:ring-8 focus:ring-theme-purple/5 border-2 text-lg font-black"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white border-0 font-black rounded-2xl shadow-xl shadow-theme-purple/20 transition-all active:scale-95 text-lg"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Access Mainframe"}
                        </Button>
                    </form>
                    <div className="mt-8 text-center">
                        <Button variant="link" className="text-theme-purple/40 hover:text-theme-purple text-[10px] font-black uppercase tracking-widest" onClick={() => router.push('/')}>
                            Disconnect Terminal
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
