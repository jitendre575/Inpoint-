/**
 * Production-Ready OTP Management Service
 * Handles OTP generation, storage, verification with security features
 * 
 * Features:
 * - 6-digit random OTP generation
 * - 5-minute expiry
 * - Maximum 3 verification attempts
 * - Rate limiting for resend requests
 * - Automatic cleanup of expired OTPs
 * 
 * Note: In production, consider using Redis for distributed systems
 */

interface OTPRecord {
    otp: string;
    expiresAt: number;
    attempts: number;
    resendCount: number;
    lastSentAt: number;
    createdAt: number;
}

// In-memory store (use Redis in production for scalability)
const otpStore = new Map<string, OTPRecord>();

// Configuration Constants
const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_VERIFICATION_ATTEMPTS = 3;
const MAX_RESEND_ATTEMPTS = 5;
const MIN_RESEND_INTERVAL_MS = 60 * 1000; // 1 minute between resends

/**
 * Generate a cryptographically random 6-digit OTP
 */
export function generateOTP(): string {
    // Use crypto for better randomness in production
    if (typeof window === 'undefined' && require('crypto')) {
        const crypto = require('crypto');
        const randomNum = crypto.randomInt(100000, 1000000);
        return randomNum.toString();
    }
    // Fallback to Math.random for client-side
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for a given identifier (email or phone)
 */
export function storeOTP(identifier: string, otp: string): void {
    const now = Date.now();
    const existing = otpStore.get(identifier);

    otpStore.set(identifier, {
        otp,
        expiresAt: now + OTP_EXPIRY_MS,
        attempts: 0,
        resendCount: existing ? existing.resendCount + 1 : 0,
        lastSentAt: now,
        createdAt: existing?.createdAt || now
    });
}

/**
 * Verify OTP for a given identifier
 */
export function verifyOTP(
    identifier: string,
    otp: string
): { success: boolean; message: string; attemptsRemaining?: number } {
    const record = otpStore.get(identifier);

    // No OTP found
    if (!record) {
        return {
            success: false,
            message: 'No OTP found. Please request a new one.'
        };
    }

    // OTP expired
    if (Date.now() > record.expiresAt) {
        otpStore.delete(identifier);
        return {
            success: false,
            message: 'OTP has expired. Please request a new one.'
        };
    }

    // Too many failed attempts
    if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
        otpStore.delete(identifier);
        return {
            success: false,
            message: 'Too many failed attempts. Please request a new OTP.'
        };
    }

    // Invalid OTP
    if (record.otp !== otp) {
        record.attempts++;
        const remaining = MAX_VERIFICATION_ATTEMPTS - record.attempts;

        if (remaining === 0) {
            otpStore.delete(identifier);
            return {
                success: false,
                message: 'Invalid OTP. Maximum attempts reached. Please request a new OTP.',
                attemptsRemaining: 0
            };
        }

        return {
            success: false,
            message: `Invalid OTP. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`,
            attemptsRemaining: remaining
        };
    }

    // OTP verified successfully
    otpStore.delete(identifier);
    return {
        success: true,
        message: 'OTP verified successfully.'
    };
}

/**
 * Check if user can request a new OTP (rate limiting)
 */
export function canResendOTP(identifier: string): {
    canResend: boolean;
    message: string;
    waitTime?: number;
} {
    const record = otpStore.get(identifier);

    if (!record) {
        return { canResend: true, message: 'OK' };
    }

    // Check resend count limit
    if (record.resendCount >= MAX_RESEND_ATTEMPTS) {
        return {
            canResend: false,
            message: `Maximum resend limit (${MAX_RESEND_ATTEMPTS}) reached. Please try again later.`
        };
    }

    // Check time-based rate limiting
    const timeSinceLastSend = Date.now() - record.lastSentAt;
    if (timeSinceLastSend < MIN_RESEND_INTERVAL_MS) {
        const waitTime = Math.ceil((MIN_RESEND_INTERVAL_MS - timeSinceLastSend) / 1000);
        return {
            canResend: false,
            message: `Please wait ${waitTime} seconds before requesting a new OTP.`,
            waitTime
        };
    }

    return { canResend: true, message: 'OK' };
}

/**
 * Check if OTP exists and is valid
 */
export function hasValidOTP(identifier: string): boolean {
    const record = otpStore.get(identifier);
    if (!record) return false;

    if (Date.now() > record.expiresAt) {
        otpStore.delete(identifier);
        return false;
    }

    return true;
}

/**
 * Get OTP info (for debugging in development only)
 */
export function getOTPInfo(identifier: string): {
    exists: boolean;
    expiresIn?: number;
    attempts?: number;
    resendCount?: number;
} {
    const record = otpStore.get(identifier);

    if (!record) {
        return { exists: false };
    }

    const expiresIn = Math.max(0, record.expiresAt - Date.now());

    return {
        exists: true,
        expiresIn,
        attempts: record.attempts,
        resendCount: record.resendCount
    };
}

/**
 * Clear OTP for a given identifier
 */
export function clearOTP(identifier: string): void {
    otpStore.delete(identifier);
}

/**
 * Clear all OTPs (for testing purposes only)
 */
export function clearAllOTPs(): void {
    otpStore.clear();
}

/**
 * Clean up expired OTPs (call this periodically)
 */
export function cleanupExpiredOTPs(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [identifier, record] of otpStore.entries()) {
        if (now > record.expiresAt) {
            otpStore.delete(identifier);
            cleanedCount++;
        }
    }

    if (cleanedCount > 0 && process.env.NODE_ENV === 'development') {
        console.log(`🧹 Cleaned up ${cleanedCount} expired OTP(s)`);
    }
}

/**
 * Get statistics about OTP store (for monitoring)
 */
export function getOTPStats(): {
    totalOTPs: number;
    activeOTPs: number;
    expiredOTPs: number;
} {
    const now = Date.now();
    let activeCount = 0;
    let expiredCount = 0;

    for (const record of otpStore.values()) {
        if (now > record.expiresAt) {
            expiredCount++;
        } else {
            activeCount++;
        }
    }

    return {
        totalOTPs: otpStore.size,
        activeOTPs: activeCount,
        expiredOTPs: expiredCount
    };
}

// Cleanup expired OTPs every minute (server-side only)
if (typeof window === 'undefined') {
    setInterval(cleanupExpiredOTPs, 60 * 1000);

    // Log stats every 10 minutes in development
    if (process.env.NODE_ENV === 'development') {
        setInterval(() => {
            const stats = getOTPStats();
            if (stats.totalOTPs > 0) {
                console.log('📊 OTP Stats:', stats);
            }
        }, 10 * 60 * 1000);
    }
}
