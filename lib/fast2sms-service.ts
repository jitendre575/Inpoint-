/**
 * Fast2SMS Integration for Indian Mobile Numbers
 * Alternative to Twilio for Indian SMS delivery
 */

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
 * Check if Fast2SMS is configured
 */
function isFast2SMSConfigured(): boolean {
    return !!process.env.FAST2SMS_API_KEY;
}

/**
 * Send OTP via Fast2SMS (Indian SMS Provider)
 * Easier setup for Indian numbers, no trial restrictions
 */
export async function sendOTPViaFast2SMS(
    phone: string,
    otp: string
): Promise<SMSResult> {
    try {
        // Remove country code if present (Fast2SMS uses 10-digit numbers)
        const cleanPhone = phone.replace(/^\+?91/, '').trim();

        const appName = process.env.APP_NAME || 'Investment App';
        const message = `Your OTP for ${appName} is ${otp}. Valid for 5 minutes. Do not share this code.`;

        // PRODUCTION MODE - MUST send real SMS
        if (isProduction()) {
            if (!isFast2SMSConfigured()) {
                console.error('❌ CRITICAL: Fast2SMS not configured in production!');
                return {
                    success: false,
                    message: 'SMS service is not configured. Please contact support.'
                };
            }

            // Send SMS via Fast2SMS API
            const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                method: 'POST',
                headers: {
                    'authorization': process.env.FAST2SMS_API_KEY!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    route: 'v3',
                    sender_id: process.env.FAST2SMS_SENDER_ID || 'TXTIND',
                    message: message,
                    language: 'english',
                    flash: 0,
                    numbers: cleanPhone
                })
            });

            const data = await response.json();

            if (!response.ok || !data.return) {
                console.error('❌ Fast2SMS Error:', data);
                return {
                    success: false,
                    message: 'Failed to send OTP. Please try again.'
                };
            }

            // DO NOT log OTP in production
            console.log(`✅ SMS sent successfully to ${cleanPhone.slice(0, 4)}****`);

            return {
                success: true,
                message: 'OTP sent successfully to your mobile number',
                messageId: data.request_id
            };
        }

        // DEVELOPMENT MODE - Allow console logging if Fast2SMS not configured
        if (!isFast2SMSConfigured()) {
            console.log('\n' + '='.repeat(60));
            console.log('📱 DEVELOPMENT MODE - SMS OTP (Fast2SMS)');
            console.log('='.repeat(60));
            console.log(`Phone: ${cleanPhone}`);
            console.log(`OTP: ${otp}`);
            console.log(`Message: ${message}`);
            console.log('='.repeat(60) + '\n');

            return {
                success: true,
                message: 'OTP sent successfully (check console in dev mode)'
            };
        }

        // DEVELOPMENT MODE with Fast2SMS configured - Send real SMS
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'authorization': process.env.FAST2SMS_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                route: 'v3',
                sender_id: process.env.FAST2SMS_SENDER_ID || 'TXTIND',
                message: message,
                language: 'english',
                flash: 0,
                numbers: cleanPhone
            })
        });

        const data = await response.json();

        if (!response.ok || !data.return) {
            console.error('❌ Fast2SMS Error:', data);
            return {
                success: false,
                message: 'Failed to send OTP. Please try again.'
            };
        }

        console.log(`✅ SMS sent successfully to ${cleanPhone}`);
        console.log(`📱 DEV MODE - OTP: ${otp}`);

        return {
            success: true,
            message: 'OTP sent successfully to your mobile number',
            messageId: data.request_id
        };

    } catch (error: any) {
        console.error('❌ Fast2SMS sending error:', error.message);

        return {
            success: false,
            message: 'Failed to send OTP. Please try again or contact support.'
        };
    }
}

/**
 * Send OTP via Fast2SMS with rate limiting check
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

    return sendOTPViaFast2SMS(phone, otp);
}
