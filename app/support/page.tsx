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
    const [problemType, setProblemType] = useState("")
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

    const handleSubmitToken = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!problemType) {
            toast({ title: "Please select an issue type", variant: "destructive" })
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
            problemType: chats.length === 0 ? problemType : undefined
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
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center gap-4 shadow-md z-10">
                <button onClick={() => router.back()} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex-1 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <HeadphonesIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">Support Center</h1>
                        <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-red-400'}`} />
                            <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">
                                {isOnline ? 'System Online' : 'Connecting...'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden max-w-2xl mx-auto w-full flex flex-col">
                {step === 1 ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <Card className="w-full p-8 shadow-2xl border-0 bg-gray-50 rounded-[2rem]">
                            <div className="text-center mb-10">
                                <div className="h-24 w-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-lg">
                                    <MessageCircle className="h-12 w-12 text-emerald-600 -rotate-3" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 leading-tight">Help & Support</h2>
                                <p className="text-gray-500 mt-2 font-medium">How can we assist you today?</p>
                            </div>

                            <form onSubmit={handleSubmitToken} className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-gray-400 text-xs uppercase font-black tracking-widest pl-1">Category</Label>
                                    <Select onValueChange={setProblemType} value={problemType}>
                                        <SelectTrigger className="h-14 border-0 bg-white shadow-sm rounded-2xl text-lg font-bold focus:ring-2 focus:ring-emerald-500">
                                            <SelectValue placeholder="Select an issue..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-0 shadow-2xl">
                                            <SelectItem value="Login Problem" className="h-12 font-semibold">Login Problem</SelectItem>
                                            <SelectItem value="Deposit Issue" className="h-12 font-semibold">Deposit Issue</SelectItem>
                                            <SelectItem value="Withdrawal Issue" className="h-12 font-semibold">Withdrawal Issue</SelectItem>
                                            <SelectItem value="Account Block" className="h-12 font-semibold">Account Block</SelectItem>
                                            <SelectItem value="Other" className="h-12 font-semibold">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-4 bg-white rounded-2xl space-y-3 shadow-sm">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider">User Account</span>
                                        <span className="font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">ACTIVE</span>
                                    </div>
                                    <p className="font-mono text-gray-600 font-bold truncate">{user.email}</p>
                                </div>

                                <Button type="submit" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-black rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-95">
                                    Start Secure Chat
                                </Button>
                            </form>
                        </Card>
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
                                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                        <MessageCircle className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 font-bold text-sm">Our agent will connect with you shortly. Please explain your issue.</p>
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
                                                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm relative transition-all ${isUser
                                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 border-0 rounded-bl-none'
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
                                    <div className="bg-white border-0 shadow-sm text-emerald-600 text-[11px] font-black py-2.5 px-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                                        <span className="flex gap-1">
                                            <span className="h-1 w-1 bg-emerald-600 rounded-full animate-bounce" />
                                            <span className="h-1 w-1 bg-emerald-600 rounded-full animate-bounce delay-100" />
                                            <span className="h-1 w-1 bg-emerald-600 rounded-full animate-bounce delay-200" />
                                        </span>
                                        AGENT IS TYPING
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
                                    className={`h-12 w-12 rounded-xl shrink-0 transition-all ${!message.trim() || isSending || !isOnline
                                            ? 'bg-gray-200 text-gray-400'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 active:scale-90'
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
