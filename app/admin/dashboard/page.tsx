"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogOut, RefreshCw, Search, Eye, ArrowUpCircle, Landmark, ImageIcon, Shield, CheckCircle2, XCircle, Clock, Headphones, Users, Activity, Wallet, Power, Edit3, Calendar, Bell, Plus, Minus, CreditCard, Trash2, Lock, User, Phone, Trash, Zap, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboardPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal State
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showChatModal, setShowChatModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [adminMessage, setAdminMessage] = useState("")
    const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null)
    const [filterDate, setFilterDate] = useState("")
    const [showWalletModal, setShowWalletModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState<any>(null)
    const [walletAmount, setWalletAmount] = useState("")
    const [walletType, setWalletType] = useState<'add' | 'deduct'>('add')
    const [walletReason, setWalletReason] = useState("")
    const [notifications, setNotifications] = useState<any[]>([])
    const prevUsersRef = useRef<any[]>([])

    const [editingDeposit, setEditingDeposit] = useState<any>(null)
    const [editedAmount, setEditedAmount] = useState("")

    const fetchingRef = useRef(false)

    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            await fetchUsers(false, controller.signal)
        }

        load()
        const interval = setInterval(() => {
            fetchUsers(true, controller.signal)
        }, 5000)

        return () => {
            clearInterval(interval)
            controller.abort()
        }
    }, [])

    const fetchUsers = async (silent = false, signal?: AbortSignal) => {
        const password = sessionStorage.getItem("adminSecret")
        if (!password) {
            router.push("/admin")
            return
        }

        if (fetchingRef.current) return
        fetchingRef.current = true

        if (!silent) setLoading(true)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
                signal
            })

            if (res.ok) {
                const data = await res.json()
                if (data.users) {
                    // Real-time notification logic - "Phone Message Style"
                    if (prevUsersRef.current.length > 0) {
                        data.users.forEach((u: any) => {
                            const prevU = prevUsersRef.current.find(p => p.id === u.id);
                            if (prevU) {
                                const newDeposits = (u.deposits?.filter((d: any) => d.status === 'Processing').length || 0) - (prevU.deposits?.filter((d: any) => d.status === 'Processing').length || 0);
                                if (newDeposits > 0) {
                                    const latestDeposit = [...u.deposits].reverse().find((d: any) => d.status === 'Processing');
                                    toast({
                                        title: "New Incoming Message",
                                        description: `Deposit Request from ${u.name} – ₹${latestDeposit.amount}`,
                                        className: "bg-green-600 border-0 text-white font-bold shadow-2xl rounded-2xl"
                                    });
                                    setNotifications(prev => [...prev, {
                                        id: Date.now().toString(),
                                        title: "New Deposit Alert",
                                        message: `New Deposit Request from ${u.name} – ₹${latestDeposit.amount}`,
                                        date: new Date().toISOString(),
                                        userId: u.id
                                    }]);
                                }
                            }
                        });
                    }
                    setUsers(data.users)
                    prevUsersRef.current = data.users
                }
            } else if (!silent) {
                if (res.status === 401) {
                    sessionStorage.removeItem("adminSecret")
                    router.push("/admin")
                }
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error("Admin Fetch Error:", error)
            }
        } finally {
            fetchingRef.current = false
            if (!silent) setLoading(false)
        }
    }

    const handleAction = async (transactionId: string, type: 'deposit' | 'withdraw', action: 'approve' | 'reject', overrideAmount?: string) => {
        const password = sessionStorage.getItem("adminSecret")
        setActionLoading(true)
        try {
            const res = await fetch('/api/admin/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminSecret: password,
                    userId: selectedUser?.id || editingDeposit?.userId,
                    transactionId,
                    type,
                    action,
                    amount: overrideAmount
                })
            })

            if (res.ok) {
                const data = await res.json()
                setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u))
                if (selectedUser) setSelectedUser(data.user)
                if (editingDeposit) setEditingDeposit(null)
                toast({ title: "Protocol Executed", description: `${type} ${action}ed successfully.` })
            } else {
                toast({ title: "Error", description: "Operation failed", variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Network failure", variant: "destructive" })
        } finally {
            setActionLoading(false);
            setEditingDeposit(null);
        }
    }

    const handleToggleBlock = async (user: any) => {
        const password = sessionStorage.getItem("adminSecret")
        setActionLoading(true)
        try {
            const res = await fetch('/api/admin/toggle-block', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminSecret: password, userId: user.id })
            })
            if (res.ok) {
                const data = await res.json()
                setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u))
                toast({ title: "User status updated", description: data.user.isBlocked ? "User Blocked" : "User Resumed" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
        } finally {
            setActionLoading(false)
        }
    }

    const handleEditWallet = async () => {
        const password = sessionStorage.getItem("adminSecret")
        setActionLoading(true)
        try {
            const res = await fetch('/api/admin/edit-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminSecret: password,
                    userId: selectedUser.id,
                    amount: walletAmount,
                    type: walletType,
                    reason: walletReason
                })
            })
            if (res.ok) {
                const data = await res.json()
                setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u))
                setSelectedUser(data.user)
                setShowWalletModal(false)
                setWalletAmount("")
                setWalletReason("")
                toast({ title: "Success", description: `Wallet ${walletType === 'add' ? 'credited' : 'debited'} successfully.` })
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to update wallet", variant: "destructive" })
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return
        const password = sessionStorage.getItem("adminSecret")
        setActionLoading(true)
        try {
            const res = await fetch('/api/admin/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminSecret: password, userId: userToDelete.id })
            })
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
                setShowDeleteModal(false)
                setUserToDelete(null)
                toast({ title: "User Deleted", description: "The account has been removed successfully." })
            }
        } catch (e) {
            toast({ title: "Error", description: "Request failed", variant: "destructive" })
        } finally {
            setActionLoading(false)
        }
    }

    const handleClearChat = async () => {
        if (!activeUser) return
        const password = sessionStorage.getItem("adminSecret")
        try {
            const res = await fetch('/api/admin/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminSecret: password, userId: activeUser.id, action: 'clear' })
            })
            if (res.ok) {
                toast({ title: "Chat Cleared", description: "All messages for this user have been removed." })
                fetchUsers(true)
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to clear chat", variant: "destructive" })
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem("adminSecret")
        router.push("/admin")
    }

    const stats = {
        total: users.length,
        active: users.filter(u => {
            if (!u.lastActive) return false;
            const diff = Date.now() - new Date(u.lastActive).getTime();
            return diff < 60000;
        }).length,
        pendingDeposits: users.reduce((acc, u) => acc + (u.deposits?.filter((d: any) => d.status === 'Processing').length || 0), 0),
        totalWallet: users.reduce((acc, u) => acc + (u.wallet || 0), 0)
    }

    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.includes(searchTerm);
        const matchesDate = !filterDate || (u.createdAt && u.createdAt.split('T')[0] === filterDate);
        return matchesSearch && matchesDate;
    })

    const activeUser = selectedUser ? users.find(u => u.id === selectedUser.id) || selectedUser : null;

    return (
        <div className="min-h-screen bg-[#F0FDF4] pb-20 font-sans selection:bg-green-100">
            <header className="bg-[#14532D] text-white shadow-2xl sticky top-0 z-50 border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-500 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-green-900/20">
                            <Shield className="h-full w-full text-white" />
                        </div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Green<span className="text-green-300">Admin</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                            <Calendar className="h-4 w-4 text-green-300" />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="bg-transparent text-sm font-bold focus:outline-none [color-scheme:dark]"
                            />
                        </div>

                        <div className="relative group cursor-pointer" onClick={() => setNotifications([])}>
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all relative">
                                <Bell className="h-5 w-5 text-green-100" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#14532D] animate-bounce">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right py-2 z-[100] border border-green-50">
                                <div className="px-4 py-2 border-b border-green-50 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alert Hub</span>
                                    <button onClick={() => setNotifications([])} className="text-[10px] text-green-600 font-bold">Clear All</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">No Active Alerts</p>
                                        </div>
                                    ) : (
                                        notifications.slice().reverse().map((n) => (
                                            <div key={n.id} className="px-4 py-3 border-b border-green-50 hover:bg-green-50 transition-colors cursor-pointer" onClick={() => { setSearchTerm(n.userId || ""); setNotifications([]); }}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                                                    <p className="text-[11px] font-black text-slate-900 uppercase">{n.title}</p>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{n.message}</p>
                                                <p className="text-[8px] text-slate-300 mt-1 uppercase font-black">{new Date(n.date).toLocaleTimeString()}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button onClick={() => router.push("/admin/casino")} className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-0 shadow-lg shadow-indigo-900/20 px-4">Casino Control</Button>
                        <Button onClick={handleLogout} variant="destructive" className="font-bold h-10 rounded-xl border-0 shadow-lg shadow-red-900/20">Exit Node</Button>

                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: stats.total, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
                        { label: 'Active Node', value: stats.active, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                        { label: 'Pending Auth', value: stats.pendingDeposits, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100' },
                        { label: 'Global Capital', value: `₹${stats.totalWallet.toLocaleString()}`, icon: Wallet, color: 'text-green-700', bg: 'bg-green-200/50' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-4 border-0 shadow-sm bg-white rounded-2xl flex items-center gap-3">
                            <div className={`${stat.bg} h-10 w-10 rounded-xl flex items-center justify-center shrink-0`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-lg font-black text-slate-900 leading-none mt-0.5">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search by Identity, Email or UID..."
                            className="h-12 pl-12 bg-white shadow-sm border-0 rounded-xl font-bold text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => fetchUsers()} className="h-12 px-4 rounded-xl bg-white shadow-sm border-0 hover:bg-green-50 transition-all text-green-600 font-bold">
                        <RefreshCw className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>

                {loading && !users.length ? (
                    <div className="text-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-green-600 mb-4 opacity-20" />
                        <p className="font-bold text-slate-300 uppercase tracking-[4px] text-xs">Syncing Core...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => {
                            const activePlan = user.plans?.find((p: any) => p.status === 'active');
                            const pendingDeposits = user.deposits?.filter((d: any) => d.status === 'Processing') || [];
                            return (
                                <Card key={user.id} className={`p-5 border border-green-50 shadow-sm rounded-[2rem] transition-all relative overflow-hidden bg-white ${user.isBlocked ? 'bg-red-50/30' : ''} group`}>
                                    {/* Desktop/Tablet Notification Badge */}
                                    {pendingDeposits.length > 0 && (
                                        <div className="absolute top-4 right-4 animate-bounce">
                                            <Badge className="bg-green-600 text-white border-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-green-200">
                                                New Deposit (₹{pendingDeposits[0].amount})
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center overflow-hidden shrink-0 relative">
                                                {user.profilePhoto ? <img src={user.profilePhoto} className="h-full w-full object-cover" /> : <div className="text-xl font-black text-green-600 uppercase">{user.name[0]}</div>}
                                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-white ${user.lastActive && (Date.now() - new Date(user.lastActive).getTime() < 60000) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-green-600 transition-colors uppercase">{user.name}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">ID: {user.id}</p>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-tight">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="p-3 bg-green-50/50 rounded-xl border border-green-50 cursor-pointer" onClick={() => { setSelectedUser(user); setShowWalletModal(true); }}>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Capital</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-black text-green-700 leading-none">₹{user.wallet.toFixed(0)}</p>
                                                <Edit3 className="h-3 w-3 text-green-300" />
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-50">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Nodes</p>
                                            <p className="text-lg font-black text-slate-900 leading-none">{user.plans?.length || 0}</p>
                                        </div>
                                    </div>

                                    {/* Real-time Deposit Card Detail */}
                                    {pendingDeposits.length > 0 && (
                                        <div className="mb-6 p-4 bg-green-600 rounded-2xl text-white shadow-lg shadow-green-100 border-0">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[9px] font-black uppercase tracking-[2px]">Pending Auth Needed</span>
                                                <Clock className="h-3 w-3 opacity-60" />
                                            </div>
                                            <h4 className="text-xl font-black mb-1 leading-none">₹{pendingDeposits[0].amount}</h4>
                                            <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest mb-3">{new Date(pendingDeposits[0].date).toLocaleString()}</p>
                                            <div className="flex gap-2">
                                                <Button onClick={() => handleAction(pendingDeposits[0].id, 'deposit', 'approve')} className="flex-1 h-8 bg-white text-green-600 hover:bg-green-50 font-black text-[9px] uppercase border-0">Approve</Button>
                                                <Button onClick={() => { setEditingDeposit({ ...pendingDeposits[0], userId: user.id }); setEditedAmount(pendingDeposits[0].amount.toString()); }} className="h-8 w-8 bg-white/20 text-white hover:bg-white/30 border-0 p-0 flex items-center justify-center"><Edit3 className="h-4 w-4" /></Button>
                                                <Button onClick={() => handleAction(pendingDeposits[0].id, 'deposit', 'reject')} className="h-8 w-8 bg-white/10 text-white hover:bg-white/20 border-0 p-0 flex items-center justify-center"><XCircle className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Button onClick={() => { setSelectedUser(user); setShowHistoryModal(true); }} className="flex-1 h-10 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[9px] uppercase tracking-widest border-0 shadow-sm transition-all active:scale-95">Deposits</Button>
                                            <Button onClick={() => { setSelectedUser(user); setShowWithdrawModal(true); }} className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-[9px] uppercase tracking-widest border-0 shadow-sm transition-all active:scale-95">Withdrawals</Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleToggleBlock(user)} className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[9px] uppercase tracking-widest border-0 transition-all">
                                                {user.isBlocked ? <Power className="h-3 w-3 mr-1.5 text-green-500" /> : <Power className="h-3 w-3 mr-1.5 text-red-400" />}
                                                {user.isBlocked ? 'Resume Account' : 'Freeze Access'}
                                            </Button>
                                            <Button onClick={() => { setSelectedUser(user); setShowChatModal(true); }} className="h-10 w-10 shrink-0 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all border-0 flex items-center justify-center"><Headphones className="h-4 w-4" /></Button>
                                        </div>
                                    </div>

                                    {user.referredBy && (
                                        <div className="mt-4 pt-3 border-t border-dashed border-slate-100 flex justify-between items-center opacity-40">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Upline: {user.referredBy}</span>
                                        </div>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* Wallet Modal */}
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
                <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
                    <Card className="p-8 rounded-[2.5rem] border-0 bg-white">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 uppercase tracking-tight">
                                <Wallet className="h-6 w-6 text-green-500" /> Capital Manager
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <button
                                    onClick={() => setWalletType('add')}
                                    className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${walletType === 'add' ? 'bg-white shadow-sm text-green-600' : 'text-slate-400'}`}
                                >
                                    <Plus className="h-3.5 w-3.5" /> Credit Node
                                </button>
                                <button
                                    onClick={() => setWalletType('deduct')}
                                    className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${walletType === 'deduct' ? 'bg-white shadow-sm text-red-500' : 'text-slate-400'}`}
                                >
                                    <Minus className="h-3.5 w-3.5" /> Debit Node
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-2">Transaction Value (₹)</p>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={walletAmount}
                                    onChange={(e) => setWalletAmount(e.target.value)}
                                    className="h-14 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-green-500/5 font-black text-xl px-5 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-2">Protocol Note</p>
                                <Input
                                    placeholder="e.g. Yield Adjustment, System Correction..."
                                    value={walletReason}
                                    onChange={(e) => setWalletReason(e.target.value)}
                                    className="h-12 rounded-xl border-slate-100 bg-slate-50 font-semibold text-sm px-5"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest text-slate-400" onClick={() => setShowWalletModal(false)}>Cancel</Button>
                                <Button
                                    onClick={handleEditWallet}
                                    disabled={actionLoading || !walletAmount}
                                    className={`flex-1 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg border-0 ${walletType === 'add' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-red-500 hover:bg-red-600 shadow-red-100'} text-white`}
                                >
                                    {actionLoading ? 'Writing...' : `Confirm ${walletType === 'add' ? 'Credit' : 'Debit'}`}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>

            {/* History Modal */}
            <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-white rounded-[3rem] shadow-3xl">
                    <div className="p-8">
                        <DialogHeader className="mb-8">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 uppercase tracking-tight">
                                    <Landmark className="h-6 w-6 text-green-500" /> Deposit Protocol
                                </DialogTitle>
                                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 cursor-pointer hover:bg-slate-100" onClick={() => setShowHistoryModal(false)}>✕</div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            {(activeUser?.deposits || []).slice().reverse().map((d: any) => (
                                <Card key={d.id} className="p-5 border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden bg-white hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold">₹</div>
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight">₹{d.amount}</h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(d.date).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Badge className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border-0 ${d.status === 'Processing' ? 'bg-amber-100 text-amber-700' : d.status === 'Approved' ? 'bg-green-600 text-white' : 'bg-red-100 text-red-700'}`}>{d.status}</Badge>
                                    </div>
                                    <div className="bg-slate-100/50 p-4 rounded-xl mb-4 space-y-2 border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">UTR Number</span>
                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider bg-white px-2 py-0.5 rounded-lg border border-slate-200">{d.utr || 'NOT_FOUND'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Gateway</span>
                                            <span className="text-[11px] font-bold text-green-600 uppercase">{d.method}</span>
                                        </div>
                                    </div>
                                    {d.screenshot && <Button onClick={() => setViewingScreenshot(d.screenshot)} variant="outline" className="w-full h-10 rounded-xl border-dashed border-slate-300 text-[10px] font-bold uppercase tracking-widest mb-4 hover:border-green-400 hover:text-green-600 transition-all">Audit Screenshot Proof</Button>}
                                    {d.status === 'Processing' && (
                                        <div className="flex gap-3">
                                            <Button onClick={() => handleAction(d.id, 'deposit', 'reject')} className="flex-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] border-0 transition-all">Reject</Button>
                                            <Button onClick={() => handleAction(d.id, 'deposit', 'approve')} className="flex-1 bg-green-600 text-white hover:bg-green-700 h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] border-0 shadow-lg shadow-green-100 transition-all">Approve</Button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                            {(activeUser?.deposits || []).length === 0 && (
                                <div className="text-center py-12 opacity-30">
                                    <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No Settlement History</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Withdraw Modal */}
            <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-white rounded-[3rem] shadow-3xl">
                    <div className="p-8">
                        <DialogHeader className="mb-8">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 uppercase tracking-tight">
                                    <ArrowUpCircle className="h-6 w-6 text-red-500" /> Payout Engine
                                </DialogTitle>
                                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 cursor-pointer hover:bg-slate-100" onClick={() => setShowWithdrawModal(false)}>✕</div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            {(activeUser?.withdrawals || []).slice().reverse().map((w: any) => (
                                <Card key={w.id} className="p-5 border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden bg-white hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter">₹{w.amount}</h4>
                                            <Badge className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border-0 ${w.status === 'Pending' ? 'bg-amber-100 text-amber-700' : w.status === 'Approved' || w.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-red-100 text-red-700'}`}>{w.status}</Badge>
                                        </div>
                                    </div>
                                    <div className="bg-slate-100/50 p-4 rounded-xl mb-6 space-y-2 border border-slate-100">
                                        <div className="flex justify-between border-b border-slate-200 pb-1.5 mb-1.5 opacity-80">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol Type</span>
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">{w.bankDetails?.type === 'bank' ? 'IMPS Bank Transfer' : 'UPI Instant Pay'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Receiver Name</span>
                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{w.bankDetails?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{w.bankDetails?.type === 'bank' ? 'Account Number' : 'VPA Address'}</span>
                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">{w.bankDetails?.accountNumber}</span>
                                        </div>
                                        {w.bankDetails?.type === 'bank' && (
                                            <div className="flex justify-between pt-1 border-t border-slate-200/50">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">IFSC Designation</span>
                                                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[2px]">{w.bankDetails?.ifsc}</span>
                                            </div>
                                        )}
                                    </div>
                                    {w.status === 'Pending' && (
                                        <div className="flex gap-3">
                                            <Button onClick={() => handleAction(w.id, 'withdraw', 'reject')} className="flex-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white h-11 rounded-xl font-bold uppercase tracking-widest text-[9px] border-0 transition-all">Reject Settlement</Button>
                                            <Button onClick={() => handleAction(w.id, 'withdraw', 'approve')} className="flex-1 bg-slate-900 text-white hover:bg-black h-11 rounded-xl font-bold uppercase tracking-widest text-[9px] border-0 shadow-lg shadow-slate-200 transition-all">Confirm Payout</Button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                            {(activeUser?.withdrawals || []).length === 0 && (
                                <div className="text-center py-12 opacity-30">
                                    <ArrowUpCircle className="h-12 w-12 mx-auto mb-4" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No Payout Requests</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Chat Modal */}
            <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
                <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 border-0 rounded-[3rem] bg-white overflow-hidden shadow-2xl">
                    <div className="p-6 bg-[#14532D] text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                <Headphones className="h-5 w-5 text-green-300" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg uppercase tracking-tight leading-none">Support Desk</h2>
                                <p className="text-[9px] text-green-300 font-bold uppercase tracking-[2px] mt-1">{activeUser?.name}</p>
                            </div>
                        </div>
                        <button onClick={handleClearChat} className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center text-red-300 hover:bg-white/20 transition-all border-0">
                            <Trash className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${activeUser?.lastActive && (Date.now() - new Date(activeUser.lastActive).getTime() < 60000) ? 'bg-green-500' : 'bg-slate-300'}`} />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">User Online</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">UID: {activeUser?.id?.slice(0, 8)}...</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white min-h-[400px]">
                        {(activeUser?.supportChats || []).map((chat: any) => (
                            <div key={chat.id} className={`flex ${chat.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-semibold leading-relaxed ${chat.sender === 'admin' ? 'bg-green-600 text-white rounded-tr-none shadow-lg shadow-green-100' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                                    {chat.message}
                                </div>
                            </div>
                        ))}
                        {(activeUser?.supportChats || []).length === 0 && (
                            <div className="h-full flex items-center justify-center opacity-20 flex-col py-10">
                                <Headphones className="h-12 w-12 mb-4" />
                                <p className="text-[10px] font-bold uppercase tracking-[4px]">No Encrypted Messages</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <Input value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} placeholder="Type secure reply..." className="h-12 rounded-xl bg-white border-slate-200 font-semibold text-sm px-5" onKeyPress={(e) => e.key === 'Enter' && adminMessage && handleAction} />
                        <Button
                            onClick={async () => {
                                if (!adminMessage) return;
                                const password = sessionStorage.getItem("adminSecret")
                                await fetch('/api/admin/support', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ adminSecret: password, userId: activeUser.id, message: adminMessage, action: 'reply' })
                                })
                                setAdminMessage("")
                                fetchUsers(true)
                            }}
                            className="h-12 w-12 rounded-xl premium-gradient text-white border-0 shadow-lg shadow-green-200 shrink-0 flex items-center justify-center"
                        >➤</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="max-w-sm p-0 border-0 bg-transparent">
                    <Card className="p-10 rounded-[2.5rem] border-0 bg-white text-center">
                        <div className="h-20 w-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-xl shadow-red-50">
                            <Trash2 className="h-10 w-10 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase">Purge Protocol?</h3>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed mb-10 max-w-[200px] mx-auto uppercase tracking-widest">
                            This will permanently delete the account and all associated vault data. This action is IRREVERSIBLE.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-widest border-0 shadow-xl shadow-red-100">
                                {actionLoading ? 'Purging...' : 'Confirm Purge'}
                            </Button>
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>

            {/* Proof View Modal */}
            <Dialog open={!!viewingScreenshot} onOpenChange={() => setViewingScreenshot(null)}>
                <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none overflow-hidden">
                    <img src={viewingScreenshot || ""} className="w-full h-auto rounded-[2rem] shadow-3xl border border-white/20" alt="Audit Proof" />
                    <button onClick={() => setViewingScreenshot(null)} className="absolute top-4 right-4 h-10 w-10 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center border border-white/20 hover:bg-black transition-all">✕</button>
                </DialogContent>
            </Dialog>
            {/* Verification Terminal (Edit Amount) */}
            <Dialog open={!!editingDeposit} onOpenChange={() => setEditingDeposit(null)}>
                <DialogContent className="max-w-sm p-0 border-0 bg-transparent">
                    <Card className="p-8 rounded-[2.5rem] border-0 bg-white">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 uppercase tracking-tight">
                                <Shield className="h-6 w-6 text-green-500" /> Verify Engine
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Incoming Value</p>
                                <p className="text-xl font-black text-slate-900 leading-none">₹{editingDeposit?.amount}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1">Overrule Amount (₹)</p>
                                <Input
                                    type="number"
                                    value={editedAmount}
                                    onChange={(e) => setEditedAmount(e.target.value)}
                                    className="h-14 rounded-xl border-slate-200 bg-white focus:ring-4 focus:ring-green-500/5 font-black text-2xl px-5 transition-all text-green-600"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={() => handleAction(editingDeposit.id, 'deposit', 'approve', editedAmount)}
                                    disabled={actionLoading || !editedAmount}
                                    className="flex-1 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-100"
                                >
                                    {actionLoading ? 'Syncing...' : 'Confirm & Activate'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    )
}

