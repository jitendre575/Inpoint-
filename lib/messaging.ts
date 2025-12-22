// Production Email and SMS sending utilities
import nodemailer from 'nodemailer';

/**
 * Send OTP via Email using Nodemailer
 */
export async function sendEmailOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
        // For development, log to console
        if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
            console.log(`📧 Email OTP for ${email}: ${otp}`);
            console.log(`This OTP will expire in 5 minutes.`);
            return { success: true, message: 'OTP sent successfully (check console in dev mode)' };
        }

        // Production email sending with Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use custom SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD, // Use App Password for Gmail
            },
        });

        const mailOptions = {
            from: `"${process.env.APP_NAME || 'Investment App'}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Your OTP Code - ${process.env.APP_NAME || 'Investment App'}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; }
                        .header h1 { margin: 0; font-size: 28px; }
                        .content { padding: 40px 30px; background: #f9fafb; }
                        .otp-box { background: white; border: 3px dashed #10b981; padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .otp-code { font-size: 42px; font-weight: bold; color: #10b981; letter-spacing: 10px; font-family: 'Courier New', monospace; }
                        .info { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .warning { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px; color: #991b1b; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 13px; background: #f3f4f6; }
                        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Account Verification</h1>
                        </div>
                        <div class="content">
                            <p style="font-size: 16px;">Hello,</p>
                            <p style="font-size: 16px;">Thank you for creating an account with us! Please use the following One-Time Password (OTP) to complete your registration:</p>
                            
                            <div class="otp-box">
                                <div class="otp-code">${otp}</div>
                            </div>
                            
                            <div class="info">
                                <strong>⏰ Important:</strong> This OTP is valid for <strong>5 minutes only</strong>. Please enter it promptly to complete your registration.
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong> If you didn't request this OTP, please ignore this email and ensure your account is secure. Never share this code with anyone.
                            </div>
                            
                            <p style="margin-top: 30px;">Best regards,<br><strong>The ${process.env.APP_NAME || 'Investment App'} Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this message.</p>
                            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'Investment App'}. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'OTP sent to your email'
        };
    } catch (error: any) {
        console.error('Email sending error:', error);
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
        // For development, log to console
        if (process.env.NODE_ENV === 'development' && !process.env.TWILIO_ACCOUNT_SID) {
            console.log(`📱 SMS OTP for ${phone}: ${otp}`);
            console.log(`This OTP will expire in 5 minutes.`);
            return { success: true, message: 'OTP sent successfully (check console in dev mode)' };
        }

        // Normalize phone number to E.164 format
        let normalizedPhone = phone.replace(/\s/g, '');
        if (!normalizedPhone.startsWith('+')) {
            // Assume Indian number if no country code
            normalizedPhone = '+91' + normalizedPhone.replace(/^\+91/, '');
        }

        // Production SMS sending with Twilio
        const twilio = require('twilio');
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        await client.messages.create({
            body: `Your OTP for ${process.env.APP_NAME || 'Investment App'} registration is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: normalizedPhone,
        });

        return {
            success: true,
            message: 'OTP sent to your phone'
        };
    } catch (error: any) {
        console.error('SMS sending error:', error);
        return {
            success: false,
            message: 'Failed to send OTP SMS. Please check your phone number.'
        };
    }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format (Indian format)
 */
export function isValidPhone(phone: string): boolean {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Indian phone: 10 digits or with country code (91 + 10 digits)
    return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
}

/**
 * Normalize phone number (remove spaces, dashes, etc.)
 */
export function normalizePhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    // Ensure it starts with country code
    if (cleaned.length === 10) {
        cleaned = '91' + cleaned;
    }
    return cleaned;
}
