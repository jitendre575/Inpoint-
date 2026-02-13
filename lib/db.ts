
import fs from 'fs';
import path from 'path';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Mode detection - Use Firebase if configured, otherwise local FS (dev only)
const USE_FIREBASE = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'users.json');

// Ensure data directory exists ONLY in development with local FS
if (typeof window === 'undefined' && !USE_FIREBASE && !IS_PRODUCTION) {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify([]), 'utf-8');
        }
    } catch (e) {
        console.warn("FS setup failed (expected in read-only envs):", e);
    }
}

export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Failed' | 'Completed' | 'Successful';

export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    wallet: number;
    plans: any[];
    history: any[];
    profilePhoto?: string;
    isBlocked?: boolean;
    isDeleted?: boolean;
    deposits?: {
        id: string;
        amount: number;
        method: string;
        status: TransactionStatus;
        date: string;
        screenshot?: string;
    }[];
    withdrawals?: {
        id: string;
        amount: number;
        bankDetails: any;
        status: TransactionStatus;
        date: string;
    }[];
    supportChats?: {
        id: string;
        sender: 'user' | 'admin';
        message: string;
        timestamp: string;
        read: boolean;
        type?: 'text' | 'image';
        status?: 'sent' | 'delivered';
    }[];
    lastTyping?: {
        sender: 'user' | 'admin';
        timestamp: string;
        isTyping: boolean;
    };
    referralCode: string;
    referredBy?: string;
    referralRewards?: number;
    promoCode?: string | null;
    promoUsed?: string | null;
    bonus?: number;
    bonusClaimed?: boolean;
    walletDetails?: {
        balance: number;
        bonus: number;
    };
    createdAt: string;
    lastLogin?: string;
    lastActive?: string;
    walletHistory?: {
        amount: number;
        type: 'add' | 'deduct';
        reason: string;
        date: string;
    }[];
    status?: 'Active' | 'Verifying' | 'Blocked';
};

export type BlockedUser = {
    email: string;
    phone: string;
    blocked: boolean;
};


// Helper to hash password
export const hashPassword = (password: string): string => {
    return Buffer.from(password).toString('base64');
};

export const decodePassword = (encoded: string): string => {
    try {
        return Buffer.from(encoded, 'base64').toString('utf-8');
    } catch (e) {
        return encoded;
    }
};

export const verifyPassword = (input: string, stored: string): boolean => {
    if (input === stored) return true;
    if (hashPassword(input) === stored) return true;
    return false;
};

// --- Async Data Access Layer ---

const blockedDbPath = path.join(dataDir, 'blocked.json');

export const getBlockedUsers = async (): Promise<BlockedUser[]> => {
    if (USE_FIREBASE) {
        try {
            if (!db) return [];
            const querySnapshot = await getDocs(collection(db, "blockedUsers"));
            const blocked: BlockedUser[] = [];
            querySnapshot.forEach((doc: any) => blocked.push(doc.data() as BlockedUser));
            return blocked;
        } catch (e) {
            return [];
        }
    } else {
        try {
            if (!fs.existsSync(blockedDbPath)) return [];
            return JSON.parse(fs.readFileSync(blockedDbPath, 'utf-8'));
        } catch (e) {
            return [];
        }
    }
};

export const blockUser = async (email: string, phone: string) => {
    const blockedEntry: BlockedUser = { email, phone, blocked: true };
    if (USE_FIREBASE) {
        if (!db) return;
        await setDoc(doc(db, "blockedUsers", email), blockedEntry);
    } else {
        const blocked = await getBlockedUsers();
        blocked.push(blockedEntry);
        fs.writeFileSync(blockedDbPath, JSON.stringify(blocked, null, 2), 'utf-8');
    }
};

export const isUserBanned = async (email: string, phone: string): Promise<boolean> => {
    const blocked = await getBlockedUsers();
    return blocked.some(b => b.email === email || b.phone === phone);
};

export const getUsers = async (): Promise<User[]> => {
    if (USE_FIREBASE) {
        try {
            if (!db) {
                console.error("Firebase not initialized");
                if (IS_PRODUCTION) {
                    throw new Error("Database not configured. Please set up Firebase.");
                }
                return [];
            }
            const querySnapshot = await getDocs(collection(db, "users"));
            const users: User[] = [];
            querySnapshot.forEach((doc: any) => {
                const userData = doc.data();
                users.push({ ...userData, id: userData.id || doc.id } as User);
            });
            return users;
        } catch (e) {
            console.error("Firebase get users error:", e);
            if (IS_PRODUCTION) {
                throw new Error("Database error. Please try again later.");
            }
            return [];
        }
    } else {
        // Local FS Fallback (development only)
        if (IS_PRODUCTION) {
            throw new Error("Production requires Firebase configuration");
        }
        try {
            if (!fs.existsSync(dbPath)) return [];
            const data = fs.readFileSync(dbPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading users.json:", error);
            return [];
        }
    }
};

export const saveUser = async (user: User) => {
    if (USE_FIREBASE) {
        try {
            if (!db) throw new Error("Firebase not initialized");
            await setDoc(doc(db, "users", user.id), user);
        } catch (e: any) {
            throw new Error(`Firebase Save Error: ${e.message}`);
        }
    } else {
        const users = await getUsers(); // reuse async but implementation is sync-ish for fs
        if (!Array.isArray(users)) {
            // In FS mode, getUsers returns array, so this is safe
            throw new Error("Local DB corruption");
        }
        users.push(user);
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
    }
};

export const updateUser = async (updatedUser: User) => {
    if (USE_FIREBASE) {
        try {
            if (!db) {
                console.error("Firebase not initialized");
                return;
            }
            await setDoc(doc(db, "users", updatedUser.id), updatedUser, { merge: true });
        } catch (e) {
            console.error("Firebase update error:", e);
        }
    } else {
        const users = await getUsers();
        const index = users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
        }
    }
};

export const deleteUser = async (userId: string) => {
    const user = (await getUsers()).find(u => u.id === userId);
    if (user) {
        await blockUser(user.email, user.phone || "");
    }

    if (USE_FIREBASE) {
        try {
            if (!db) throw new Error("Firebase not initialized");
            // Hard delete - Permanent removal
            await deleteDoc(doc(db, "users", userId));
        } catch (e: any) {
            throw new Error(`Firebase Delete Error: ${e.message}`);
        }
    } else {
        const users = await getUsers();
        const index = users.findIndex((u) => u.id === userId);
        if (index !== -1) {
            users.splice(index, 1);
            fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
        }
    }
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
    const users = await getUsers();
    return users.find((u) => u.email === email);
};

export const findUserByPhone = async (phone: string): Promise<User | undefined> => {
    const users = await getUsers();
    return users.find((u) => u.phone === phone);
};

export const findUserByIdentifier = async (identifier: string): Promise<User | undefined> => {
    const users = await getUsers();
    return users.find((u) => u.email === identifier || u.phone === identifier || u.name === identifier);
};

export const findUserByCredentials = async (identifier: string, password: string): Promise<User | undefined> => {
    const user = await findUserByIdentifier(identifier);
    if (user && verifyPassword(password, user.password)) {
        return user;
    }
    return undefined;
};

