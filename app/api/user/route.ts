
import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const users = await getUsers();
        const user = users.find((u) => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Update lastActive
        user.lastActive = new Date().toISOString();
        await updateUser(user);

        // Return user without password
        const { password: _, ...userWithoutPass } = user;

        return NextResponse.json({ message: 'Success', user: userWithoutPass });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
