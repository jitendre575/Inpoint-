import { NextResponse } from 'next/server';
import { generateOTP, storeOTP, hasValidOTP } from '@/lib/otp';
import { sendEmailOTP, sendSMSOTP, isValidEmail, isValidPhone, normalizePhone } from '@/lib/messaging';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier } = body;

        if (!identifier) {
            return NextResponse.json(
                { message: 'Email or phone number is required' },
                { status: 400 }
            );
        }

        // Determine if it's email or phone
        const isEmail = isValidEmail(identifier);
        const isPhone = isValidPhone(identifier);

        if (!isEmail && !isPhone) {
            return NextResponse.json(
                { message: 'Please enter a valid email or phone number' },
                { status: 400 }
            );
        }

        // Normalize identifier
        const normalizedIdentifier = isPhone ? normalizePhone(identifier) : identifier.toLowerCase();

        // Check if there's already a valid OTP (prevent spam)
        if (hasValidOTP(normalizedIdentifier)) {
            return NextResponse.json(
                { message: 'An OTP has already been sent. Please wait before requesting a new one.' },
                { status: 429 }
            );
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP
        storeOTP(normalizedIdentifier, otp);

        // Send OTP
        let result;
        if (isEmail) {
            result = await sendEmailOTP(normalizedIdentifier, otp);
        } else {
            result = await sendSMSOTP(normalizedIdentifier, otp);
        }

        if (!result.success) {
            return NextResponse.json(
                { message: result.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: result.message,
            type: isEmail ? 'email' : 'phone',
            identifier: normalizedIdentifier
        });

    } catch (error: any) {
        console.error('Send OTP Error:', error);
        return NextResponse.json(
            { message: 'Failed to send OTP. Please try again.' },
            { status: 500 }
        );
    }
}
