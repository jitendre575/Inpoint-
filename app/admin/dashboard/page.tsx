"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogOut, RefreshCw, Search, Eye, ArrowUpCircle, Landmark, ImageIcon, Shield, CheckCircle2, XCircle, Clock, Headphones, Users, Activity, Wallet, Power, Edit3, Calendar, Bell, Plus, Minus, CreditCard, Trash2 } from "lucide-react"
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
                    // Real-time notification logic
                    if (prevUsersRef.current.length > 0) {
                        data.users.forEach((u: any) => {
                            const prevU = prevUsersRef.current.find(p => p.id === u.id);
                            if (prevU) {
                                // Check for new deposits
                                const newDeposits = (u.deposits?.length || 0) - (prevU.deposits?.length || 0);
                                if (newDeposits > 0) {
                                    const latestDeposit = u.deposits[u.deposits.length - 1];
                                    toast({
                                        title: "New Deposit Request",
                                        description: `User ${u.name} requested ₹${latestDeposit.amount}.`
                                    });
                                    setNotifications(prev => [...prev, {
                                        id: Date.now().toString(),
                                        title: "New Deposit",
                                        message: `₹${latestDeposit.amount} from ${u.name}`,
                                        date: new Date().toISOString()
                                    }]);
                                }
                                // Check for new withdrawals
                                const newWithdraws = (u.withdrawals?.length || 0) - (prevU.withdrawals?.length || 0);
                                if (newWithdraws > 0) {
                                    const latestWithdraw = u.withdrawals[u.withdrawals.length - 1];
                                    toast({
                                        title: "New Withdrawal Request",
                                        description: `User ${u.name} requested ₹${latestWithdraw.amount}.`
                                    });
                                    setNotifications(prev => [...prev, {
                                        id: Date.now().toString(),
                                        title: "New Withdrawal",
                                        message: `₹${latestWithdraw.amount} from ${u.name}`,
                                        date: new Date().toISOString()
                                    }]);
                                }
                                // Check for new chat messages
                                const newChats = (u.supportChats?.length || 0) - (prevU.supportChats?.length || 0);
                                if (newChats > 0) {
                                    toast({ title: "New Message", description: `User ${u.name} sent a message.` });
                                    setNotifications(prev => [...prev, {
                                        id: Date.now().toString(),
                                        title: "New Message",
                                        message: `From ${u.name}`,
                                        date: new Date().toISOString()
                                    }]);
                                }
                            }
                        });
                    }
                    setUsers(data.users)
                    prevUsersRef.current = data.users
                }
            } else if (!silent) {
                // If not silent and auth fails, kick back to login
                if (res.status === 401) {
                    sessionStorage.removeItem("adminSecret")
                    router.push("/admin")
                }
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error("Admin Fetch Error:", error)
                // Only show toast for manual refresh if it fails
                if (!silent) {
                    toast({
                        title: "Fetch Failed",
                        description: "Check server connection",
                        variant: "destructive"
                    })
                }
            }
        } finally {
            fetchingRef.current = false
            if (!silent) setLoading(false)
        }
    }

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
                toast({ title: "Success", description: `${type} ${action}ed.` })
            } else {
                toast({ title: "Error", description: "Action failed", variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" })
        } finally {
            setActionLoading(false);
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

    const handleEditAmount = async () => {
        const password = sessionStorage.getItem("adminSecret")
        setActionLoading(true)
        try {
            const res = await fetch('/api/admin/edit-transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminSecret: password,
                    userId: selectedUser.id,
                    transactionId: editData.id,
                    type: editData.type,
                    newAmount: parseFloat(editData.newAmount)
                })
            })
            if (res.ok) {
                const data = await res.json()
                setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u))
                setSelectedUser(data.user)
                setShowEditModal(false)
                toast({ title: "Success", description: "Amount updated successfully" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to update amount", variant: "destructive" })
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
            } else {
                const data = await res.json()
                toast({ title: "Delete Failed", description: data.message, variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Request failed", variant: "destructive" })
        } finally {
            setActionLoading(false)
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
            return diff < 60000; // Active in last 1 minute
        }).length,
        inactive: users.filter(u => u.plans?.length === 0).length,
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
        <div className="min-h-screen bg-[#F0F2F5] pb-20 font-sans">
            <header className="bg-neutral-900 text-white shadow-2xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1.5">
                            <img src="/icon.svg" alt="Logo" className="h-full w-full object-contain" />
                        </div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Inpoint<span className="text-emerald-500">Rose</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                            <Calendar className="h-4 w-4 text-emerald-400" />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="bg-transparent text-sm font-bold focus:outline-none [color-scheme:dark]"
                            />
                        </div>

                        <div className="relative group cursor-pointer" onClick={() => setNotifications([])}>
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all relative">
                                <Bell className="h-5 w-5 text-neutral-300" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-neutral-900 animate-bounce">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            {/* Dropdown for Notifications */}
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right py-2 z-[100] border border-neutral-100">
                                <div className="px-4 py-2 border-b border-neutral-50 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase">Notifications</span>
                                    <button onClick={() => setNotifications([])} className="text-[10px] text-indigo-600 font-bold">Clear All</button>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-6 text-center">
                                            <p className="text-[10px] text-neutral-300 font-bold italic">No new alerts</p>
                                        </div>
                                    ) : (
                                        notifications.slice().reverse().map((n) => (
                                            <div key={n.id} className="px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                                <p className="text-[11px] font-black text-neutral-900">{n.title}</p>
                                                <p className="text-[10px] text-neutral-500 font-medium">{n.message}</p>
                                                <p className="text-[8px] text-neutral-300 mt-1 uppercase font-black">{new Date(n.date).toLocaleTimeString()}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleLogout} variant="destructive" className="font-bold">Logout</Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Users', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Active Users', value: stats.active, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Inactive Users', value: stats.inactive, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
                        { label: 'Global Wallet', value: `₹${stats.totalWallet.toLocaleString()}`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 border-0 shadow-lg bg-white rounded-3xl flex items-center gap-4">
                            <div className={`${stat.bg} h-14 w-14 rounded-2xl flex items-center justify-center`}>
                                <stat.icon className={`h-7 w-7 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                            placeholder="Search by Name, Email or ID..."
                            className="h-14 pl-12 bg-white shadow-xl border-0 rounded-2xl font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => fetchUsers()} className="h-14 w-14 rounded-2xl bg-white shadow-xl border-0">
                        <RefreshCw className={`h-6 w-6 text-neutral-600 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {loading && !users.length ? (
                    <div className="text-center py-20">
                        <RefreshCw className="h-10 w-10 animate-spin mx-auto text-indigo-600 mb-4" />
                        <p className="font-bold text-neutral-400 uppercase tracking-widest">Initialising Node...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => {
                            const activePlan = user.plans?.find((p: any) => p.status === 'active');
                            return (
                                <Card key={user.id} className={`p-6 border-0 shadow-xl rounded-[2.5rem] transition-all relative overflow-hidden ${user.isBlocked ? 'bg-rose-50 ring-2 ring-rose-200' : activePlan ? 'bg-emerald-50/10' : 'bg-white'}`}>
                                    <div className="flex justify-between items-start mb-6 px-1">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
                                                {user.profilePhoto ? <img src={user.profilePhoto} className="h-full w-full object-cover" /> : <div className="text-xl font-black text-neutral-400">{user.name[0]}</div>}
                                                {/* Online Status Indicator */}
                                                <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${stats.active > 0 && user.lastActive && (Date.now() - new Date(user.lastActive).getTime() < 60000) ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-black text-neutral-900 text-lg leading-tight">{user.name}</h3>
                                                    {(user.supportChats?.filter((c: any) => c.sender === 'user' && !c.read).length || 0) > 0 && (
                                                        <Badge className="bg-rose-500 text-white animate-bounce h-5 px-1.5 min-w-[20px] flex items-center justify-center text-[10px] rounded-full shadow-lg border-2 border-white">
                                                            {user.supportChats.filter((c: any) => c.sender === 'user' && !c.read).length}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-400 font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end pt-1">
                                            {activePlan && <Badge className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5">Active Plan</Badge>}
                                            <Badge className={`text-[8px] font-black uppercase px-2 py-0.5 ${user.isBlocked ? 'bg-rose-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{user.isBlocked ? 'Blocked' : 'User Active'}</Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-[#F8F9FD] rounded-2xl relative group cursor-pointer" onClick={() => { setSelectedUser(user); setShowWalletModal(true); }}>
                                            <p className="text-[10px] text-neutral-400 font-black uppercase mb-1">Wallet</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-black text-emerald-600">₹{user.wallet.toFixed(0)}</p>
                                                <Edit3 className="h-3 w-3 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-[#F8F9FD] rounded-2xl">
                                            <p className="text-[10px] text-neutral-400 font-black uppercase mb-1">Referral</p>
                                            <p className="text-lg font-black text-indigo-600">{user.referralCode || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Quick Transaction Summary */}
                                    <div className="mb-6 px-1 space-y-2">
                                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest pl-1">Recent Transactions</p>
                                        {[...(user.deposits || []), ...(user.withdrawals || [])]
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .slice(0, 2)
                                            .map((t, i) => (
                                                <div key={i} className="flex items-center justify-between text-[11px] font-bold bg-white/50 p-2 rounded-xl border border-neutral-100/50">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${t.status === 'Approved' || t.status === 'Completed' ? 'bg-emerald-500' : t.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                        <span className="text-neutral-600">{t.method ? 'Deposit' : 'Withdraw'}</span>
                                                    </div>
                                                    <span className={t.method ? 'text-emerald-600' : 'text-rose-600'}>₹{t.amount}</span>
                                                </div>
                                            ))}
                                        {[...(user.deposits || []), ...(user.withdrawals || [])].length === 0 && <p className="text-[10px] text-neutral-300 italic pl-1">No transactions yet</p>}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Button onClick={() => { setSelectedUser(user); setShowHistoryModal(true); }} className="flex-1 h-12 rounded-2xl bg-neutral-900 hover:bg-black font-black text-[10px] uppercase">Deposits</Button>
                                            <Button onClick={() => { setSelectedUser(user); setShowWithdrawModal(true); }} className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-[10px] uppercase">Withdrawals</Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleToggleBlock(user)} className={`flex-1 h-12 rounded-2xl font-black text-[10px] uppercase ${user.isBlocked ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                <Power className="h-3 w-3 mr-2" /> {user.isBlocked ? 'Resume' : 'Block'}
                                            </Button>
                                            <Button onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }} className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100"><Trash2 className="h-5 w-5" /></Button>
                                            <Button onClick={() => { setSelectedUser(user); setShowChatModal(true); }} className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600"><Headphones className="h-5 w-5" /></Button>
                                        </div>
                                    </div>

                                    {user.referredBy && (
                                        <div className="mt-4 pt-3 border-t border-dashed border-neutral-100 flex justify-between items-center">
                                            <span className="text-[9px] font-black text-neutral-400 uppercase">Referred By:</span>
                                            <span className="text-[9px] font-black text-indigo-500">{user.referredBy}</span>
                                        </div>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* Wallet Edit Modal */}
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
                <DialogContent className="max-w-md p-8 rounded-[3rem] border-0 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <Wallet className="h-7 w-7 text-emerald-500" /> Wallet Manager
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="flex bg-neutral-100 p-1.5 rounded-2xl">
                            <button
                                onClick={() => setWalletType('add')}
                                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${walletType === 'add' ? 'bg-white shadow-sm text-emerald-600' : 'text-neutral-400'}`}
                            >
                                <Plus className="h-4 w-4" /> Add Balance
                            </button>
                            <button
                                onClick={() => setWalletType('deduct')}
                                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${walletType === 'deduct' ? 'bg-white shadow-sm text-rose-600' : 'text-neutral-400'}`}
                            >
                                <Minus className="h-4 w-4" /> Deduct
                            </button>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest px-2">Enter Amount (₹)</p>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={walletAmount}
                                onChange={(e) => setWalletAmount(e.target.value)}
                                className="h-16 rounded-2xl border-2 focus:border-indigo-500 font-black text-2xl px-6"
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest px-2">Reason for modification</p>
                            <Input
                                placeholder="e.g. Compensation, Withdrawal adjustment..."
                                value={walletReason}
                                onChange={(e) => setWalletReason(e.target.value)}
                                className="h-14 rounded-2xl border-2 focus:border-indigo-500 font-bold"
                            />
                        </div>

                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-amber-100 shrink-0">
                                <Shield className="h-5 w-5 text-amber-500" />
                            </div>
                            <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">Important: This action is permanent and will be logged in user's history.</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black uppercase text-xs" onClick={() => setShowWalletModal(false)}>Cancel</Button>
                            <Button
                                onClick={handleEditWallet}
                                disabled={actionLoading || !walletAmount}
                                className={`flex-1 h-14 rounded-2xl font-black uppercase text-xs shadow-xl ${walletType === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                            >
                                {actionLoading ? 'Saving...' : `Confirm ${walletType === 'add' ? 'Credit' : 'Debit'}`}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Existing Modals... */}
            {/* Withdraw Modal with Amount Edit */}
            <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-[3rem] border-0 bg-white">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <ArrowUpCircle className="h-7 w-7 text-rose-500" /> Withdraw Controls
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        {(activeUser?.withdrawals || []).slice().reverse().map((w: any) => (
                            <Card key={w.id} className="p-6 border border-neutral-100 shadow-sm rounded-3xl">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-2xl font-black">₹{w.amount}</h4>
                                        <Badge className={w.status === 'Pending' ? 'bg-amber-500' : w.status === 'Approved' || w.status === 'Completed' ? 'bg-emerald-500' : 'bg-rose-500'}>{w.status}</Badge>
                                    </div>
                                    <Button onClick={() => { setEditData({ id: w.id, type: 'withdraw', amount: w.amount, newAmount: w.amount }); setShowEditModal(true); }} size="sm" variant="ghost">
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="bg-neutral-50 p-4 rounded-2xl mb-6 text-sm font-medium">
                                    <p>Account: {w.bankDetails?.accountNumber}</p>
                                    <p>Name: {w.bankDetails?.name}</p>
                                    <p>IFSC: {w.bankDetails?.ifsc}</p>
                                </div>
                                {w.status === 'Pending' && (
                                    <div className="flex gap-3">
                                        <Button onClick={() => handleAction(w.id, 'withdraw', 'reject')} className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 h-12 rounded-xl border-0">Reject</Button>
                                        <Button onClick={() => handleAction(w.id, 'withdraw', 'approve')} className="flex-1 bg-neutral-900 text-white hover:bg-black h-12 rounded-xl">Approve</Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* History/Deposit Modal with Amount Edit */}
            <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-[3rem] border-0 bg-white">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <Landmark className="h-7 w-7 text-emerald-500" /> User Transaction Hub
                        </DialogTitle>
                    </DialogHeader>

                    {/* Wallet Adjustment History */}
                    {(activeUser?.walletHistory || []).length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 px-2">Wallet Manual Adjustments</h3>
                            <div className="space-y-3">
                                {activeUser.walletHistory.slice().reverse().map((h: any, i: number) => (
                                    <div key={i} className={`p-4 rounded-2xl border flex justify-between items-center ${h.type === 'add' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                        <div>
                                            <p className="font-bold text-sm">{h.reason}</p>
                                            <p className="text-[10px] uppercase font-black opacity-50">{new Date(h.date).toLocaleString()}</p>
                                        </div>
                                        <p className={`font-black ${h.type === 'add' ? 'text-emerald-600' : 'text-rose-600'}`}>{h.type === 'add' ? '+' : '-'}₹{h.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 px-2">Deposit History</h3>
                        {(activeUser?.deposits || []).slice().reverse().map((d: any) => (
                            <Card key={d.id} className="p-6 border border-neutral-100 shadow-sm rounded-3xl">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-2xl font-black">₹{d.amount}</h4>
                                        <Badge className={d.status === 'Processing' ? 'bg-amber-500' : d.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}>{d.status}</Badge>
                                    </div>
                                    <Button onClick={() => { setEditData({ id: d.id, type: 'deposit', amount: d.amount, newAmount: d.amount }); setShowEditModal(true); }} size="sm" variant="ghost">
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="bg-neutral-50 p-4 rounded-2xl mb-4 text-xs font-medium">
                                    <p>Method: {d.method}</p>
                                    <p>UTR: {d.utr || 'N/A'}</p>
                                    <p>Date: {new Date(d.date).toLocaleString()}</p>
                                </div>
                                {d.screenshot && <Button onClick={() => setViewingScreenshot(d.screenshot)} variant="outline" className="mb-4 w-full h-12 rounded-xl">View Payment Proof</Button>}
                                {d.status === 'Processing' && (
                                    <div className="flex gap-3">
                                        <Button onClick={() => handleAction(d.id, 'deposit', 'reject')} className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 h-12 rounded-xl">Reject</Button>
                                        <Button onClick={() => handleAction(d.id, 'deposit', 'approve')} className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 h-12 rounded-xl shadow-lg shadow-emerald-600/20">Approve</Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Amount Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-sm p-8 rounded-[2.5rem] border-0 bg-white">
                    <DialogHeader><DialogTitle className="font-black text-xl">Edit Transaction Amount</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <p className="text-[10px] text-neutral-400 font-black uppercase mb-2">New Amount (₹)</p>
                        <Input
                            type="number"
                            value={editData?.newAmount || ""}
                            onChange={(e) => setEditData({ ...editData, newAmount: e.target.value })}
                            className="h-14 rounded-2xl border-2 focus:border-indigo-500 font-black text-xl"
                        />
                        <p className="text-[10px] text-rose-400 mt-2 font-bold uppercase">* Changing this will immediately affect user wallet if already approved.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => setShowEditModal(false)} variant="ghost" className="flex-1">Cancel</Button>
                        <Button onClick={handleEditAmount} className="flex-1 bg-indigo-600 text-white rounded-xl">Update</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Chat Modal */}
            <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
                <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0 border-0 rounded-[2.5rem] bg-white overflow-hidden shadow-2xl">
                    <div className="p-6 bg-neutral-900 text-white">
                        <h2 className="font-black text-xl">Support Chat</h2>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{activeUser?.name}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50 min-h-[300px]">
                        {(activeUser?.supportChats || []).map((chat: any) => (
                            <div key={chat.id} className={`flex ${chat.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${chat.sender === 'admin' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-neutral-800 border-0 border-neutral-100 rounded-tl-none shadow-sm'}`}>
                                    {chat.message}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white border-t flex gap-2">
                        <Input value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} placeholder="Type a reply..." className="h-12 rounded-xl" />
                        <Button
                            onClick={async () => {
                                const password = sessionStorage.getItem("adminSecret")
                                await fetch('/api/admin/support', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ adminSecret: password, userId: activeUser.id, message: adminMessage, action: 'reply' })
                                })
                                setAdminMessage("")
                                fetchUsers(true)
                            }}
                            className="h-12 w-12 rounded-xl bg-indigo-600 text-white"
                        >➤</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="max-w-sm p-8 rounded-[2.5rem] border-0 bg-white">
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl text-rose-600 flex items-center gap-2">
                            <Trash2 className="h-6 w-6" /> Delete Account?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-neutral-500 font-medium">Are you sure you want to delete <span className="font-black text-neutral-900">{userToDelete?.name}</span>'s account?</p>
                        <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest leading-relaxed">This will immediately disable their login and remove their data. Transactions will be kept for records.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => setShowDeleteModal(false)} variant="ghost" className="flex-1 font-bold">Cancel</Button>
                        <Button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black uppercase text-[10px]">
                            {actionLoading ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Screenshot Viewer */}
            {viewingScreenshot && (
                <Dialog open={!!viewingScreenshot} onOpenChange={() => setViewingScreenshot(null)}>
                    <DialogContent className="max-w-xl p-4 bg-transparent shadow-none border-0">
                        <img src={viewingScreenshot} className="w-full rounded-[2rem] shadow-2xl border-4 border-white" />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
