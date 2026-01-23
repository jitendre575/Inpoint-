
import { NextResponse } from 'next/server';
import { saveUser, findUserByEmail, findUserByPhone, User, hashPassword, getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { name, email, password, phone, referralCode: ref, profilePhoto, promoCode } = await request.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const [existingEmail, existingPhone] = await Promise.all([
            findUserByEmail(email),
            findUserByPhone(phone)
        ]);

        if (existingEmail) {
            return NextResponse.json({ message: 'Email address already registered' }, { status: 400 });
        }
        if (existingPhone) {
            return NextResponse.json({ message: 'Mobile number already registered' }, { status: 400 });
        }

        const userId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const generatedReferralCode = userId;

        const newUser: User = {
            id: userId,
            name,
            email,
            phone,
            password: hashPassword(password),
            wallet: 0,
            plans: [],
            history: [],
            deposits: [],
            withdrawals: [],
            referralCode: generatedReferralCode,
            referredBy: ref || null,
            profilePhoto: profilePhoto || null,
            promoCode: promoCode || null,
            bonusClaimed: false,
            createdAt: new Date().toISOString(),
        };

        // Handle Referral Reward
        if (ref) {
            const allUsers = await getUsers();
            const referrer = allUsers.find(u => u.referralCode === ref || u.id === ref);
            if (referrer) {
                // Instant ₹100 registration bonus for referrer
                referrer.wallet = (referrer.wallet || 0) + 100;
                referrer.referralRewards = (referrer.referralRewards || 0) + 100;

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
        console.error("Register API Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
