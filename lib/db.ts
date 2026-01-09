
import fs from 'fs';
import path from 'path';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

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

export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Failed' | 'Completed';

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
    createdAt: string;
    lastLogin?: string;
};


// Helper to hash password
export const hashPassword = (password: string): string => {
    return Buffer.from(password).toString('base64');
};

export const verifyPassword = (input: string, stored: string): boolean => {
    if (input === stored) return true;
    if (hashPassword(input) === stored) return true;
    return false;
};

// --- Async Data Access Layer ---

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

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
    if (USE_FIREBASE) {
        try {
            if (!db) {
                console.error("Firebase not initialized");
                return undefined;
            }
            const { query, where, collection, getDocs } = await import('firebase/firestore');
            const q = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { ...doc.data(), id: doc.data().id || doc.id } as User;
            }
            return undefined;
        } catch (e) {
            console.error("Firebase query error:", e);
            return undefined;
        }
    } else {
        const users = await getUsers();
        return users.find((u) => u.email === email);
    }
};

export const findUserByCredentials = async (identifier: string, password: string): Promise<User | undefined> => {
    if (USE_FIREBASE) {
        try {
            if (!db) {
                console.error("Firebase not initialized");
                return undefined;
            }
            const { query, where, collection, getDocs } = await import('firebase/firestore');
            const q = query(collection(db, "users"), where("email", "==", identifier));
            const querySnapshot = await getDocs(q);

            for (const doc of querySnapshot.docs) {
                const user = { ...doc.data(), id: doc.data().id || doc.id } as User;
                if (verifyPassword(password, user.password)) {
                    return user;
                }
            }
            return undefined;
        } catch (e) {
            console.error("Firebase query error:", e);
            // Fallback to scanning all
            const users = await getUsers();
            return users.find((u) =>
                (u.email === identifier || u.name === identifier) &&
                verifyPassword(password, u.password)
            );
        }
    } else {
        const users = await getUsers();
        return users.find((u) =>
            (u.email === identifier || u.name === identifier || u.email === identifier) &&
            verifyPassword(password, u.password)
        );
    }
};
