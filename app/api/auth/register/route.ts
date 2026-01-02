import { NextResponse } from 'next/server';
import { saveUser, findUserByEmail, User, hashPassword } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const newUser: User = {
            id: Math.random().toString(36).substring(2, 10).toUpperCase(),
            name,
            email,
            password: hashPassword(password),
            wallet: 0,
            plans: [],
            history: [],
            deposits: [],
            withdrawals: [],
            createdAt: new Date().toISOString(),
        };

        await saveUser(newUser);

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
