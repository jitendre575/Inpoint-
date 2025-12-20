"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, HeadphonesIcon, MessageCircle } from "lucide-react"

export default function SupportPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<any>(null)
    const [step, setStep] = useState<1 | 2>(1)
    const [problemType, setProblemType] = useState("")
    const [message, setMessage] = useState("")
    const [chats, setChats] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [adminTyping, setAdminTyping] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser")
        if (!currentUser) {
            router.push("/login")
        } else {
            const userData = JSON.parse(currentUser)
            setUser(userData)
            // Initial fetch
            fetchChats(userData.id)

            // Polling for Real-time (approx 2s interval)
            const interval = setInterval(() => {
                fetchChats(userData.id)
            }, 2000)

            return () => clearInterval(interval)
        }
    }, [router])

    const fetchChats = async (userId: string) => {
        try {
            const res = await fetch(`/api/support?userId=${userId}`)
            if (res.ok) {
                const data = await res.json()
                // Only update if length changed or new read status or typing status
                // Simple approach: just update. React handles diffing.
                setChats(data.chats)

                // Check typing status
                if (data.lastTyping && data.lastTyping.sender === 'admin' && data.lastTyping.isTyping) {
                    // Check if recent (< 5s)
                    const timeDiff = new Date().getTime() - new Date(data.lastTyping.timestamp).getTime()
                    if (timeDiff < 5000) {
                        setAdminTyping(true)
                    } else {
                        setAdminTyping(false)
                    }
                } else {
                    setAdminTyping(false)
                }

                if (data.chats.length > 0 && step === 1) {
                    setStep(2)
                }
            }
        } catch (error) {
            console.error("Failed to fetch chats")
        }
    }

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [chats, step, adminTyping])

    const handleTyping = (text: string) => {
        setMessage(text)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        } else {
            // Send start typing
            sendTypingStatus(true)
        }

        typingTimeoutRef.current = setTimeout(() => {
            // Send stop typing
            sendTypingStatus(false)
            typingTimeoutRef.current = null
        }, 1000)
    }

    const sendTypingStatus = async (isTyping: boolean) => {
        if (!user) return
        try {
            await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    action: 'typing',
                    isTyping
                })
            })
        } catch (e) {
            // ignore
        }
    }

    const handleSubmitToken = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!problemType) {
            toast({ title: "Select a valid issue", variant: "destructive" })
            return
        }
        // Move to chat view
        setStep(2)
    }

    const handleSendMessage = async () => {
        if (!message.trim()) return

        // Stop typing indicator immediately
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        sendTypingStatus(false)
        typingTimeoutRef.current = null

        const payload = {
            userId: user.id,
            message: message,
            problemType: chats.length === 0 ? problemType : undefined
        }

        // Optimistic update
        const tempMsg = {
            id: Date.now().toString(),
            sender: 'user',
            message: payload.problemType ? `[Issue: ${payload.problemType}] ${message}` : message,
            timestamp: new Date().toISOString(),
            read: false
        }
        setChats(prev => [...prev, tempMsg])
        setMessage("")

        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                // Fetch fresh to ensure sync
                fetchChats(user.id)
            }
        } catch (err) {
            toast({ title: "Failed to send", variant: "destructive" })
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center gap-4 shadow-lg sticky top-0 z-10 transition-all">
                <button onClick={() => router.back()} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <HeadphonesIcon className="h-6 w-6" /> Customer Support
                    </h1>
                </div>
            </div>

            <div className="flex-1 p-4 pb-24 max-w-md mx-auto w-full">
                {step === 1 ? (
                    <Card className="p-6 shadow-xl border-t-4 border-emerald-500 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce duration-[2000ms]">
                                <MessageCircle className="h-10 w-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">How can we help?</h2>
                            <p className="text-gray-500 mt-2">Please select your issue type to connect with an agent.</p>
                        </div>

                        <form onSubmit={handleSubmitToken} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">Select Issue</Label>
                                <Select onValueChange={setProblemType} value={problemType}>
                                    <SelectTrigger className="h-12 border-gray-200 focus:ring-emerald-500 bg-gray-50/50">
                                        <SelectValue placeholder="Choose a topic..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Login Problem">Login Problem</SelectItem>
                                        <SelectItem value="Deposit Issue">Deposit Issue</SelectItem>
                                        <SelectItem value="Withdrawal Issue">Withdrawal Issue</SelectItem>
                                        <SelectItem value="Account Block">Account Block</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                                <div>
                                    <Label className="text-gray-500 text-xs uppercase font-bold tracking-wider">User ID</Label>
                                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-gray-700 mt-1 select-all">{user.id}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-gray-500 text-xs uppercase font-bold tracking-wider">Mobile</Label>
                                        <div className="bg-gray-100 p-3 rounded-lg text-gray-700 mt-1 truncate">{user.email}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500 text-xs uppercase font-bold tracking-wider">Name</Label>
                                        <div className="bg-gray-100 p-3 rounded-lg text-gray-700 mt-1 truncate">{user.name}</div>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg font-semibold shadow-emerald-200 shadow-lg">
                                Start Chat
                            </Button>
                        </form>
                    </Card>
                ) : (
                    <div className="flex flex-col h-[calc(100vh-140px)]">
                        {/* Chat Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-100/50 rounded-2xl mb-4 border border-gray-200"
                        >
                            {chats.length === 0 && (
                                <div className="text-center text-gray-400 py-10">
                                    <p>Start detailed conversation below...</p>
                                </div>
                            )}

                            {chats.map((chat) => (
                                <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${chat.sender === 'user'
                                            ? 'bg-emerald-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none'
                                            }`}
                                    >
                                        <p>{chat.message}</p>
                                        <p className={`text-[10px] mt-1 text-right ${chat.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {adminTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 text-gray-500 text-xs py-2 px-3 rounded-2xl rounded-tl-none italic animate-pulse">
                                        Admin is typing...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2 items-center bg-white p-2 rounded-full border border-gray-200 shadow-lg">
                            <Input
                                value={message}
                                onChange={(e) => handleTyping(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border-0 focus-visible:ring-0 bg-transparent h-10 pl-4"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage} size="icon" className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 shrink-0">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
