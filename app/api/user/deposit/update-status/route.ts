
import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, depositId, status } = body;

        if (!userId || !depositId || !status) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const deposit = user.deposits?.find((d: any) => d.id === depositId);
        if (!deposit) {
            return NextResponse.json({ message: 'Deposit not found' }, { status: 404 });
        }

        const oldStatus = deposit.status;
        deposit.status = status;

        // If newly approved, add to wallet
        if (status === 'Approved' && oldStatus !== 'Approved') {
            user.wallet = (user.wallet || 0) + deposit.amount;

            // Add to history
            user.history.push({
                id: Date.now().toString(),
                type: 'Deposit',
                amount: deposit.amount,
                date: new Date().toISOString(),
                description: 'Deposit successful'
            });
        }

        await updateUser(user);

        return NextResponse.json({ message: 'Status updated', user });
    } catch (error) {
        console.error("Update Status Error:", error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
