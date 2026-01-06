
import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminSecret, userId, transactionId, type, action } = body;

        // Verify Admin (Simple Check)
        if (adminSecret !== "335524JI") {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (type === 'deposit') {
            const deposit = user.deposits?.find(d => d.id === transactionId);
            if (!deposit) return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });

            // Allow changing status from Pending or Processing (if added later)
            // But for deposit simply Pending -> Approved/Failed
            if (deposit.status === 'Approved' || deposit.status === 'Failed') {
                return NextResponse.json({ message: 'Transaction already processed' }, { status: 400 });
            }

            if (action === 'approve') {
                deposit.status = 'Approved';
                user.wallet += deposit.amount;
            } else {
                deposit.status = 'Failed';
            }

        } else if (type === 'withdraw') {
            const withdrawal = user.withdrawals?.find(w => w.id === transactionId);
            if (!withdrawal) return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });

            if (withdrawal.status === 'Completed' || withdrawal.status === 'Failed') {
                return NextResponse.json({ message: 'Transaction already processed' }, { status: 400 });
            }

            if (action === 'approve') {
                withdrawal.status = 'Completed';
            } else if (action === 'process') {
                withdrawal.status = 'Processing';
            } else {
                withdrawal.status = 'Failed';
                user.wallet += withdrawal.amount; // Refund
            }
        } else {
            return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
        }

        await updateUser(user);

        return NextResponse.json({ message: 'Success', user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
