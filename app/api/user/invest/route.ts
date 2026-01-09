
import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, plan, amount } = body;

        const user = await findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.isBlocked) {
            return NextResponse.json({ message: 'Your account is blocked. Investment not allowed.' }, { status: 403 });
        }

        if (user.wallet < amount) {
            return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
        }

        // Deduct amount
        user.wallet -= amount;

        // Add plan
        if (!user.plans) user.plans = [];

        const now = new Date();
        const activationTime = now.toISOString();
        const nextClaimAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

        user.plans.push({
            ...plan,
            status: 'active',
            purchaseDate: activationTime,
            nextClaimAt: nextClaimAt,
            daysClaimed: 0,
            bonusDaysClaimed: 0,
            totalBonusDays: 3,
            bonusPerDay: plan.bonus / 3
        });

        // Add to History
        if (!user.history) user.history = [];
        user.history.push({
            type: 'investment',
            plan: plan.name,
            amount,
            date: activationTime
        });

        // Referral logic: Give benefit to referrer if applicable
        if (user.referredBy) {
            const users = await (await import('@/lib/db')).getUsers();
            const referrer = users.find(u => u.referralCode === user.referredBy || u.id === user.referredBy);
            if (referrer) {
                // Example: Referrer gets 5% of investment
                const referralBenefit = amount * 0.05;
                referrer.wallet += referralBenefit;
                referrer.referralRewards = (referrer.referralRewards || 0) + referralBenefit;

                if (!referrer.history) referrer.history = [];
                referrer.history.push({
                    type: 'referral_bonus',
                    from: user.name,
                    amount: referralBenefit,
                    date: activationTime
                });

                await updateUser(referrer);
            }
        }

        await updateUser(user);

        // Remove password
        const { password: _, ...cleanUser } = user;

        return NextResponse.json({ message: 'Investment successful', user: cleanUser });
    } catch (error) {
        console.error("Investment API Error:", error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
