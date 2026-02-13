"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
    User,
    Mail,
    Lock,
    Phone,
    ArrowRight,
    ShieldCheck,
    X,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    initialMode?: "login" | "signup"
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode)
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [mounted, setMounted] = useState(false)

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        promoCode: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (isOpen) {
            setMounted(true)
            setMode(initialMode)
        } else {
            const timer = setTimeout(() => setMounted(false), 300)
            return () => clearTimeout(timer)
        }
    }, [initialMode, isOpen])

    const validateSignup = () => {
        const newErrors: Record<string, string> = {}
        if (formData.fullName.length < 2) newErrors.fullName = "Name is too short"
        if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "10 digits required"
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
        if (formData.password.length < 6) newErrors.password = "Min 6 characters"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Match error"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            toast({
                title: "Access Authorized",
                description: "Establishing secure session node...",
                className: "bg-[#0F1C3F] border-[#5B2EFF]/30 text-white"
            })
            onClose()
            router.push("/dashboard")
        } catch (error: any) {
            toast({ title: "Authentication Error", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateSignup()) return
        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.mobileNumber,
                    password: formData.password,
                    promoCode: formData.promoCode
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');
            toast({
                title: "Success",
                description: "Profile created. You can now login.",
                className: "bg-[#10B981] text-white"
            })
            setMode("login")
        } catch (error: any) {
            toast({ title: "Registration Error", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    if (!mounted && !isOpen) return null

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div onClick={onClose} className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-sm" />

            <div className={`relative w-full max-w-[380px] glass-card bg-[#121A33]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#00F0FF] transition-colors z-10">
                    <X size={18} />
                </button>

                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-10 h-10 bg-[#5B2EFF]/10 rounded-lg flex items-center justify-center mb-3 border border-[#5B2EFF]/20">
                            <ShieldCheck className="text-[#5B2EFF] h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold text-white tracking-tight">
                            {mode === "login" ? "Terminal Access" : mode === "signup" ? "Create Account" : "Reset Password"}
                        </h2>
                        <p className="text-[10px] text-[#00F0FF] uppercase tracking-wider mt-1 font-medium">Secure Protocol Initialization</p>
                    </div>

                    <div className="flex p-1 bg-[#0F1C3F] rounded-lg mb-6">
                        <button onClick={() => setMode("login")} className={`flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all ${mode === "login" ? "bg-[#5B2EFF] text-white shadow-md" : "text-slate-400 hover:text-white"}`}>Sign In</button>
                        <button onClick={() => setMode("signup")} className={`flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all ${mode === "signup" ? "bg-[#5B2EFF] text-white shadow-md" : "text-slate-400 hover:text-white"}`}>Register</button>
                    </div>

                    <div className="space-y-4">
                        {mode === "login" && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider ml-0.5">Account ID</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00F0FF]" />
                                        <Input
                                            placeholder="Email or Phone"
                                            value={loginEmail}
                                            onChange={e => setLoginEmail(e.target.value)}
                                            className="h-11 pl-10 rounded-lg border-white/5 bg-white/5 text-white text-xs focus:ring-[#5B2EFF]/10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center px-0.5">
                                        <Label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Access Key</Label>
                                        <button type="button" onClick={() => setMode("forgot")} className="text-[10px] font-medium text-[#00F0FF] hover:underline uppercase tracking-wider">Lost Key?</button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00F0FF]" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={loginPassword}
                                            onChange={e => setLoginPassword(e.target.value)}
                                            className="h-11 pl-10 pr-10 rounded-lg border-white/5 bg-white/5 text-white text-xs focus:ring-[#5B2EFF]/10"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00F0FF]">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <Button disabled={loading} className="w-full h-11 premium-gradient text-white font-semibold rounded-lg shadow-lg hover:shadow-[#5B2EFF]/40 transition-all text-[10px] uppercase tracking-wider border-0 outline-none active:scale-95">
                                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Authorize Node"}
                                </Button>
                            </form>
                        )}

                        {mode === "signup" && (
                            <form onSubmit={handleSignup} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Full Name</Label>
                                        <Input placeholder="Enter Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="h-10 bg-white/5 border-white/5 rounded-lg text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Phone Number</Label>
                                        <Input type="tel" placeholder="10 Digits" value={formData.mobileNumber} onChange={e => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })} className="h-10 bg-white/5 border-white/5 rounded-lg text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email Node</Label>
                                    <Input type="email" placeholder="node@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-10 bg-white/5 border-white/5 rounded-lg text-xs" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Passcode</Label>
                                        <Input type="password" placeholder="••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="h-10 bg-white/5 border-white/5 rounded-lg text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Confirm</Label>
                                        <Input type="password" placeholder="••••••" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className="h-10 bg-white/5 border-white/5 rounded-lg text-xs" />
                                    </div>
                                </div>
                                <Button disabled={loading} className="w-full h-11 premium-gradient text-white font-semibold rounded-lg shadow-lg text-[10px] uppercase tracking-wider mt-2 border-0">
                                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Create Profile"}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="bg-[#0F1C3F] p-4 text-center border-t border-white/5">
                    <span className="text-[9px] text-[#00F0FF] uppercase tracking-wider font-semibold opacity-60">E2E Protocol Active</span>
                </div>
            </div>
        </div>
    )
}
