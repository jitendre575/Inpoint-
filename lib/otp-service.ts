// Production-ready OTP Service with Real Email & SMS Delivery
import nodemailer from 'nodemailer';

interface OTPRecord {
    otp: string;
    expiresAt: number;
    attempts: number;
    resendCount: number;
}

// In-memory store (use Redis in production for scalability)
const otpStore = new Map<string, OTPRecord>();

// Configuration
const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;
const MAX_RESEND_ATTEMPTS = 3;

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for a given identifier (email or phone)
 */
export function storeOTP(identifier: string, otp: string): void {
    const existing = otpStore.get(identifier);
    otpStore.set(identifier, {
        otp,
        expiresAt: Date.now() + OTP_EXPIRY_MS,
        attempts: 0,
        resendCount: existing ? existing.resendCount + 1 : 0
    });
}

/**
 * Verify OTP for a given identifier
 */
export function verifyOTP(identifier: string, otp: string): { success: boolean; message: string } {
    const record = otpStore.get(identifier);

    if (!record) {
        return { success: false, message: 'No OTP found. Please request a new one.' };
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(identifier);
        return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(identifier);
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    if (record.otp !== otp) {
        record.attempts++;
        return {
            success: false,
            message: `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempts remaining.`
        };
    }

    // OTP verified successfully
    otpStore.delete(identifier);
    return { success: true, message: 'OTP verified successfully.' };
}

/**
 * Check if resend limit is reached
 */
export function canResendOTP(identifier: string): { canResend: boolean; message: string } {
    const record = otpStore.get(identifier);

    if (!record) {
        return { canResend: true, message: 'OK' };
    }

    if (record.resendCount >= MAX_RESEND_ATTEMPTS) {
        return {
            canResend: false,
            message: `Maximum resend limit (${MAX_RESEND_ATTEMPTS}) reached. Please try again later.`
        };
    }

    return { canResend: true, message: 'OK' };
}

/**
 * Clear OTP for a given identifier
 */
export function clearOTP(identifier: string): void {
    otpStore.delete(identifier);
}

/**
 * Check if identifier is email or phone
 */
export function isEmail(identifier: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}

export function isPhone(identifier: string): boolean {
    // Indian phone number format: 10 digits or +91 followed by 10 digits
    return /^(\+91)?[6-9]\d{9}$/.test(identifier.replace(/\s/g, ''));
}

/**
 * Send OTP via Email using Nodemailer
 */
export async function sendEmailOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
        // Create transporter using Gmail (you can use SendGrid, AWS SES, etc.)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
            },
        });

        // Email template
        const mailOptions = {
            from: `"${process.env.APP_NAME || 'Investment App'}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Your OTP Code - ${process.env.APP_NAME || 'Investment App'}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px dashed #10b981; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        .warning { color: #dc2626; font-size: 14px; margin-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 OTP Verification</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>You requested an OTP to create your account. Please use the following code to complete your registration:</p>
                            
                            <div class="otp-box">
                                <div class="otp-code">${otp}</div>
                            </div>
                            
                            <p><strong>This OTP is valid for 5 minutes only.</strong></p>
                            
                            <p class="warning">⚠️ If you didn't request this OTP, please ignore this email.</p>
                            
                            <p>Thank you,<br>The ${process.env.APP_NAME || 'Investment App'} Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'OTP sent successfully to your email.'
        };
    } catch (error: any) {
        console.error('Email OTP Error:', error);
        return {
            success: false,
            message: 'Failed to send OTP email. Please check your email address.'
        };
    }
}

/**
 * Send OTP via SMS using Twilio
 */
export async function sendSMSOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
        // Normalize phone number to E.164 format
        let normalizedPhone = phone.replace(/\s/g, '');
        if (!normalizedPhone.startsWith('+')) {
            normalizedPhone = '+91' + normalizedPhone.replace(/^\+91/, '');
        }

        // Import Twilio dynamically to avoid issues
        const twilio = require('twilio');
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        // Send SMS
        await client.messages.create({
            body: `Your OTP for ${process.env.APP_NAME || 'Investment App'} registration is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: normalizedPhone,
        });

        return {
            success: true,
            message: 'OTP sent successfully to your phone.'
        };
    } catch (error: any) {
        console.error('SMS OTP Error:', error);
        return {
            success: false,
            message: 'Failed to send OTP SMS. Please check your phone number.'
        };
    }
}

/**
 * Send OTP based on identifier type (email or phone)
 */
export async function sendOTP(identifier: string): Promise<{ success: boolean; message: string }> {
    // Check resend limit
    const resendCheck = canResendOTP(identifier);
    if (!resendCheck.canResend) {
        return { success: false, message: resendCheck.message };
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(identifier, otp);

    // Send OTP based on type
    if (isEmail(identifier)) {
        return await sendEmailOTP(identifier, otp);
    } else if (isPhone(identifier)) {
        return await sendSMSOTP(identifier, otp);
    } else {
        return {
            success: false,
            message: 'Invalid email or phone number format.'
        };
    }
}

/**
 * Clean up expired OTPs (call this periodically)
 */
export function cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [identifier, record] of otpStore.entries()) {
        if (now > record.expiresAt) {
            otpStore.delete(identifier);
        }
    }
}

// Cleanup expired OTPs every minute (server-side only)
if (typeof window === 'undefined') {
    setInterval(cleanupExpiredOTPs, 60 * 1000);
}
