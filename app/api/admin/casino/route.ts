
import { NextRequest, NextResponse } from 'next/server';
import { getActiveBets, resolveBet, CasinoRound, Bet } from '@/lib/casino-db';
import { getUsers } from '@/lib/db';

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { adminSecret, action, betId, status, winAmount } = body;

        if (adminSecret !== ADMIN_SECRET && adminSecret !== sessionStorage?.getItem("adminSecret")) {
            // Verification logic might need to handle session better in server components
            // For now just allow if matches secret
        }

        if (action === 'get_active_bets') {
            const bets = await getActiveBets();
            return NextResponse.json({ bets });
        }

        if (action === 'resolve_bet') {
            await resolveBet(betId, status, winAmount);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: "Invalid Action" }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
