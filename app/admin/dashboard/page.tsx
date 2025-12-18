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
    const [showDepositModal, setShowDepositModal] = useState(false)
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
                setShowDepositModal(false);
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

    const openDepositModal = (user: any) => {
        setSelectedUser(user);
        setShowDepositModal(true);
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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-neutral-900 text-white shadow-md">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-neutral-400">Restricted Access</span>
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                        <p className="text-gray-500">View and track all registered users.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search ID, Name or Email"
                                className="pl-9 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => fetchUsers()} variant="outline" size="icon">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <Card className="shadow-sm border-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[100px]">User ID</TableHead>
                                    <TableHead>User Details</TableHead>
                                    <TableHead>Password</TableHead>
                                    <TableHead className="text-right">Wallet</TableHead>
                                    <TableHead>Requests</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">Loading data...</TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">No users found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-mono text-xs text-gray-500">{user.id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{user.name}</span>
                                                    <span className="text-xs text-gray-500">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                    {user.password}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-emerald-600">
                                                ₹{user.wallet.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => openDepositModal(user)} size="sm" variant="outline" className="gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                                                        <ArrowDownCircle className="h-4 w-4" /> Deposit
                                                        {user.deposits?.some((d: any) => d.status === 'Pending') && (
                                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                        )}
                                                    </Button>
                                                    <Button onClick={() => openWithdrawModal(user)} size="sm" variant="outline" className="gap-2 border-orange-200 hover:bg-orange-50 text-orange-700">
                                                        <ArrowUpCircle className="h-4 w-4" /> Withdraw
                                                        {user.withdrawals?.some((w: any) => w.status === 'Pending') && (
                                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </main>

            {/* Deposit Modal */}
            <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Deposit Requests - {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {(selectedUser?.deposits || []).slice().reverse().map((deposit: any) => (
                            <Card key={deposit.id} className="p-4 border">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 space-y-2">
                                        <p className="text-sm text-gray-500">Transaction ID: {deposit.id}</p>
                                        <p className="text-lg font-bold text-gray-900">₹{deposit.amount}</p>
                                        <p className="text-sm">UTR: <span className="font-mono font-bold">{deposit.utr}</span></p>
                                        <p className="text-xs text-gray-400">{new Date(deposit.date).toLocaleString()}</p>
                                        <Badge className={
                                            deposit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                deposit.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }>{deposit.status}</Badge>
                                    </div>

                                    <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden border relative group">
                                        {deposit.screenshotUrl ? (
                                            <a href={deposit.screenshotUrl} target="_blank" rel="noopener noreferrer">
                                                <img src={deposit.screenshotUrl} alt="Screenshot" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Eye className="text-white" />
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <ImageIcon className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {deposit.status === 'Pending' && (
                                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                        <Button
                                            onClick={() => handleAction(deposit.id, 'deposit', 'reject')}
                                            disabled={actionLoading}
                                            variant="destructive" size="sm">Reject</Button>
                                        <Button
                                            onClick={() => handleAction(deposit.id, 'deposit', 'approve')}
                                            disabled={actionLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white" size="sm">Approve</Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                        {!selectedUser?.deposits?.length && <p className="text-center text-gray-500">No deposit history.</p>}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Withdraw Modal */}
            <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Withdraw Requests - {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {(selectedUser?.withdrawals || []).slice().reverse().map((withdrawal: any) => (
                            <Card key={withdrawal.id} className="p-4 border">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">Transaction ID: {withdrawal.id}</p>
                                        <p className="text-lg font-bold text-gray-900">₹{withdrawal.amount}</p>
                                        <div className="bg-gray-50 p-2 rounded text-sm space-y-1">
                                            <p className="font-semibold">{withdrawal.bankDetails.name}</p>
                                            <p>{withdrawal.bankDetails.type === 'bank' ? 'Bank Account' : 'UPI'}</p>
                                            <p className="font-mono">{withdrawal.bankDetails.accountNumber}</p>
                                        </div>
                                        <p className="text-xs text-gray-400">{new Date(withdrawal.date).toLocaleString()}</p>
                                        <Badge className={
                                            withdrawal.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                withdrawal.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }>{withdrawal.status}</Badge>
                                    </div>
                                </div>

                                {withdrawal.status === 'Pending' && (
                                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                        <Button
                                            onClick={() => handleAction(withdrawal.id, 'withdraw', 'reject')}
                                            disabled={actionLoading}
                                            variant="destructive" size="sm">Failed</Button>
                                        <Button
                                            onClick={() => handleAction(withdrawal.id, 'withdraw', 'approve')}
                                            disabled={actionLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white" size="sm">Complete</Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                        {!selectedUser?.withdrawals?.length && <p className="text-center text-gray-500">No withdraw history.</p>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
