
import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, plan, amount } = body;

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.wallet < amount) {
            return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
        }

        // Deduct amount
        user.wallet -= amount;

        // Add instant credit (20%)
        const instantCredit = amount * 0.2;
        user.wallet += instantCredit;

        // Add plan
        if (!user.plans) user.plans = [];
        user.plans.push({
            ...plan,
            amount,
            purchaseDate: new Date().toISOString(),
        });

        // Add to History
        if (!user.history) user.history = [];
        user.history.push({
            type: 'investment',
            plan: plan.name,
            amount,
            date: new Date().toISOString()
        });

        updateUser(user);

        // Remove password
        const { password: _, ...cleanUser } = user;

        return NextResponse.json({ message: 'Investment successful', user: cleanUser });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
