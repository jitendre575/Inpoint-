
import { NextResponse } from 'next/server';
import { saveUser, findUserByEmail, findUserByPhone, User, hashPassword, getUsers, updateUser, isUserBanned } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { name, email, password, phone, referralCode: ref, profilePhoto, promoCode } = await request.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Check Blocked List
        const isBanned = await isUserBanned(email, phone);
        if (isBanned) {
            return NextResponse.json({ message: 'This account is permanently banned' }, { status: 403 });
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

        // Promo Code Logic
        let bonusAmount = 0;
        let promoUsed = null;

        if (promoCode) {
            if (promoCode.trim().toUpperCase() === 'JR007') {
                bonusAmount = 299;
                promoUsed = 'JR007';
            } else {
                return NextResponse.json({ message: 'Invalid Promo Code' }, { status: 400 });
            }
        }

        const userId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const generatedReferralCode = userId;

        const newUserByRequest: User = {
            id: userId,
            name,
            email,
            phone,
            password: hashPassword(password),
            wallet: bonusAmount, // Set initial legacy wallet to bonus for compatibility
            walletDetails: {
                balance: 0,
                bonus: bonusAmount
            },
            plans: [],
            history: bonusAmount > 0 ? [{
                id: Date.now().toString(),
                type: 'Promo Bonus',
                amount: bonusAmount,
                date: new Date().toISOString(),
                status: 'Completed',
                description: 'Bonus for using promo code JR007'
            }] : [],
            deposits: [],
            withdrawals: [],
            referralCode: generatedReferralCode,
            referredBy: ref || null,
            profilePhoto: profilePhoto || null,
            promoCode: promoUsed,
            promoUsed: promoUsed, // Added as requested
            bonus: bonusAmount,   // Added as requested
            bonusClaimed: bonusAmount > 0,
            createdAt: new Date().toISOString(),
        };

        // Handle Referral Reward (Referrer still gets 100)
        if (ref) {
            const allUsers = await getUsers();
            const referrer = allUsers.find(u => u.referralCode === ref || u.id === ref);
            if (referrer) {
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

        await saveUser(newUserByRequest);

        return NextResponse.json({
            message: bonusAmount > 0
                ? `Account created! ₹${bonusAmount} bonus added to your wallet.`
                : 'Account created successfully!',
            user: { id: newUserByRequest.id, name: newUserByRequest.name, email: newUserByRequest.email, referralCode: newUserByRequest.referralCode }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Register API Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
