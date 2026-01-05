import { NextResponse } from 'next/server';
import { saveUser, findUserByEmail, User, hashPassword, getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { name, email, password, referralCode: ref } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const userId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const generatedReferralCode = userId; // Using ID as referral code for simplicity and uniqueness

        const newUser: User = {
            id: userId,
            name,
            email,
            password: hashPassword(password),
            wallet: 0,
            plans: [],
            history: [],
            deposits: [],
            withdrawals: [],
            referralCode: generatedReferralCode,
            referredBy: ref || undefined,
            createdAt: new Date().toISOString(),
        };

        // Handle Referral Reward
        if (ref) {
            const allUsers = await getUsers();
            const referrer = allUsers.find(u => u.referralCode === ref);
            if (referrer) {
                referrer.wallet = (referrer.wallet || 0) + 100;
                referrer.referralRewards = (referrer.referralRewards || 0) + 100;

                // Add to history
                if (!referrer.history) referrer.history = [];
                referrer.history.push({
                    id: Date.now().toString(),
                    type: 'Referral Bonus',
                    amount: 100,
                    date: new Date().toISOString(),
                    status: 'Completed',
                    description: `Bonus for referring ${name}`
                });

                await updateUser(referrer);
            }
        }

        await saveUser(newUser);

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, referralCode: newUser.referralCode }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
