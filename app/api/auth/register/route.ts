import { NextResponse } from 'next/server';

/**
 * User Registration API - DISABLED
 * 
 * This endpoint has been disabled as part of security requirements.
 * Public user registration is not allowed.
 * 
 * New users can only be created by administrators through the admin panel.
 * Any attempt to access this endpoint will return a 403 Forbidden error.
 */
export async function POST(request: Request) {
    return NextResponse.json(
        {
            message: 'Public registration is disabled. Please contact an administrator to create an account.',
            error: 'REGISTRATION_DISABLED'
        },
        { status: 403 }
    );
}

export async function GET(request: Request) {
    return NextResponse.json(
        {
            message: 'Public registration is disabled. Please contact an administrator to create an account.',
            error: 'REGISTRATION_DISABLED'
        },
        { status: 403 }
    );
}
