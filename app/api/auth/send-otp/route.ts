import { NextResponse } from 'next/server';
import { generateOTP, storeOTP, canResendOTP } from '@/lib/otp';
import { sendOTPViaEmail } from '@/lib/email-service';
import { sendOTPViaSMS } from '@/lib/sms-service';
import { validateAndNormalizeIdentifier } from '@/lib/otp-validation';

/**
 * POST /api/auth/send-otp
 * 
 * Send OTP to email or phone number
 * 
 * Request Body:
 * - identifier: string (email or 10-digit Indian mobile number)
 * 
 * Response:
 * - 200: OTP sent successfully
 * - 400: Invalid identifier format
 * - 429: Rate limit exceeded
 * - 500: Server error
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier } = body;

        // Validate identifier is provided
        if (!identifier || typeof identifier !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email or mobile number is required'
                },
                { status: 400 }
            );
        }

        // Trim whitespace
        const trimmedIdentifier = identifier.trim();

        if (!trimmedIdentifier) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email or mobile number cannot be empty'
                },
                { status: 400 }
            );
        }

        // Validate and normalize identifier (email or phone)
        const validation = validateAndNormalizeIdentifier(trimmedIdentifier);

        if (!validation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    message: validation.message,
                    type: validation.type
                },
                { status: 400 }
            );
        }

        const { type, normalized } = validation;

        // Check rate limiting
        const resendCheck = canResendOTP(normalized);
        if (!resendCheck.canResend) {
            return NextResponse.json(
                {
                    success: false,
                    message: resendCheck.message,
                    waitTime: resendCheck.waitTime
                },
                { status: 429 }
            );
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP
        storeOTP(normalized, otp);

        // Send OTP based on type
        let result;
        if (type === 'email') {
            result = await sendOTPViaEmail(normalized, otp);
        } else if (type === 'phone') {
            result = await sendOTPViaSMS(normalized, otp);
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid identifier type'
                },
                { status: 400 }
            );
        }

        // Check if OTP was sent successfully
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message
                },
                { status: 500 }
            );
        }

        // Success response
        return NextResponse.json({
            success: true,
            message: result.message,
            type: type,
            identifier: type === 'phone'
                ? `${normalized.slice(0, 4)}****${normalized.slice(-2)}`
                : normalized.replace(/(.{3})(.*)(@.*)/, '$1***$3')
        });

    } catch (error: any) {
        console.error('❌ Send OTP Error:', error.message);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to send OTP. Please try again.'
            },
            { status: 500 }
        );
    }
}

