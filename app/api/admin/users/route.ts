
import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

const ADMIN_PASSWORD = "335524JI"; // Fixed admin password

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const allUsers = await getUsers();
        const users = allUsers.filter(u => !u.isDeleted);
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
