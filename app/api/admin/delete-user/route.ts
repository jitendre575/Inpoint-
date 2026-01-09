import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminSecret, userId } = body;

        // Verify admin secret
        if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'admin123') { // Fallback for dev
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        await deleteUser(userId);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        console.error("Admin Delete Error:", error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
