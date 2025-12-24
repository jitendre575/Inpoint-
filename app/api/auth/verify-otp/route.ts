import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';
import { getUsers, saveUser, updateUser, User } from '@/lib/db';
import { validateAndNormalizeIdentifier } from '@/lib/otp-validation';

/**
 * POST /api/auth/verify-otp
 * 
 * Verify OTP and create/login user
 * 
 * Request Body:
 * - identifier: string (email or 10-digit Indian mobile number)
 * - otp: string (6-digit OTP)
 * - name: string (optional, for new users)
 * 
 * Response:
 * - 200: OTP verified, user logged in/created
 * - 400: Invalid OTP or identifier
 * - 500: Server error
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, otp, name } = body;

        // Validate required fields
        if (!identifier || !otp) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Identifier and OTP are required'
                },
                { status: 400 }
            );
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'OTP must be a 6-digit number'
                },
                { status: 400 }
            );
        }

        // Validate and normalize identifier
        const validation = validateAndNormalizeIdentifier(identifier.trim());

        if (!validation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    message: validation.message
                },
                { status: 400 }
            );
        }

        const { normalized, type } = validation;

        // Verify OTP
        const verification = verifyOTP(normalized, otp);

        if (!verification.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: verification.message,
                    attemptsRemaining: verification.attemptsRemaining
                },
                { status: 400 }
            );
        }

        // OTP verified successfully - Find or create user
        const users = await getUsers();

        // Find user by email or phone
        let user = users.find(u => {
            return u.email === normalized;
        });

        if (user) {
            // Existing user - update last login
            user.lastLogin = new Date().toISOString();
            await updateUser(user);

            // Remove password from response
            const { password, ...userWithoutPassword } = user;

            return NextResponse.json({
                success: true,
                message: 'Login successful',
                user: userWithoutPassword,
                isNewUser: false
            });
        } else {
            // New user - create account
            const newUser: User = {
                id: Date.now().toString(),
                name: name || 'User',
                email: normalized,
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

            // Remove password from response
            const { password, ...userWithoutPassword } = newUser;

            return NextResponse.json({
                success: true,
                message: 'Account created successfully',
                user: userWithoutPassword,
                isNewUser: true
            });
        }

    } catch (error: any) {
        console.error('❌ Verify OTP Error:', error.message);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to verify OTP. Please try again.'
            },
            { status: 500 }
        );
    }
}

