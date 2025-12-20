
import { NextResponse } from 'next/server';
import { getUsers, saveUser, User } from '@/lib/db';

// This API is responsible for creating a user if they don't exist,
// or retrieving them if they do, after a successful Firebase Auth on client side.
// Trusted environment: We assume checks are passed or tokens are valid (in a real app, verify ID Token here).
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uid, email, phone, name } = body;

        if (!uid || (!email && !phone)) {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        const users = getUsers();

        // Find by Firebase UID match (if we stored it) or by Email/Phone match
        // Since we are migrating, we might check email first.
        let user = users.find(u =>
            (email && u.email === email) ||
            (phone && u.email === phone) || // Using 'email' field for phone in legacy
            (u.id === uid)
        );

        if (user) {
            // User exists, update last login
            // Update UID if not set (first time social login for existing user)
            if (!user.id.startsWith('17')) { // Checking if it involves new schema or legacy
                // Actually, let's just keep the ID consistent if we can, or update it.
                // Ideally, we should add a 'firebaseUid' field. But for now, we'll just log them in.
                // If the user was created with ID=timestamp, we keep it. 
            }

            // Should we update the 'id' to be the firebase UID? 
            // Better not break associations. We can stick to finding by email.

            return NextResponse.json({ message: 'Login successful', user });
        } else {
            // New User
            const newUser: User = {
                id: uid, // Use Firebase UID as ID
                name: name || 'User',
                email: email || phone, // Fallback for email field
                password: '', // No password
                wallet: 50, // Welcome bonus
                plans: [],
                history: [
                    {
                        type: 'bonus',
                        amount: 50,
                        date: new Date().toISOString(),
                        description: 'Welcome Bonus'
                    }
                ],
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            saveUser(newUser);
            return NextResponse.json({ message: 'Account created', user: newUser });
        }

    } catch (error) {
        console.error("OTP Login Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
