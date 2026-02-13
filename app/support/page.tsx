"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, HeadphonesIcon, MessageCircle, Check, CheckCheck, Loader2, WifiOff, ShieldCheck, Zap } from "lucide-react"

export default function SupportPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<any>(null)
    const [step, setStep] = useState<1 | 2>(1)
    const [supportForm, setSupportForm] = useState({ userId: "", phone: "" })
    const [message, setMessage] = useState("")
    const [chats, setChats] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [adminTyping, setAdminTyping] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser")
        if (!currentUser) {
            router.push("/")
            return
        }

        const userData = JSON.parse(currentUser)
        setUser(userData)

        // Connectivity listener
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        startPolling(userData.id)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [router])

    const startPolling = (userId: string) => {
        const interval = setInterval(() => {
            fetchChats(userId)
        }, 3000)
        return () => clearInterval(interval)
    }

    const fetchChats = async (userId: string) => {
        try {
            const res = await fetch(`/api/support?userId=${userId}`)
            if (res.ok) {
                const data = await res.json()
                setChats(data.chats)

                if (data.lastTyping && data.lastTyping.sender === 'admin' && data.lastTyping.isTyping) {
                    const timeDiff = new Date().getTime() - new Date(data.lastTyping.timestamp).getTime()
                    setAdminTyping(timeDiff < 5000)
                } else {
                    setAdminTyping(false)
                }

                if (data.chats.length > 0 && step === 1) {
                    setStep(2)
                }
            }
        } catch (error) {
            console.error("Polling failed")
        }
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [chats, adminTyping])

    const handleTyping = (text: string) => {
        setMessage(text)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        else sendTypingStatus(true)

        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false)
            typingTimeoutRef.current = null
        }, 1500)
    }

    const sendTypingStatus = async (isTyping: boolean) => {
        if (!user || !isOnline) return
        try {
            await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, action: 'typing', isTyping })
            })
        } catch (e) { }
    }

    const handleSubmitSupportForm = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!supportForm.userId || !supportForm.phone) {
            toast({ title: "Please fill all details", variant: "destructive" })
            return
        }
        setStep(2)
    }

    const handleSendMessage = async () => {
        const trimmedMsg = message.trim()
        if (!trimmedMsg) return
        if (!isOnline) {
            toast({ title: "No internet connection", variant: "destructive" })
            return
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        sendTypingStatus(false)
        typingTimeoutRef.current = null

        setIsSending(true)
        const payload = {
            userId: user.id,
            message: trimmedMsg,
            problemType: chats.length === 0 ? `ID: ${supportForm.userId} | Phone: ${supportForm.phone}` : undefined
        }

        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Failed to send")
            setMessage("")
        } catch (err) {
            toast({
                title: "Message failed to send",
                description: "Trying to reconnect...",
                variant: "destructive"
            })
        } finally {
            setIsSending(false)
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-[#0B1020] flex flex-col h-screen overflow-hidden font-sans selection:bg-purple-500/30">
            {/* Premium Support Header */}
            <div className="bg-[#0B1020]/80 p-6 text-white flex items-center gap-4 shadow-3xl z-30 rounded-b-[4rem] sticky top-0 font-sans border-b border-white/5 backdrop-blur-md">
                <button onClick={() => router.back()} className="h-11 w-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-95 transition-all">
                    <ArrowLeft className="h-5 w-5 text-[#00F0FF]" />
                </button>
                <div className="flex-1 flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#5B2EFF]/10 rounded-2xl flex items-center justify-center border border-[#5B2EFF]/20 shadow-xl purple-glow">
                        <HeadphonesIcon className="h-7 w-7 text-[#5B2EFF]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight leading-none mb-1 uppercase text-white">Live Node</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                    {isOnline ? 'Active Link' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden max-w-2xl mx-auto w-full flex flex-col font-sans">
                {step === 1 ? (
                    <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
                        <div className="w-full max-w-sm">
                            <div className="relative mb-8 mt-10">
                                <div className="absolute inset-0 bg-[#5B2EFF]/10 rounded-full blur-[80px] opacity-40 -z-10" />
                                <div className="h-64 w-full flex items-center justify-center bg-[#121A33]/80 glass-card rounded-[3rem] shadow-3xl border border-white/5 overflow-hidden relative">
                                    <div className="absolute inset-x-0 bottom-10 flex justify-center opacity-10">
                                        <Zap className="h-40 w-40 text-white fill-white rotate-12" />
                                    </div>
                                    <div className="purple-glow rounded-full p-8 bg-[#5B2EFF]/5">
                                        <HeadphonesIcon className="h-24 w-24 text-[#00F0FF] relative z-10 animate-float" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mb-8 px-4">
                                <h2 className="text-2xl font-black text-white leading-none mb-3 uppercase">Support <span className="text-[#5B2EFF]">Protocol</span></h2>
                                <p className="text-slate-500 font-black text-[9px] uppercase tracking-[4px] leading-relaxed">Verify your identity node to initiate encrypted communication.</p>
                            </div>

                            <Card className="p-8 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-3xl rounded-[3rem]">
                                <form onSubmit={handleSubmitSupportForm} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-500 text-[9px] uppercase font-black tracking-[4px] ml-2">Node Identifier</Label>
                                        <Input
                                            placeholder="User UID"
                                            value={supportForm.userId}
                                            onChange={(e) => setSupportForm(prev => ({ ...prev, userId: e.target.value }))}
                                            className="h-12 border-white/5 bg-black/20 rounded-xl text-sm font-bold focus:bg-black/30 text-white transition-all px-5 placeholder:text-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-500 text-[9px] uppercase font-black tracking-[4px] ml-2">Contact Mobile</Label>
                                        <Input
                                            placeholder="Enter 10-digit number"
                                            value={supportForm.phone}
                                            onChange={(e) => setSupportForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                                            maxLength={10}
                                            className="h-12 border-white/5 bg-black/20 rounded-xl text-sm font-bold focus:bg-black/30 text-white transition-all px-5 placeholder:text-slate-800"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full h-14 premium-gradient text-white font-black rounded-xl shadow-3xl shadow-purple-900/40 transition-all active:scale-95 text-[11px] uppercase tracking-[4px] border-0 purple-glow">
                                        Initialize Support
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col h-full bg-[#0B1020] relative">
                        {!isOnline && (
                            <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-[9px] py-2 px-4 flex items-center justify-center gap-2 z-40 font-black uppercase tracking-[4px] shadow-2xl">
                                <WifiOff className="h-3 w-3" /> Link Down: Reconnecting...
                            </div>
                        )}

                        {/* Chat Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth pb-20 scrollbar-hide"
                        >
                            {chats.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center px-10 py-12 opacity-30">
                                    <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                                        <MessageCircle className="h-10 w-10 text-[#5B2EFF]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">System Ready</h3>
                                    <p className="text-slate-500 font-black text-[9px] uppercase tracking-[4px] leading-relaxed">Agent is joining the secure link.<br />Describe your issue below.</p>
                                </div>
                            )}

                            {chats.map((chat, idx) => {
                                const isUser = chat.sender === 'user'
                                const showTime = idx === 0 || new Date(chat.timestamp).getTime() - new Date(chats[idx - 1].timestamp).getTime() > 300000

                                return (
                                    <div key={chat.id} className="space-y-3 font-sans">
                                        {showTime && (
                                            <div className="text-center py-4">
                                                <span className="bg-white/5 text-slate-500 text-[8px] font-black px-4 py-1.5 rounded-lg uppercase tracking-[3px] border border-white/5">
                                                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group items-end gap-2`}>
                                            <div
                                                className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-xl relative transition-all ${isUser
                                                    ? 'bg-[#5B2EFF] text-white rounded-br-none shadow-purple-900/40 purple-glow border-0'
                                                    : 'bg-[#121A33] text-white border border-white/5 rounded-bl-none shadow-2xl'
                                                    }`}
                                            >
                                                <p className="text-[14px] font-bold leading-relaxed whitespace-pre-wrap">{chat.message}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-2 ${isUser ? 'text-purple-200' : 'text-slate-500'}`}>
                                                    <span className="text-[8px] font-black uppercase">
                                                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isUser && (
                                                        <CheckCheck className={`h-2.5 w-2.5 ${chat.status === 'delivered' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {adminTyping && (
                                <div className="flex justify-start animate-in slide-in-from-left-4 fade-in">
                                    <div className="bg-[#121A33] border border-white/5 shadow-xl text-[#00F0FF] text-[8px] font-black py-2.5 px-5 rounded-xl rounded-bl-none flex items-center gap-3 tracking-[3px]">
                                        <div className="flex gap-1 items-center">
                                            <span className="h-1 w-1 bg-[#00F0FF] rounded-full animate-bounce" />
                                            <span className="h-1 w-1 bg-[#00F0FF] rounded-full animate-bounce delay-100" />
                                            <span className="h-1 w-1 bg-[#00F0FF] rounded-full animate-bounce delay-200" />
                                        </div>
                                        AGENT WRITING...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input Container */}
                        <div className="p-4 bg-[#0B1020]/80 border-t border-white/5 pb-10 sticky bottom-0 backdrop-blur-md">
                            <div className="max-w-xl mx-auto flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/10 shadow-3xl group focus-within:bg-black/40 focus-within:border-[#5B2EFF]/30 transition-all">
                                <Input
                                    value={message}
                                    onChange={(e) => handleTyping(e.target.value)}
                                    placeholder="Type encrypted message..."
                                    className="flex-1 border-0 focus-visible:ring-0 bg-transparent h-11 px-4 font-bold text-white text-sm placeholder:text-slate-800"
                                    onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                                    disabled={!isOnline}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim() || isSending || !isOnline}
                                    className={`h-11 w-11 rounded-xl shrink-0 transition-all border-0 ${!message.trim() || isSending || !isOnline
                                        ? 'bg-white/5 text-slate-700'
                                        : 'premium-gradient text-white shadow-xl shadow-purple-900/40 active:scale-90 purple-glow'
                                        }`}
                                >
                                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
