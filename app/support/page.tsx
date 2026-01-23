"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, HeadphonesIcon, MessageCircle, Check, CheckCheck, Loader2, WifiOff } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

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
            router.push("/login")
            return
        }

        const userData = JSON.parse(currentUser)
        setUser(userData)

        // Connectivity listener
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        let unsubscribe: () => void = () => { }

        if (db && userData.id) {
            // Real-time listener with Firebase
            try {
                unsubscribe = onSnapshot(doc(db, "users", userData.id), (doc) => {
                    const data = doc.data()
                    if (data) {
                        setChats(data.supportChats || [])

                        // Check admin typing
                        if (data.lastTyping && data.lastTyping.sender === 'admin' && data.lastTyping.isTyping) {
                            const timeDiff = new Date().getTime() - new Date(data.lastTyping.timestamp).getTime()
                            setAdminTyping(timeDiff < 5000)
                        } else {
                            setAdminTyping(false)
                        }

                        if ((data.supportChats?.length > 0) && step === 1) {
                            setStep(2)
                        }
                    }
                }, (error) => {
                    console.error("Firestore Listener Error:", error)
                    // Fallback to polling if listener fails
                    startPolling(userData.id)
                })
            } catch (e) {
                startPolling(userData.id)
            }
        } else {
            // Fallback for non-Firebase environments
            startPolling(userData.id)
        }

        return () => {
            unsubscribe()
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
        <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden">
            {/* Premium Support Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center gap-4 shadow-xl z-10 rounded-b-[2.5rem]">
                <button onClick={() => router.back()} className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex-1 flex items-center gap-4">
                    <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                        <HeadphonesIcon className="h-8 w-8 text-blue-100" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight leading-none mb-1">Live Support</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-100">
                                    {isOnline ? 'Active Desk' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden max-w-2xl mx-auto w-full flex flex-col">
                {step === 1 ? (
                    <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
                        <div className="w-full max-w-sm">
                            <div className="relative mb-8 mt-4">
                                <div className="absolute inset-0 bg-blue-100 rounded-[3rem] blur-3xl opacity-60 -z-10" />
                                <img
                                    src="/support-hero.png"
                                    alt="Support Agent"
                                    className="w-full h-64 object-contain animate-in fade-in zoom-in duration-1000"
                                />
                            </div>

                            <div className="text-center mb-8 px-4">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">Welcome to <span className="text-blue-600">Help Desk</span></h2>
                                <p className="text-slate-500 mt-2 font-bold text-sm">Please verify your details to start the conversion with our official agent.</p>
                            </div>

                            <Card className="p-8 shadow-2xl shadow-blue-900/5 border-0 bg-white rounded-[3rem]">
                                <form onSubmit={handleSubmitSupportForm} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] ml-2">Your User ID</Label>
                                        <Input
                                            placeholder="Enter your UID"
                                            value={supportForm.userId}
                                            onChange={(e) => setSupportForm(prev => ({ ...prev, userId: e.target.value }))}
                                            className="h-14 border-2 border-slate-50 bg-slate-50/50 rounded-2xl text-lg font-bold focus:bg-white focus:border-blue-500 transition-all px-6"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] ml-2">Phone Number</Label>
                                        <Input
                                            placeholder="Enter 10-digit number"
                                            value={supportForm.phone}
                                            onChange={(e) => setSupportForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                                            maxLength={10}
                                            className="h-14 border-2 border-slate-50 bg-slate-50/50 rounded-2xl text-lg font-bold focus:bg-white focus:border-blue-500 transition-all px-6"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-xs uppercase tracking-[0.2em]">
                                        Initialize Support
                                    </Button>
                                </form>
                            </Card>

                            <div className="mt-8 flex justify-center gap-6 opacity-40">
                                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
                        {!isOnline && (
                            <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[11px] py-1 px-4 flex items-center justify-center gap-2 z-20 animate-in fade-in slide-in-from-top-full">
                                <WifiOff className="h-3 w-3" /> Waiting for network...
                            </div>
                        )}

                        {/* Chat Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
                        >
                            {chats.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center px-10 py-12">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50" />
                                        <div className="h-20 w-20 bg-white rounded-[1.5rem] flex items-center justify-center relative shadow-xl border border-blue-50">
                                            <MessageCircle className="h-10 w-10 text-blue-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-2">Initialize Conversation</h3>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">System is connecting you to a live representative. <br />Please wait a moment.</p>
                                </div>
                            )}

                            {chats.map((chat, idx) => {
                                const isUser = chat.sender === 'user'
                                const showTime = idx === 0 || new Date(chat.timestamp).getTime() - new Date(chats[idx - 1].timestamp).getTime() > 300000 // 5 mins gap

                                return (
                                    <div key={chat.id} className="space-y-2">
                                        {showTime && (
                                            <div className="text-center py-4">
                                                <span className="bg-gray-200/50 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                                    {new Date(chat.timestamp).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group items-end gap-2`}>
                                            <div
                                                className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] shadow-sm relative transition-all ${isUser
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                                    }`}
                                            >
                                                <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{chat.message}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-1 ${isUser ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                    <span className="text-[9px] font-bold">
                                                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isUser && (
                                                        chat.status === 'delivered' ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {adminTyping && (
                                <div className="flex justify-start animate-in slide-in-from-left-4 fade-in">
                                    <div className="bg-white border border-blue-100 shadow-sm text-blue-600 text-[10px] font-black py-3 px-5 rounded-[1.5rem] rounded-bl-none flex items-center gap-3">
                                        <span className="flex gap-1">
                                            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" />
                                            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce delay-100" />
                                            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce delay-200" />
                                        </span>
                                        AGENT IS TYPING...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Footer */}
                        <div className="p-4 bg-white border-t border-gray-100 pb-10">
                            <div className="max-w-xl mx-auto flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner group focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                                <Input
                                    value={message}
                                    onChange={(e) => handleTyping(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 border-0 focus-visible:ring-0 bg-transparent h-12 px-4 font-medium text-gray-800"
                                    onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                                    disabled={!isOnline}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim() || isSending || !isOnline}
                                    className={`h-14 w-14 rounded-2xl shrink-0 transition-all ${!message.trim() || isSending || !isOnline
                                        ? 'bg-slate-200 text-slate-400'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 active:scale-95'
                                        }`}
                                >
                                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-6 w-6" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
