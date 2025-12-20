
import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const users = getUsers();
        const user = users.find((u) => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Return user without password
        const { password: _, ...userWithoutPass } = user;

        return NextResponse.json({ message: 'Success', user: userWithoutPass });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
