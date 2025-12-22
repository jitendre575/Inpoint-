// OTP Generation and Storage
// In production, use Redis or a proper database for OTP storage
// For now, we'll use an in-memory store with expiration

interface OTPRecord {
    otp: string;
    expiresAt: number;
    attempts: number;
}

// In-memory store (use Redis in production)
const otpStore = new Map<string, OTPRecord>();

// Configuration
const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

/**
 * Generate a random OTP
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for a given identifier (email or phone)
 */
export function storeOTP(identifier: string, otp: string): void {
    otpStore.set(identifier, {
        otp,
        expiresAt: Date.now() + OTP_EXPIRY_MS,
        attempts: 0
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
        return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // OTP verified successfully
    otpStore.delete(identifier);
    return { success: true, message: 'OTP verified successfully.' };
}

/**
 * Clear OTP for a given identifier
 */
export function clearOTP(identifier: string): void {
    otpStore.delete(identifier);
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

// Cleanup expired OTPs every minute
if (typeof window === 'undefined') {
    setInterval(cleanupExpiredOTPs, 60 * 1000);
}
