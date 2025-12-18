
import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, amount, bankDetails } = body;

        if (!email || !amount || !bankDetails) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.wallet < amount) {
            return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
        }

        // Deduct Balance Immediately
        user.wallet -= amount;

        // Create Withdraw Record
        const withdrawal = {
            id: Date.now().toString(),
            amount,
            bankDetails,
            status: 'Pending',
            date: new Date().toISOString()
        };

        if (!user.withdrawals) user.withdrawals = [];
        user.withdrawals.push(withdrawal);

        updateUser(user);

        // Remove password
        const { password: _, ...cleanUser } = user;

        return NextResponse.json({ message: 'Withdraw request submitted', withdrawal, user: cleanUser });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
