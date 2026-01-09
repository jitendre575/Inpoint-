
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminSecret, userId } = body;

        if (adminSecret !== '335524JI' && adminSecret !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.isBlocked = !user.isBlocked;
        await updateUser(user);

        const { password: _, ...cleanUser } = user;
        return NextResponse.json({ message: 'Success', user: cleanUser });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
