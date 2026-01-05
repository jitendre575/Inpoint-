"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogOut, RefreshCw, Search, Eye, ArrowUpCircle, Landmark, ImageIcon, Shield, CheckCircle2, XCircle, Clock, Headphones } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null)

    // Modal State
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showChatModal, setShowChatModal] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [adminMessage, setAdminMessage] = useState("")
    const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null)

    const [userTypingOfId, setUserTypingOfId] = useState<string | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchUsers()
        const interval = setInterval(() => {
            fetchUsers(true)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    const fetchUsers = async (silent = false) => {
        const password = sessionStorage.getItem("adminSecret")
        if (!password) {
            router.push("/admin")
            return
        }

        if (!silent) setLoading(true)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (res.ok) {
                const data = await res.json()
                setUsers(data.users)

                let foundTypingId: string | null = null;
                data.users.forEach((u: any) => {
                    if (u.lastTyping && u.lastTyping.sender === 'user' && u.lastTyping.isTyping) {
                        const timeDiff = new Date().getTime() - new Date(u.lastTyping.timestamp).getTime()
                        if (timeDiff < 5000) foundTypingId = u.id;
                    }
                });
                setUserTypingOfId(foundTypingId);
            } else if (!silent) {
                sessionStorage.removeItem("adminSecret")
                router.push("/admin")
            }
        } catch (error) {
            console.error(error)
        } finally {
            if (!silent) setLoading(false)
        }
    }

    const totalUnreadSupport = users.reduce((acc, user) => {
        const unreadCount = user.supportChats?.filter((c: any) => c.sender === 'user' && !c.read).length || 0;
        return acc + unreadCount;
    }, 0);

    const handleAction = async (transactionId: string, type: 'deposit' | 'withdraw', action: 'approve' | 'reject') => {
        const password = sessionStorage.getItem("adminSecret")
        setActionLoading(true)
        try {
            const res = await fetch('/api/admin/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminSecret: password,
                    userId: selectedUser.id,
                    transactionId,
                    type,
                    action
                })
            })

            if (res.ok) {
                const data = await res.json()
                setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u))
                setSelectedUser(data.user)
            } else {
                alert("Action failed")
            }
        } catch (error) {
            alert("Error processing action")
        } finally {
            setActionLoading(false);
        }
    }

    const handleSupportReply = async () => {
        if (!adminMessage.trim()) return
        const password = sessionStorage.getItem("adminSecret")
        setActionLoading(true)
        try {
            const res = await fetch('/api/admin/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminSecret: password,
                    userId: selectedUser.id,
                    message: adminMessage,
                    action: 'reply'
                })
            })

            if (res.ok) {
                await fetchUsers(true);
                setAdminMessage("")
                const updatedUser = users.find((u: any) => u.id === selectedUser.id);
                if (updatedUser) setSelectedUser(updatedUser);
            }
        } catch (error) {
            console.error("Reply failed")
        } finally {
            setActionLoading(false)
        }
    }

    const markChatRead = async (user: any) => {
        const password = sessionStorage.getItem("adminSecret")
        fetch('/api/admin/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminSecret: password,
                userId: user.id,
                action: 'mark_read'
            })
        }).then(() => fetchUsers(true))
    }

    const handleLogout = () => {
        sessionStorage.removeItem("adminSecret")
        router.push("/admin")
    }

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm)
    )

    const handleAdminTyping = (text: string) => {
        setAdminMessage(text)
        if (!selectedUser) return
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        else sendTypingStatus(true)

        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false)
            typingTimeoutRef.current = null
        }, 1500)
    }

    const sendTypingStatus = async (isTyping: boolean) => {
        if (!selectedUser) return
        try {
            const password = sessionStorage.getItem("adminSecret")
            await fetch('/api/admin/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminSecret: password,
                    userId: selectedUser.id,
                    action: 'typing',
                    isTyping
                })
            })
        } catch (e) { }
    }

    const activeUser = selectedUser ? users.find(u => u.id === selectedUser.id) || selectedUser : null;

    return (
        <div className="min-h-screen bg-neutral-900/5 pb-20 font-sans">
            <header className="bg-neutral-900 text-white shadow-2xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Admin<span className="text-emerald-500">Node</span></h1>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Main Controller</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="p-2.5 bg-neutral-800 rounded-xl cursor-pointer hover:bg-neutral-700 transition-colors">
                                <span className="text-xl">🔔</span>
                            </div>
                            {totalUnreadSupport > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full border-2 border-neutral-900 font-black animate-bounce">
                                    {totalUnreadSupport}
                                </span>
                            )}
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="destructive"
                            size="sm"
                            className="h-10 px-4 font-bold rounded-xl"
                        >
                            <LogOut className="h-4 w-4 mr-2" /> EXIT
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Find User by ID, Name or Email..."
                            className="h-14 pl-12 bg-white shadow-xl border-0 rounded-2xl text-lg font-medium ring-1 ring-neutral-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => fetchUsers()} variant="outline" className="h-14 w-14 rounded-2xl bg-white shadow-xl border-0 hover:bg-neutral-50 active:scale-95 transition-all">
                        <RefreshCw className={`h-6 w-6 text-neutral-600 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {loading && !users.length ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600" />
                        <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs">Syncing Core Data...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[2.5rem] shadow-xl">
                        <p className="text-xl font-black text-neutral-300">USER_NOT_FOUND_IN_NODE</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredUsers.map((user) => {
                            const pendingWithdr = user.withdrawals?.filter((w: any) => w.status === 'Pending').length || 0;
                            const processingDep = user.deposits?.filter((d: any) => d.status === 'Processing').length || 0;
                            const unreadChats = user.supportChats?.filter((c: any) => c.sender === 'user' && !c.read).length || 0;
                            const actionRequired = pendingWithdr > 0 || processingDep > 0;

                            return (
                                <Card key={user.id} className="overflow-hidden border-0 shadow-2xl rounded-[2.5rem] bg-white group hover:-translate-y-2 transition-all duration-500">
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-black text-xl text-neutral-800 mb-1">{user.name}</h3>
                                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md inline-block">ID: {user.id}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {actionRequired && (
                                                    <Badge className="bg-rose-500 text-white border-0 shadow-lg shadow-rose-500/20 text-[10px] font-black uppercase px-2 py-1 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> PENDING
                                                    </Badge>
                                                )}
                                                {unreadChats > 0 && (
                                                    <Badge className="bg-sky-500 text-white border-0 shadow-lg shadow-sky-500/20 text-[10px] font-black uppercase px-2 py-1">
                                                        {unreadChats} NEW MSG
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Current Wallet</span>
                                                <span className="font-black text-emerald-600 text-lg">₹{user.wallet.toFixed(0)}</span>
                                            </div>
                                            <div className="p-4 bg-neutral-50 rounded-3xl border border-neutral-100 flex justify-between items-center">
                                                <div>
                                                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1">Total Flow</p>
                                                    <p className="font-bold text-neutral-700 text-sm">₹{user.deposits?.length || 0} Deps</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1">Status</p>
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowHistoryModal(true);
                                                }}
                                                className="h-12 bg-neutral-50 text-neutral-600 rounded-2xl hover:bg-neutral-100 border-0 font-bold text-xs"
                                            >
                                                DEPOSITS
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowChatModal(true);
                                                    if (unreadChats > 0) markChatRead(user);
                                                }}
                                                className={`h-12 rounded-2xl font-black text-xs border-0 shadow-lg transition-all ${unreadChats > 0
                                                        ? 'bg-sky-500 text-white shadow-sky-500/20 hover:bg-sky-600'
                                                        : 'bg-neutral-800 text-white hover:bg-neutral-900'
                                                    }`}
                                            >
                                                {unreadChats > 0 ? `MSG (${unreadChats})` : 'CHAT'}
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowWithdrawModal(true);
                                                }}
                                                className={`h-12 rounded-2xl font-black text-xs border-0 shadow-lg col-span-2 transition-all ${pendingWithdr > 0
                                                        ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    }`}
                                            >
                                                WITHDRAW ACTION {pendingWithdr > 0 && `(${pendingWithdr})`}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* Chat Modal */}
            <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
                <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 border-0 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden">
                    <div className="p-6 bg-neutral-900 text-white flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black">Support Interface</h2>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{activeUser?.name} • ID: {activeUser?.id}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50 min-h-[400px]">
                        {(!activeUser?.supportChats || activeUser.supportChats.length === 0) ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                                <p>No Protocol Messages Found</p>
                            </div>
                        ) : (
                            activeUser.supportChats.map((chat: any) => (
                                <div key={chat.id} className={`flex ${chat.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm font-medium ${chat.sender === 'admin'
                                        ? 'bg-emerald-600 text-white rounded-tr-none'
                                        : 'bg-white text-neutral-800 border-0 rounded-tl-none shadow-neutral-200/50'
                                        }`}>
                                        <p className="leading-relaxed">{chat.message}</p>
                                        <p className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${chat.sender === 'admin' ? 'text-emerald-200' : 'text-neutral-400'}`}>
                                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {userTypingOfId === activeUser?.id && (
                            <div className="flex justify-start">
                                <div className="bg-white text-emerald-600 text-[10px] font-black py-2 px-4 rounded-full shadow-sm flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> USER IS TYPING...
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white border-t border-neutral-100 flex gap-3">
                        <Input
                            value={adminMessage}
                            onChange={(e) => handleAdminTyping(e.target.value)}
                            placeholder="Enter Reply Protocol..."
                            className="flex-1 h-14 bg-neutral-50 border-0 rounded-2xl font-bold"
                            onKeyDown={(e) => e.key === 'Enter' && handleSupportReply()}
                        />
                        <Button
                            onClick={handleSupportReply}
                            disabled={actionLoading || !adminMessage.trim()}
                            className="h-14 w-14 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700"
                        >
                            ➤
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* History & Deposit Action Modal */}
            <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-[2.5rem] border-0 shadow-2xl">
                    <div className="p-8 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-neutral-800 uppercase tracking-tight">Deposit Center</h2>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">{selectedUser?.name}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-white">
                        <div>
                            <h4 className="font-black text-[10px] text-neutral-300 uppercase tracking-[0.3em] mb-6">Recent Records</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {(selectedUser?.deposits || []).slice().reverse().map((deposit: any) => (
                                    <div key={deposit.id} className="flex items-center justify-between p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 group">
                                        <div className="flex items-center gap-6">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${deposit.status === 'Processing' ? 'bg-amber-100 text-amber-600 shadow-amber-500/10' :
                                                    deposit.status === 'Approved' ? 'bg-emerald-100 text-emerald-600 shadow-emerald-500/10' :
                                                        'bg-neutral-200 text-neutral-500'
                                                }`}>
                                                <Landmark className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-neutral-800">₹{deposit.amount}</p>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{new Date(deposit.date).toLocaleString()}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={`text-[10px] font-black border-0 ${deposit.status === 'Processing' ? 'bg-amber-500' :
                                                            deposit.status === 'Approved' ? 'bg-emerald-500' :
                                                                'bg-rose-500'
                                                        } text-white`}>{deposit.status}</Badge>
                                                    <span className="text-[9px] text-neutral-400 uppercase font-black">{deposit.method}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {deposit.screenshot && (
                                                <Button
                                                    onClick={() => setViewingScreenshot(deposit.screenshot)}
                                                    variant="ghost"
                                                    className="h-12 bg-white rounded-xl shadow-sm hover:bg-neutral-50 border border-neutral-200 text-neutral-500"
                                                >
                                                    <ImageIcon className="h-5 w-5" />
                                                </Button>
                                            )}
                                            {deposit.status === 'Processing' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleAction(deposit.id, 'deposit', 'reject')}
                                                        className="h-12 bg-white text-rose-500 rounded-xl hover:bg-rose-50 border border-rose-100 font-black text-xs px-4"
                                                    >
                                                        REJECT
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleAction(deposit.id, 'deposit', 'approve')}
                                                        className="h-12 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-black text-xs px-4"
                                                    >
                                                        APPROVE
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {!selectedUser?.deposits?.length && <p className="text-center py-20 text-neutral-300 font-black italic uppercase tracking-widest text-xs">NO_DEPOSIT_PROTOCOLS_FOUND</p>}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Withdraw Action Modal */}
            <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-[2.5rem] border-0 shadow-2xl">
                    <div className="p-8 bg-neutral-900 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Withdraw Gate</h2>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">{selectedUser?.name}</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-neutral-50/50">
                        {(selectedUser?.withdrawals || []).slice().reverse().map((withdrawal: any) => (
                            <Card key={withdrawal.id} className="p-6 border-0 shadow-md rounded-3xl bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-4 w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                                                    <ArrowUpCircle className="h-7 w-7" />
                                                </div>
                                                <p className="text-2xl font-black text-neutral-800">₹{withdrawal.amount}</p>
                                            </div>
                                            <Badge className={`text-[10px] font-black border-0 ${withdrawal.status === 'Pending' ? 'bg-amber-500' :
                                                    withdrawal.status === 'Completed' ? 'bg-emerald-500' : 'bg-rose-500'
                                                } text-white`}>{withdrawal.status}</Badge>
                                        </div>
                                        <div className="bg-neutral-900/5 p-5 rounded-2xl text-sm border border-neutral-100 grid grid-cols-1 gap-3">
                                            <div className="flex justify-between border-b border-neutral-100 pb-2">
                                                <span className="text-neutral-400 font-bold uppercase text-[9px]">Recipient</span>
                                                <span className="font-black text-neutral-800">{withdrawal.bankDetails.name}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-neutral-100 pb-2">
                                                <span className="text-neutral-400 font-bold uppercase text-[9px]">Protocol ID</span>
                                                <span className="font-mono font-bold text-neutral-600">{withdrawal.bankDetails.accountNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-400 font-bold uppercase text-[9px]">IFS Code</span>
                                                <span className="font-mono font-bold text-neutral-600">{withdrawal.bankDetails.ifsc}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 font-bold uppercase">{new Date(withdrawal.date).toLocaleString()}</p>
                                    </div>
                                </div>

                                {withdrawal.status === 'Pending' && (
                                    <div className="flex justify-end gap-3 pt-6 border-t border-neutral-100">
                                        <Button
                                            onClick={() => handleAction(withdrawal.id, 'withdraw', 'reject')}
                                            disabled={actionLoading}
                                            variant="ghost"
                                            className="h-12 px-8 text-rose-500 font-black text-xs hover:bg-rose-50 rounded-xl"
                                        >
                                            CANCEL
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(withdrawal.id, 'withdraw', 'approve')}
                                            disabled={actionLoading}
                                            className="h-12 px-8 bg-neutral-900 text-white font-black text-xs hover:bg-black rounded-xl shadow-xl shadow-black/10 transition-all"
                                        >
                                            APPROVE
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Screenshot Viewer */}
            <Dialog open={!!viewingScreenshot} onOpenChange={() => setViewingScreenshot(null)}>
                <DialogContent className="max-w-xl p-0 border-0 bg-transparent shadow-none">
                    <div className="p-4 flex flex-col items-center">
                        <img
                            src={viewingScreenshot || ""}
                            alt="Payment Screenshot"
                            className="max-w-full max-h-[80vh] rounded-[2.5rem] shadow-2xl ring-4 ring-white"
                        />
                        <Button
                            onClick={() => setViewingScreenshot(null)}
                            className="mt-6 bg-white text-black font-black hover:bg-white/90 rounded-2xl h-12 px-10 border-0"
                        >
                            CLOSE VIEWER
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
