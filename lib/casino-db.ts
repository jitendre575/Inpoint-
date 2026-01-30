
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getUsers, updateUser, User } from './db';

const USE_FIREBASE = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export type CasinoGame = {
    id: string;
    name: string;
    image: string;
    isActive: boolean;
    type: 'color' | 'mines' | 'crash' | 'dice';
};

export type CasinoRound = {
    id: string;
    gameId: string;
    roundNumber: number;
    startTime: string;
    endTime: string;
    status: 'Active' | 'Completed' | 'Cancelled';
    result?: any;
    totalBets?: number;
    totalAmount?: number;
};

export type Bet = {
    id: string;
    userId: string;
    userName: string;
    gameId: string;
    roundId: string;
    amount: number;
    choice: any;
    status: 'Pending' | 'Win' | 'Loss' | 'Refunded';
    winAmount?: number;
    createdAt: string;
};

// --- Games ---
export const getCasinoGames = async (): Promise<CasinoGame[]> => {
    // Default games
    const defaultGames: CasinoGame[] = [
        { id: 'color-predict', name: 'Color Prediction', image: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=400&auto=format&fit=crop', isActive: true, type: 'color' },
        { id: 'mines', name: 'Mines Gold', image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=400&auto=format&fit=crop', isActive: true, type: 'mines' },
        { id: 'dice-duel', name: 'Dice Duel', image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=400&auto=format&fit=crop', isActive: true, type: 'dice' },
    ];

    if (USE_FIREBASE) {
        try {
            if (!db) return defaultGames;
            const querySnapshot = await getDocs(collection(db, "casinoGames"));
            if (querySnapshot.empty) return defaultGames;
            const games: CasinoGame[] = [];
            querySnapshot.forEach((doc: any) => games.push(doc.data() as CasinoGame));
            return games;
        } catch (e) {
            return defaultGames;
        }
    }
    return defaultGames;
};

// --- Rounds ---
export const getCurrentRound = async (gameId: string): Promise<CasinoRound | null> => {
    if (USE_FIREBASE) {
        if (!db) return null;
        const q = query(collection(db, "casinoRounds"), where("gameId", "==", gameId), where("status", "==", "Active"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data() as CasinoRound;
        }
    }
    // Logic for creating new round if none active could go here
    return null;
};

export const createRound = async (gameId: string): Promise<CasinoRound> => {
    const roundNumber = Date.now();
    const newRound: CasinoRound = {
        id: `round_${roundNumber}`,
        gameId,
        roundNumber,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60000).toISOString(), // 1 minute round
        status: 'Active',
        totalBets: 0,
        totalAmount: 0
    };

    if (USE_FIREBASE && db) {
        await setDoc(doc(db, "casinoRounds", newRound.id), newRound);
    }
    return newRound;
};

// --- Bets ---
export const placeBet = async (userId: string, gameId: string, roundId: string, amount: number, choice: any): Promise<Bet> => {
    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    if (!user || user.wallet < amount) {
        throw new Error("Insufficient balance");
    }

    const bet: Bet = {
        id: `bet_${Date.now()}_${userId}`,
        userId,
        userName: user.name,
        gameId,
        roundId,
        amount,
        choice,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    // Deduct from wallet
    user.wallet -= amount;
    if (!user.walletHistory) user.walletHistory = [];
    user.walletHistory.push({
        amount,
        type: 'deduct',
        reason: `Casino Bet: ${gameId}`,
        date: new Date().toISOString()
    });

    await updateUser(user);

    if (USE_FIREBASE && db) {
        await setDoc(doc(db, "casinoBets", bet.id), bet);

        // Update round stats
        const roundRef = doc(db, "casinoRounds", roundId);
        const roundSnap = await getDoc(roundRef);
        if (roundSnap.exists()) {
            const roundData = roundSnap.data() as CasinoRound;
            await updateDoc(roundRef, {
                totalBets: (roundData.totalBets || 0) + 1,
                totalAmount: (roundData.totalAmount || 0) + amount
            });
        }
    }

    return bet;
};

export const getActiveBets = async (): Promise<Bet[]> => {
    if (USE_FIREBASE && db) {
        const q = query(collection(db, "casinoBets"), where("status", "==", "Pending"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Bet);
    }
    return [];
};

export const resolveBet = async (betId: string, status: 'Win' | 'Loss', winAmount: number = 0) => {
    if (USE_FIREBASE && db) {
        const betRef = doc(db, "casinoBets", betId);
        const betSnap = await getDoc(betRef);
        if (betSnap.exists()) {
            const betData = betSnap.data() as Bet;
            if (betData.status !== 'Pending') return;

            await updateDoc(betRef, { status, winAmount });

            if (status === 'Win' && winAmount > 0) {
                const users = await getUsers();
                const user = users.find(u => u.id === betData.userId);
                if (user) {
                    user.wallet += winAmount;
                    user.walletHistory?.push({
                        amount: winAmount,
                        type: 'add',
                        reason: `Casino Win: ${betData.gameId}`,
                        date: new Date().toISOString()
                    });
                    await updateUser(user);
                }
            }
        }
    }
};
