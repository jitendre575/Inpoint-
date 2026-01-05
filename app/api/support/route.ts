import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, message, type = 'text', problemType, action, isTyping } = body;

        const users = await getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (action === 'typing') {
            user.lastTyping = {
                sender: 'user',
                timestamp: new Date().toISOString(),
                isTyping: !!isTyping
            };
            await updateUser(user);
            return NextResponse.json({ message: 'Typing updated' });
        }

        if (!userId || !message) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        if (!user.supportChats) {
            user.supportChats = [];
        }

        let finalMessage = message;
        if (problemType) {
            finalMessage = `[Issue: ${problemType}] ${message}`;
        }

        const newMessage = {
            id: Date.now().toString(),
            sender: 'user' as const,
            message: finalMessage,
            timestamp: new Date().toISOString(),
            read: false,
            type: type,
            status: 'sent' as const // Added status
        };

        user.supportChats.push(newMessage);
        user.lastTyping = { sender: 'user', timestamp: new Date().toISOString(), isTyping: false };

        await updateUser(user);

        return NextResponse.json({ message: 'Sent', chat: newMessage });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return NextResponse.json({ chats: [], lastTyping: null });

    return NextResponse.json({
        chats: user.supportChats || [],
        lastTyping: user.lastTyping
    });
}
