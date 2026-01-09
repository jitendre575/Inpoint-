
import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser, getUsers } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, profilePhoto, phone, name } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Apply updates
        if (profilePhoto) user.profilePhoto = profilePhoto;
        if (phone) user.phone = phone;
        if (name) user.name = name;

        await updateUser(user);

        // Remove password
        const { password: _, ...cleanUser } = user;

        return NextResponse.json({ message: 'Profile updated', user: cleanUser });
    } catch (error) {
        console.error("Profile Update API Error:", error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
