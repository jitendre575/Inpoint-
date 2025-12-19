"use client"

import { useEffect, useState } from "react"
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
import { LogOut, RefreshCw, Search, Eye, ArrowUpCircle, ArrowDownCircle, Banknote, ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal State
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        const password = sessionStorage.getItem("adminSecret")
        if (!password) {
            router.push("/admin")
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (res.ok) {
                const data = await res.json()
                setUsers(data.users)
            } else {
                sessionStorage.removeItem("adminSecret")
                router.push("/admin")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
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

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm)
    )

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <header className="bg-neutral-900 text-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-xs text-neutral-400">Manage Users & Withdrawals</p>
                    </div>
                    <div className="flex items-center gap-4">
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
                {loading ? (
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
                            const hasPending = pendingWithdrawals > 0;
                            const totalDeposits = user.deposits?.reduce((acc: number, curr: any) => acc + (curr.status === 'Approved' ? curr.amount : 0), 0) || 0;
                            const totalWithdrawals = user.withdrawals?.reduce((acc: number, curr: any) => acc + (curr.status === 'Completed' ? curr.amount : 0), 0) || 0;

                            return (
                                <Card key={user.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
                                    <div className={`h-1.5 w-full ${hasPending ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">{user.name}</h3>
                                                <p className="text-xs text-gray-500 font-mono mt-1">ID: {user.id}</p>
                                                <p className="text-sm text-gray-600 mt-0.5 mb-2">{user.email}</p>
                                            </div>
                                            {hasPending && (
                                                <Badge className="bg-orange-100 text-orange-800 border-orange-200 animate-pulse">
                                                    Action Req.
                                                </Badge>
                                            )}
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

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                onClick={() => openHistoryModal(user)}
                                                variant="outline"
                                                className="w-full border-gray-200 hover:bg-gray-50 text-gray-700"
                                            >
                                                <Eye className="h-4 w-4 mr-2" /> History
                                            </Button>
                                            <Button
                                                onClick={() => openWithdrawModal(user)}
                                                className={`w-full ${hasPending ? 'bg-orange-500 hover:bg-orange-600' : 'bg-neutral-800 hover:bg-neutral-900'} text-white border-0`}
                                            >
                                                <ArrowUpCircle className="h-4 w-4 mr-2" />
                                                {hasPending ? 'Requests' : 'Withdraws'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>

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
