
import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser, getUsers } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, planIndex } = body;

        if (!userId || planIndex === undefined) {
            return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
        }

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.isBlocked) {
            return NextResponse.json({ message: 'Your account is blocked. Cannot claim bonus.' }, { status: 403 });
        }

        const plan = user.plans[planIndex];
        if (!plan) {
            return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
        }

        const now = new Date();
        const nextClaimAt = new Date(plan.nextClaimAt);

        if (now < nextClaimAt) {
            return NextResponse.json({ message: 'Bonus not ready yet' }, { status: 400 });
        }

        // Calculate bonus amount
        let amountToCredit = plan.dailyReturn;
        let isBonusDay = false;

        if (plan.bonusDaysClaimed < plan.totalBonusDays) {
            amountToCredit += plan.bonusPerDay;
            plan.bonusDaysClaimed += 1;
            isBonusDay = true;
        }

        // Update Wallet
        user.wallet += amountToCredit;
        plan.daysClaimed += 1;

        // Update next claim time (strictly 24h from last scheduled claim)
        plan.nextClaimAt = new Date(nextClaimAt.getTime() + 24 * 60 * 60 * 1000).toISOString();

        // Add to history
        if (!user.history) user.history = [];
        user.history.push({
            type: 'bonus_claim',
            plan: plan.name,
            amount: amountToCredit,
            date: now.toISOString(),
            isExtraBonus: isBonusDay
        });

        // Requirement: Send notification/message to admin and user
        // We'll add this to the support chats as a "system message"
        if (!user.supportChats) user.supportChats = [];

        user.supportChats.push({
            id: Math.random().toString(36).substr(2, 9),
            sender: 'admin',
            message: `System: You have successfully claimed ₹${amountToCredit} daily bonus for ${plan.name}.`,
            timestamp: now.toISOString(),
            read: false,
            status: 'delivered'
        });

        await updateUser(user);

        const { password: _, ...cleanUser } = user;
        return NextResponse.json({ message: 'Bonus claimed successfully!', user: cleanUser, amount: amountToCredit });
    } catch (error) {
        console.error("Claim Bonus API Error:", error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
