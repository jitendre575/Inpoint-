/**
 * Production-Ready OTP Validation Utilities
 * Strict validation for Indian mobile numbers
 */

/**
 * Validate Indian mobile number
 * Rules:
 * - Exactly 10 digits
 * - Only numeric characters (0-9)
 * - Must start with 6, 7, 8, or 9 (valid Indian mobile prefixes)
 */
export function isValidIndianMobile(phone: string): { valid: boolean; message: string } {
    // Remove all whitespace
    const cleaned = phone.trim().replace(/\s+/g, '');

    // Check if contains only digits
    if (!/^\d+$/.test(cleaned)) {
        return {
            valid: false,
            message: 'Mobile number must contain only digits (0-9)'
        };
    }

    // Check exact length
    if (cleaned.length !== 10) {
        return {
            valid: false,
            message: `Mobile number must be exactly 10 digits. You entered ${cleaned.length} digits.`
        };
    }

    // Check if starts with valid Indian mobile prefix (6, 7, 8, or 9)
    const firstDigit = cleaned[0];
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
        return {
            valid: false,
            message: 'Invalid Indian mobile number. Must start with 6, 7, 8, or 9.'
        };
    }

    return {
        valid: true,
        message: 'Valid mobile number'
    };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): { valid: boolean; message: string } {
    const cleaned = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleaned)) {
        return {
            valid: false,
            message: 'Invalid email format. Please enter a valid email address.'
        };
    }

    return {
        valid: true,
        message: 'Valid email'
    };
}

/**
 * Normalize phone number to E.164 format (+91XXXXXXXXXX)
 */
export function normalizePhoneToE164(phone: string): string {
    const cleaned = phone.trim().replace(/\s+/g, '');
    return `+91${cleaned}`;
}

/**
 * Normalize phone number for storage (91XXXXXXXXXX)
 */
export function normalizePhoneForStorage(phone: string): string {
    const cleaned = phone.trim().replace(/\s+/g, '');
    return `91${cleaned}`;
}

/**
 * Detect if identifier is email or phone
 */
export function detectIdentifierType(identifier: string): 'email' | 'phone' | 'unknown' {
    const emailCheck = isValidEmail(identifier);
    if (emailCheck.valid) return 'email';

    const phoneCheck = isValidIndianMobile(identifier);
    if (phoneCheck.valid) return 'phone';

    return 'unknown';
}

/**
 * Validate and normalize identifier
 */
export function validateAndNormalizeIdentifier(identifier: string): {
    valid: boolean;
    type: 'email' | 'phone' | 'unknown';
    normalized: string;
    message: string;
} {
    const type = detectIdentifierType(identifier);

    if (type === 'email') {
        return {
            valid: true,
            type: 'email',
            normalized: identifier.trim().toLowerCase(),
            message: 'Valid email'
        };
    }

    if (type === 'phone') {
        const phoneValidation = isValidIndianMobile(identifier);
        return {
            valid: true,
            type: 'phone',
            normalized: normalizePhoneForStorage(identifier),
            message: 'Valid mobile number'
        };
    }

    return {
        valid: false,
        type: 'unknown',
        normalized: '',
        message: 'Please enter a valid email address or 10-digit Indian mobile number'
    };
}
