/**
 * Production-Ready Email Service
 * Handles OTP delivery via Email with proper environment detection
 */

import nodemailer from 'nodemailer';

interface EmailResult {
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
 * Check if email is properly configured
 */
function isEmailConfigured(): boolean {
    return !!(
        process.env.EMAIL_USER &&
        process.env.EMAIL_APP_PASSWORD
    );
}

/**
 * Send OTP via Email using Nodemailer
 * In production: ALWAYS sends real email (never logs to console)
 * In development: Logs to console if email not configured
 */
export async function sendOTPViaEmail(
    email: string,
    otp: string
): Promise<EmailResult> {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const appName = process.env.APP_NAME || 'Investment App';

        // PRODUCTION MODE - MUST send real email
        if (isProduction()) {
            if (!isEmailConfigured()) {
                console.error('❌ CRITICAL: Email not configured in production!');
                return {
                    success: false,
                    message: 'Email service is not configured. Please contact support.'
                };
            }

            // Send real email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: `"${appName}" <${process.env.EMAIL_USER}>`,
                to: normalizedEmail,
                subject: `Your OTP Code - ${appName}`,
                html: generateOTPEmailHTML(otp, appName),
            };

            const info = await transporter.sendMail(mailOptions);

            // DO NOT log OTP in production
            console.log(`✅ Email sent successfully to ${normalizedEmail}`);

            return {
                success: true,
                message: 'OTP sent successfully to your email',
                messageId: info.messageId
            };
        }

        // DEVELOPMENT MODE - Allow console logging if email not configured
        if (!isEmailConfigured()) {
            console.log('\n' + '='.repeat(60));
            console.log('📧 DEVELOPMENT MODE - EMAIL OTP');
            console.log('='.repeat(60));
            console.log(`Email: ${normalizedEmail}`);
            console.log(`OTP: ${otp}`);
            console.log('='.repeat(60) + '\n');

            return {
                success: true,
                message: 'OTP sent successfully (check console in dev mode)'
            };
        }

        // DEVELOPMENT MODE with email configured - Send real email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"${appName}" <${process.env.EMAIL_USER}>`,
            to: normalizedEmail,
            subject: `Your OTP Code - ${appName}`,
            html: generateOTPEmailHTML(otp, appName),
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Email sent successfully to ${normalizedEmail}`);
        console.log(`📧 DEV MODE - OTP: ${otp}`);

        return {
            success: true,
            message: 'OTP sent successfully to your email',
            messageId: info.messageId
        };

    } catch (error: any) {
        console.error('❌ Email sending error:', error.message);

        // Provide helpful error messages
        if (error.code === 'EAUTH') {
            return {
                success: false,
                message: 'Email service authentication failed. Please contact support.'
            };
        }

        if (error.code === 'EENVELOPE') {
            return {
                success: false,
                message: 'Invalid email address. Please check and try again.'
            };
        }

        return {
            success: false,
            message: 'Failed to send OTP. Please try again or contact support.'
        };
    }
}

/**
 * Generate HTML template for OTP email
 */
function generateOTPEmailHTML(otp: string, appName: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    margin: 0; 
                    padding: 0; 
                    background-color: #f5f5f5;
                }
                .container { 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                    color: white; 
                    padding: 40px 20px; 
                    text-align: center; 
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: 600;
                }
                .content { 
                    padding: 40px 30px; 
                }
                .otp-box { 
                    background: #f0fdf4; 
                    border: 3px dashed #10b981; 
                    padding: 30px; 
                    text-align: center; 
                    margin: 30px 0; 
                    border-radius: 12px;
                }
                .otp-code { 
                    font-size: 42px; 
                    font-weight: bold; 
                    color: #10b981; 
                    letter-spacing: 10px; 
                    font-family: 'Courier New', monospace;
                    user-select: all;
                }
                .info { 
                    background: #e0f2fe; 
                    border-left: 4px solid #0284c7; 
                    padding: 15px; 
                    margin: 20px 0; 
                    border-radius: 4px; 
                }
                .warning { 
                    background: #fee2e2; 
                    border-left: 4px solid #dc2626; 
                    padding: 15px; 
                    margin: 20px 0; 
                    border-radius: 4px; 
                    color: #991b1b; 
                }
                .footer { 
                    text-align: center; 
                    padding: 20px; 
                    color: #6b7280; 
                    font-size: 13px; 
                    background: #f9fafb; 
                }
                .highlight {
                    color: #10b981;
                    font-weight: 600;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Account Verification</h1>
                </div>
                <div class="content">
                    <p style="font-size: 16px;">Hello,</p>
                    <p style="font-size: 16px;">Thank you for creating an account with <span class="highlight">${appName}</span>! Please use the following One-Time Password (OTP) to complete your registration:</p>
                    
                    <div class="otp-box">
                        <div class="otp-code">${otp}</div>
                    </div>
                    
                    <div class="info">
                        <strong>⏰ Important:</strong> This OTP is valid for <strong>5 minutes only</strong>. Please enter it promptly to complete your registration.
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong> If you didn't request this OTP, please ignore this email and ensure your account is secure. Never share this code with anyone.
                    </div>
                    
                    <p style="margin-top: 30px;">Best regards,<br><strong>The ${appName} Team</strong></p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

/**
 * Send OTP via Email with rate limiting check
 */
export async function sendOTPWithRateLimit(
    email: string,
    otp: string,
    lastSentTime?: number
): Promise<EmailResult> {
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

    return sendOTPViaEmail(email, otp);
}
