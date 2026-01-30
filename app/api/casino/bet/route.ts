
import { NextRequest, NextResponse } from 'next/server';
import { placeBet, getCurrentRound, createRound } from '@/lib/casino-db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, gameId, amount, choice } = body;

        if (!userId || !gameId || !amount || choice === undefined) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        let round = await getCurrentRound(gameId);
        if (!round) {
            round = await createRound(gameId);
        }

        const bet = await placeBet(userId, gameId, round.id, amount, choice);
        return NextResponse.json({ success: true, bet });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
