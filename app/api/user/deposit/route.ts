
import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/db';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, amount, method } = body;

        if (!email || !amount) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const depositAmount = Number(amount);

        // IMMEDIATE WALLET UPDATE (Automatic Deposit)
        user.wallet = (user.wallet || 0) + depositAmount;

        // Create Approved Deposit Record
        const deposit = {
            id: Date.now().toString(),
            amount: depositAmount,
            method: method || 'Unknown',
            status: 'Approved', // Auto-approved
            date: new Date().toISOString()
        };

        if (!user.deposits) user.deposits = [];
        user.deposits.push(deposit);

        updateUser(user);

        // Remove password
        const { password: _, ...cleanUser } = user;

        return NextResponse.json({ message: 'Deposit successful', deposit, user: cleanUser });
    } catch (error) {
        console.error("Deposit Error:", error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
