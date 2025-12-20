
import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminSecret, userId, message, action } = body;

        // Verify Admin
        if (adminSecret !== "335524JI") {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (!user.supportChats) {
            user.supportChats = [];
        }

        if (action === 'reply') {
            const newMessage = {
                id: Date.now().toString(),
                sender: 'admin' as const,
                message: message,
                timestamp: new Date().toISOString(),
                read: false,
                type: 'text' as const
            };
            user.supportChats.push(newMessage);

            // Also mark all user messages as read
            user.supportChats.forEach(msg => {
                if (msg.sender === 'user') msg.read = true;
            });

        } else if (action === 'mark_read') {
            user.supportChats.forEach(msg => {
                if (msg.sender === 'user') msg.read = true;
            });
        } else if (action === 'typing') {
            const { isTyping } = body;
            user.lastTyping = {
                sender: 'admin',
                timestamp: new Date().toISOString(),
                isTyping: !!isTyping
            };
        }

        await updateUser(user);
        return NextResponse.json({ message: 'Success', chats: user.supportChats });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
