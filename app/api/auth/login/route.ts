
import { NextResponse } from 'next/server';
import { findUserByCredentials, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await findUserByCredentials(email, password);

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Update login time
        user.lastLogin = new Date().toISOString();

        let bonusMessage = null;

        // New Bonus Logic: Credit only once on first login
        if (!user.bonusClaimed) {
            const isPromoJR007 = user.promoCode === "JR007";
            const bonusAmount = isPromoJR007 ? 299 : 149;

            user.wallet = (user.wallet || 0) + bonusAmount;
            user.bonusClaimed = true;

            bonusMessage = isPromoJR007 ? "₹299 Bonus Added" : "₹149 Welcome Bonus Added";

            // Add to history
            user.history.push({
                id: Date.now().toString(),
                type: 'bonus',
                amount: bonusAmount,
                date: new Date().toISOString(),
                status: 'Completed',
                description: isPromoJR007 ? 'Promo Code JR007 Bonus' : 'Welcome Bonus'
            });
        }

        await updateUser(user);

        // Return user without password
        const { password: _, ...userWithoutPass } = user;

        return NextResponse.json({ message: 'Login successful', user: userWithoutPass, bonusMessage });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
