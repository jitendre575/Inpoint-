
import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminSecret, userId, amount, type, reason } = body;

        // Verify Admin - Using same hardcoded or env secret
        if (adminSecret !== '335524JI' && adminSecret !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const changeAmount = parseFloat(amount);
        if (isNaN(changeAmount) || changeAmount <= 0) {
            return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
        }

        if (type === 'add') {
            user.wallet = (user.wallet || 0) + changeAmount;
        } else if (type === 'deduct') {
            user.wallet = Math.max(0, (user.wallet || 0) - changeAmount);
        } else {
            return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
        }

        if (!user.walletHistory) user.walletHistory = [];
        user.walletHistory.push({
            amount: changeAmount,
            type: type as 'add' | 'deduct',
            reason: reason || 'Manual adjustment by admin',
            date: new Date().toISOString()
        });

        // Add to general history as well for user to see
        user.history.push({
            id: Date.now().toString(),
            type: type === 'add' ? 'Credit' : 'Debit',
            amount: changeAmount,
            date: new Date().toISOString(),
            description: reason || 'Wallet adjusted by system'
        });

        await updateUser(user);

        const { password: _, ...cleanUser } = user;
        return NextResponse.json({ message: 'Wallet Updated Successfully', user: cleanUser });
    } catch (error) {
        console.error("Edit Wallet API Error:", error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
