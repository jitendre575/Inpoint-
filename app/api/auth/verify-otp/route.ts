import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';
import { getUsers, saveUser, updateUser, User } from '@/lib/db';
import { isValidEmail, normalizePhone } from '@/lib/messaging';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, otp, name } = body;

        if (!identifier || !otp) {
            return NextResponse.json(
                { message: 'Identifier and OTP are required' },
                { status: 400 }
            );
        }

        // Normalize identifier
        const isEmail = isValidEmail(identifier);
        const normalizedIdentifier = isEmail ? identifier.toLowerCase() : normalizePhone(identifier);

        // Verify OTP
        const verification = verifyOTP(normalizedIdentifier, otp);

        if (!verification.success) {
            return NextResponse.json(
                { message: verification.message },
                { status: 400 }
            );
        }

        // OTP verified, now find or create user
        const users = await getUsers();

        // Find user by email or phone
        let user = users.find(u => {
            if (isEmail) {
                return u.email === normalizedIdentifier;
            } else {
                // Check if phone matches (stored in email field for legacy compatibility)
                return u.email === normalizedIdentifier;
            }
        });

        if (user) {
            // Existing user - update last login
            user.lastLogin = new Date().toISOString();
            await updateUser(user);

            return NextResponse.json({
                message: 'Login successful',
                user,
                isNewUser: false
            });
        } else {
            // New user - create account
            const newUser: User = {
                id: Date.now().toString(),
                name: name || 'User',
                email: normalizedIdentifier,
                password: '', // No password for OTP login
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
                deposits: [],
                withdrawals: [],
                supportChats: [],
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            await saveUser(newUser);

            return NextResponse.json({
                message: 'Account created successfully',
                user: newUser,
                isNewUser: true
            });
        }

    } catch (error: any) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json(
            { message: 'Failed to verify OTP. Please try again.' },
            { status: 500 }
        );
    }
}
