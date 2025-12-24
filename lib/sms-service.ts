/**
 * Production-Ready SMS Service
 * Handles OTP delivery via Twilio with proper environment detection
 */

import { normalizePhoneToE164 } from './otp-validation';

interface SMSResult {
    success: boolean;
    message: string;
    messageId?: string;
}

/**
 * Check if we're in production environment
 */
function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

/**
 * Check if Twilio is properly configured
 */
function isTwilioConfigured(): boolean {
    return !!(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
    );
}

/**
 * Send OTP via SMS using Twilio
 * In production: ALWAYS sends real SMS (never logs to console)
 * In development: Logs to console if Twilio not configured
 */
export async function sendOTPViaSMS(
    phone: string,
    otp: string
): Promise<SMSResult> {
    try {
        const normalizedPhone = normalizePhoneToE164(phone);
        const appName = process.env.APP_NAME || 'Investment App';
        const smsBody = `Your OTP for ${appName} is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;

        // PRODUCTION MODE - MUST send real SMS
        if (isProduction()) {
            if (!isTwilioConfigured()) {
                console.error('❌ CRITICAL: Twilio not configured in production!');
                return {
                    success: false,
                    message: 'SMS service is not configured. Please contact support.'
                };
            }

            // Send real SMS via Twilio
            const twilio = require('twilio');
            const client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );

            const message = await client.messages.create({
                body: smsBody,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: normalizedPhone,
            });

            // DO NOT log OTP in production
            console.log(`✅ SMS sent successfully to ${normalizedPhone.slice(0, 6)}****`);

            return {
                success: true,
                message: 'OTP sent successfully to your mobile number',
                messageId: message.sid
            };
        }

        // DEVELOPMENT MODE - Allow console logging if Twilio not configured
        if (!isTwilioConfigured()) {
            console.log('\n' + '='.repeat(60));
            console.log('📱 DEVELOPMENT MODE - SMS OTP');
            console.log('='.repeat(60));
            console.log(`Phone: ${normalizedPhone}`);
            console.log(`OTP: ${otp}`);
            console.log(`Message: ${smsBody}`);
            console.log('='.repeat(60) + '\n');

            return {
                success: true,
                message: 'OTP sent successfully (check console in dev mode)'
            };
        }

        // DEVELOPMENT MODE with Twilio configured - Send real SMS
        const twilio = require('twilio');
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const message = await client.messages.create({
            body: smsBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: normalizedPhone,
        });

        console.log(`✅ SMS sent successfully to ${normalizedPhone}`);
        console.log(`📱 DEV MODE - OTP: ${otp}`);

        return {
            success: true,
            message: 'OTP sent successfully to your mobile number',
            messageId: message.sid
        };

    } catch (error: any) {
        console.error('❌ SMS sending error:', error.message);

        // Provide helpful error messages
        if (error.code === 21211) {
            return {
                success: false,
                message: 'Invalid phone number format. Please check and try again.'
            };
        }

        if (error.code === 21608) {
            return {
                success: false,
                message: 'This phone number is not verified. Please use a verified number or upgrade your Twilio account.'
            };
        }

        if (error.code === 20003) {
            return {
                success: false,
                message: 'SMS service authentication failed. Please contact support.'
            };
        }

        return {
            success: false,
            message: 'Failed to send OTP. Please try again or contact support.'
        };
    }
}

/**
 * Send OTP via SMS with rate limiting check
 */
export async function sendOTPWithRateLimit(
    phone: string,
    otp: string,
    lastSentTime?: number
): Promise<SMSResult> {
    // Rate limiting: Don't allow sending OTP more than once per minute
    if (lastSentTime) {
        const timeSinceLastSend = Date.now() - lastSentTime;
        const minWaitTime = 60 * 1000; // 1 minute

        if (timeSinceLastSend < minWaitTime) {
            const remainingSeconds = Math.ceil((minWaitTime - timeSinceLastSend) / 1000);
            return {
                success: false,
                message: `Please wait ${remainingSeconds} seconds before requesting a new OTP`
            };
        }
    }

    return sendOTPViaSMS(phone, otp);
}
