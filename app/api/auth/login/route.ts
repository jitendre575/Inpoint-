
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

        // Check first login logic (Wallet +50) - Only if wallet is 0 and no history/plans? 
        // Or check a specific flag. Let's assume if it's the first time lastLogin was undefined (before we set it above? No, we set it now).
        // Actually, let's keep it simple. If wallet is 0, give bonus.
        if (user.wallet === 0 && user.plans.length === 0) {
            user.wallet = 50;
            // Add to history
            user.history.push({
                type: 'bonus',
                amount: 50,
                date: new Date().toISOString(),
                description: 'Welcome Bonus'
            });
        }

        await updateUser(user);

        // Return user without password
        const { password: _, ...userWithoutPass } = user;

        return NextResponse.json({ message: 'Login successful', user: userWithoutPass });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
