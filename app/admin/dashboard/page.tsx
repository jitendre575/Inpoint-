"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogOut, RefreshCw, Search, Eye, ArrowUpCircle, Landmark, ImageIcon, Shield, CheckCircle2, XCircle, Clock, Headphones, Users, Activity, Wallet, Power, Edit3 } from "lucide-react"
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

    const fetchingRef = useRef(false)

    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            await fetchUsers(false, controller.signal)
        }

        load()
        const interval = setInterval(() => {
            fetchUsers(true, controller.signal)
        }, 15000)

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
                    setUsers(data.users)
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

    const handleLogout = () => {
        sessionStorage.removeItem("adminSecret")
        router.push("/admin")
    }

    const stats = {
        total: users.length,
        active: users.filter(u => u.plans?.some((p: any) => p.status === 'active')).length,
        inactive: users.filter(u => !u.plans?.some((p: any) => p.status === 'active')).length,
        totalWallet: users.reduce((acc, u) => acc + (u.wallet || 0), 0)
    }

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm)
    )

    const activeUser = selectedUser ? users.find(u => u.id === selectedUser.id) || selectedUser : null;

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-20 font-sans">
            <header className="bg-neutral-900 text-white shadow-2xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Admin<span className="text-emerald-500">Dashboard</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
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
                                            <div className="h-14 w-14 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                                {user.profilePhoto ? <img src={user.profilePhoto} className="h-full w-full object-cover" /> : <div className="text-xl font-black text-neutral-400">{user.name[0]}</div>}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-neutral-900 text-lg leading-tight">{user.name}</h3>
                                                <p className="text-xs text-neutral-400 font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end pt-1">
                                            {activePlan && <Badge className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5">Active Plan</Badge>}
                                            <Badge className={`text-[8px] font-black uppercase px-2 py-0.5 ${user.isBlocked ? 'bg-rose-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{user.isBlocked ? 'Blocked' : 'User Active'}</Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-[#F8F9FD] rounded-2xl">
                                            <p className="text-[10px] text-neutral-400 font-black uppercase mb-1">Wallet</p>
                                            <p className="text-lg font-black text-emerald-600">₹{user.wallet.toFixed(0)}</p>
                                        </div>
                                        <div className="p-4 bg-[#F8F9FD] rounded-2xl">
                                            <p className="text-[10px] text-neutral-400 font-black uppercase mb-1">Referral</p>
                                            <p className="text-lg font-black text-indigo-600">{user.referralCode || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Button onClick={() => { setSelectedUser(user); setShowHistoryModal(true); }} className="flex-1 h-12 rounded-2xl bg-neutral-900 hover:bg-black font-black text-[10px] uppercase">Deposits</Button>
                                            <Button onClick={() => { setSelectedUser(user); setShowWithdrawModal(true); }} className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-[10px] uppercase">Withdrawals</Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleToggleBlock(user)} className={`flex-1 h-12 rounded-2xl font-black text-[10px] uppercase ${user.isBlocked ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                <Power className="h-3 w-3 mr-2" /> {user.isBlocked ? 'Resume Account' : 'Block Account'}
                                            </Button>
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
                            <Landmark className="h-7 w-7 text-emerald-500" /> Deposit Controls
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
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
