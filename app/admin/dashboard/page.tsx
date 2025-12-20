"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogOut, RefreshCw, Search, Eye, ArrowUpCircle, ArrowDownCircle, Banknote, ImageIcon, EyeOff } from "lucide-react"
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

    const [userTypingOfId, setUserTypingOfId] = useState<string | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchUsers() // Initial load

        // Polling (every 3s)
        const interval = setInterval(() => {
            fetchUsers(true)
        }, 3000)

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
            // Note: In a real app we would use optimistic updates or differencing, 
            // but for this JSON file setup, we just replace the list.
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (res.ok) {
                const data = await res.json()
                setUsers(data.users)

                // Check if the currently selected user (in chat) is typing
                // We need to traverse users to find typing status
                let foundTypingId: string | null = null;
                data.users.forEach((u: any) => {
                    if (u.lastTyping && u.lastTyping.sender === 'user' && u.lastTyping.isTyping) {
                        // Check timestamp validity (<5s)
                        const timeDiff = new Date().getTime() - new Date(u.lastTyping.timestamp).getTime()
                        if (timeDiff < 5000) {
                            foundTypingId = u.id;
                        }
                    }
                });
                setUserTypingOfId(foundTypingId);

                // If chat modal is open, we should update selectedUser reference to show new messages
                // But we can't depend on closure variable `selectedUser` easily inside this helper if it wasn't a ref.
                // However, `selectedUser` is state. We have to be careful.
                // We can't update selectedUser inside here easily without causing loops if we use it in dependency.
                // Instead, we derive the chat data in the render from `users` array + `selectedUser.id`.
            } else {
                if (!silent) {
                    sessionStorage.removeItem("adminSecret")
                    router.push("/admin")
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            if (!silent) setLoading(false)
        }
    }

    // Calculate total unread (from users to admin)
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
                // Refresh Users
                await fetchUsers();
                // Close modals
                setShowWithdrawModal(false);
            } else {
                alert("Action failed");
            }
        } catch (error) {
            alert("Error processing action");
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
                // Determine new chat structure or just refetch users
                await fetchUsers();
                setAdminMessage("")
                // Optimistically update selected user chat to show new message immediately if we want
                // But fetchUsers resets state, so we might need to find selectedUser again to keep modal updated?
                // Actually, `fetchUsers` updates `users` state. 
                // We need to update `selectedUser` reference too if it's open.
                // Or better, just close and reopen? No, that's bad UX.
                // Let's implement a refetch effect or manually update selectedUser.

                // For simplicity, we just refetch and find the user again.
                // Note: user state update is async, so this might be tricky in one go.
                // Let's just rely on the effect of users updating? No, local `selectedUser` is static.
                const updatedRes = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });
                const data = await updatedRes.json();
                setUsers(data.users);
                const updatedUser = data.users.find((u: any) => u.id === selectedUser.id);
                setSelectedUser(updatedUser);
            }
        } catch (error) {
            console.error("Reply failed")
        } finally {
            setActionLoading(false)
        }
    }

    const markChatRead = async (user: any) => {
        // Optimistically mark local state
        const password = sessionStorage.getItem("adminSecret")
        // Fire and forget
        fetch('/api/admin/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminSecret: password,
                userId: user.id,
                action: 'mark_read'
            })
        }).then(() => fetchUsers())
    }

    const handleLogout = () => {
        sessionStorage.removeItem("adminSecret")
        router.push("/admin")
    }

    const openHistoryModal = (user: any) => {
        setSelectedUser(user);
        setShowHistoryModal(true);
    }

    const openWithdrawModal = (user: any) => {
        setSelectedUser(user);
        setShowWithdrawModal(true);
    }

    const openChatModal = (user: any) => {
        setSelectedUser(user);
        setShowChatModal(true);
        // If there are unread messages, mark them as read when opening
        if (user.supportChats?.some((c: any) => c.sender === 'user' && !c.read)) {
            markChatRead(user);
        }
    }

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm)
    )

    const togglePasswordVisibility = (userId: string) => {
        setVisiblePasswordId(prev => prev === userId ? null : userId)
    }

    const handleAdminTyping = (text: string) => {
        setAdminMessage(text)

        if (!selectedUser) return

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        } else {
            sendTypingStatus(true)
        }

        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false)
            typingTimeoutRef.current = null
        }, 1000)
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
        } catch (e) {
            // ignore
        }
    }

    // Derived active user for live chat
    const activeUser = selectedUser ? users.find(u => u.id === selectedUser.id) || selectedUser : null;

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <header className="bg-neutral-900 text-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-xs text-neutral-400">Manage Users & Withdrawals</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative">
                            <div className="p-2 bg-neutral-800 rounded-full">
                                <span className="text-xl">🔔</span>
                            </div>
                            {totalUnreadSupport > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full border-2 border-neutral-900 font-bold">
                                    {totalUnreadSupport}
                                </span>
                            )}
                        </div>

                        <Button
                            onClick={handleLogout}
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Search & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by ID, Name or Email..."
                            className="pl-10 h-11 bg-white shadow-sm border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => fetchUsers()} variant="outline" size="icon" className="bg-white shadow-sm">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Users Cards Grid */}
                {loading && !users.length ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-emerald-600" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No users found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => {
                            const pendingWithdrawals = user.withdrawals?.filter((w: any) => w.status === 'Pending').length || 0;
                            const unreadChats = user.supportChats?.filter((c: any) => c.sender === 'user' && !c.read).length || 0;
                            const hasPending = pendingWithdrawals > 0;
                            const hasUnread = unreadChats > 0;
                            const totalDeposits = user.deposits?.reduce((acc: number, curr: any) => acc + (curr.status === 'Approved' ? curr.amount : 0), 0) || 0;
                            const totalWithdrawals = user.withdrawals?.reduce((acc: number, curr: any) => acc + (curr.status === 'Completed' ? curr.amount : 0), 0) || 0;

                            const isPasswordVisible = visiblePasswordId === user.id;

                            return (
                                <Card key={user.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group select-none">
                                    <div className={`h-1.5 w-full ${hasPending ? 'bg-orange-500 animate-pulse' : hasUnread ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">{user.name}</h3>
                                                <p className="text-xs text-gray-500 font-mono mt-1">ID: {user.id}</p>
                                                <p className="text-sm text-gray-600 mt-0.5 mb-2">{user.email}</p>

                                                {/* Password Row */}
                                                <div className="flex items-center gap-2 mt-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 w-fit">
                                                    <span className="text-xs font-semibold text-gray-500">Pass:</span>
                                                    <span className="text-sm font-mono font-medium text-gray-800">
                                                        {isPasswordVisible ? user.password || "N/A" : "******"}
                                                    </span>
                                                    <button
                                                        onClick={() => togglePasswordVisibility(user.id)}
                                                        className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                                    >
                                                        {isPasswordVisible ? (
                                                            <EyeOff className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Eye className="h-3.5 w-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end">
                                                {hasPending && (
                                                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 animate-pulse">
                                                        Action Req.
                                                    </Badge>
                                                )}
                                                {hasUnread && (
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 animate-pulse flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                                        {unreadChats} New Msg
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500">Wallet Balance</span>
                                                <span className="text-lg font-bold text-emerald-600">₹{user.wallet.toFixed(2)}</span>
                                            </div>
                                            <div className="h-px bg-gray-200 my-2" />
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-400 text-xs">Total Deposit</p>
                                                    <p className="font-semibold text-gray-900">₹{totalDeposits}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-xs">Total Withdraw</p>
                                                    <p className="font-semibold text-gray-900">₹{totalWithdrawals}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <Button
                                                onClick={() => openHistoryModal(user)}
                                                variant="outline"
                                                className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 px-0"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => openChatModal(user)}
                                                className={`w-full ${hasUnread ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} border-0 px-0 relative`}
                                            >
                                                <span className="mr-1">💬</span> Chat
                                                {hasUnread && <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white -mt-1 -mr-1"></span>}
                                            </Button>
                                            <Button
                                                onClick={() => openWithdrawModal(user)}
                                                className={`w-full ${hasPending ? 'bg-orange-500 hover:bg-orange-600' : 'bg-neutral-800 hover:bg-neutral-900'} text-white border-0 px-0`}
                                            >
                                                <ArrowUpCircle className="h-4 w-4" />
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
                <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b border-gray-100 bg-gray-50">
                        <DialogTitle className="flex items-center gap-2">
                            Chat with {activeUser?.name}
                            {activeUser?.supportChats?.some((c: any) => c.sender === 'user' && !c.read) && (
                                <Badge className="bg-red-500">Unread</Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100/50">
                        {(!activeUser?.supportChats || activeUser.supportChats.length === 0) ? (
                            <p className="text-center text-gray-400 py-10">No messages yet.</p>
                        ) : (
                            activeUser.supportChats.map((chat: any) => (
                                <div key={chat.id} className={`flex ${chat.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${chat.sender === 'admin'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                        }`}>
                                        <p>{chat.message}</p>
                                        <p className={`text-[10px] mt-1 text-right ${chat.sender === 'admin' ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {userTypingOfId === activeUser?.id && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 text-gray-500 text-xs py-2 px-3 rounded-2xl rounded-tl-none italic animate-pulse">
                                    User is typing...
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <Input
                            value={adminMessage}
                            onChange={(e) => handleAdminTyping(e.target.value)}
                            placeholder="Type a reply..."
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleSupportReply()}
                        />
                        <Button onClick={handleSupportReply} disabled={actionLoading} size="icon" className="bg-blue-600 hover:bg-blue-700">
                            <div className="text-white">➤</div>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* History Modal (View Only for Deposits) */}
            <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Transaction History - {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Recent Deposits</h4>
                            <div className="space-y-2">
                                {(selectedUser?.deposits || []).slice().reverse().slice(0, 10).map((deposit: any) => (
                                    <div key={deposit.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-900">₹{deposit.amount}</p>
                                            <p className="text-xs text-gray-500">{new Date(deposit.date).toLocaleString()}</p>
                                            <p className="text-xs text-gray-400">Method: {deposit.method || 'Manual'}</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">{deposit.status}</Badge>
                                    </div>
                                ))}
                                {!selectedUser?.deposits?.length && <p className="text-sm text-gray-400 italic">No deposits found.</p>}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Withdraw Action Modal */}
            <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Withdraw Requests - {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {(selectedUser?.withdrawals || []).slice().reverse().map((withdrawal: any) => (
                            <Card key={withdrawal.id} className="p-4 border shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-bold text-gray-900">₹{withdrawal.amount}</p>
                                            <Badge className={
                                                withdrawal.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    withdrawal.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }>{withdrawal.status}</Badge>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                                            <p><span className="text-gray-500">Bank Name:</span> <span className="font-semibold">{withdrawal.bankDetails.name}</span></p>
                                            <p><span className="text-gray-500">Account/UPI:</span> <span className="font-mono font-semibold">{withdrawal.bankDetails.accountNumber}</span></p>
                                            <p><span className="text-gray-500">IFSC:</span> <span className="font-mono">{withdrawal.bankDetails.ifsc}</span></p>
                                        </div>
                                        <p className="text-xs text-gray-400">{new Date(withdrawal.date).toLocaleString()}</p>
                                    </div>
                                </div>

                                {withdrawal.status === 'Pending' && (
                                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                        <Button
                                            onClick={() => handleAction(withdrawal.id, 'withdraw', 'reject')}
                                            disabled={actionLoading}
                                            variant="destructive" size="sm"
                                            className="px-6"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(withdrawal.id, 'withdraw', 'approve')}
                                            disabled={actionLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6" size="sm"
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                        {!selectedUser?.withdrawals?.length && <p className="text-center text-gray-500 py-4">No withdraw history.</p>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
