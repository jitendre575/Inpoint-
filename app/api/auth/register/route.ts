
import { NextResponse } from 'next/server';
import { findUserByEmail, saveUser, User } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            password: password, // Store plain text as requested
            wallet: 0,
            plans: [],
            history: [],
            createdAt: new Date().toISOString(),
        };

        saveUser(newUser);

        return NextResponse.json({ message: 'User created successfully', user: { ...newUser, password: undefined } });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
