import { NextResponse } from 'next/server';

/**
 * OTP Login API - DISABLED
 * 
 * This endpoint has been disabled as part of security requirements.
 * Only email/password login is allowed.
 * 
 * Any attempt to access this endpoint will return a 403 Forbidden error.
 */
export async function POST(request: Request) {
    return NextResponse.json(
        {
            message: 'OTP login is disabled. Please use email/password login.',
            error: 'FEATURE_DISABLED'
        },
        { status: 403 }
    );
}

export async function GET(request: Request) {
    return NextResponse.json(
        {
            message: 'OTP login is disabled. Please use email/password login.',
            error: 'FEATURE_DISABLED'
        },
        { status: 403 }
    );
}
