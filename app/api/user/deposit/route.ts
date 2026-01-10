import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser, getUsers } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, amount, method, screenshot, utr } = body;

        if (!email || !amount) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const users = await getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const depositAmount = Number(amount);

        // Create Pending Deposit Record (Not auto-approved anymore)
        const deposit = {
            id: Date.now().toString(),
            amount: depositAmount,
            method: method || 'Unknown',
            status: 'Processing', // Changed from Approved
            date: new Date().toISOString(),
            screenshot: screenshot || null,
            utr: utr || null
        };

        if (!user.deposits) user.deposits = [];
        user.deposits.push(deposit as any);

        await updateUser(user);

        // Remove password
        const { password: _, ...cleanUser } = user;

        return NextResponse.json({
            message: 'Deposit submitted for verification',
            deposit,
            user: cleanUser
        });
    } catch (error) {
        console.error("Deposit Error:", error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
