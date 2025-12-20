
import fs from 'fs';
import path from 'path';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'users.json');

// Ensure data directory exists (only for local fs)
if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify([]), 'utf-8');
        }
    } catch (e) {
        // Ignore errors in environments where fs is not available (like Vercel production without local fallback)
        console.warn("FS setup failed (expected in read-only envs if not using Firebase):", e);
    }
}

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    wallet: number;
    plans: any[];
    history: any[];
    deposits?: any[];
    withdrawals?: any[];
    supportChats?: {
        id: string;
        sender: 'user' | 'admin';
        message: string;
        timestamp: string;
        read: boolean;
        type?: 'text' | 'image';
    }[];
    lastTyping?: {
        sender: 'user' | 'admin';
        timestamp: string;
        isTyping: boolean;
    };
    createdAt: string;
    lastLogin?: string;
};

// Mode detection
const USE_FIREBASE = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

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
            const querySnapshot = await getDocs(collection(db, "users"));
            const users: User[] = [];
            querySnapshot.forEach((doc: any) => {
                users.push(doc.data() as User);
            });
            return users;
        } catch (e) {
            console.error("Firebase get users error:", e);
            return [];
        }
    } else {
        // Local FS Fallback
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
    // In Firebase we could query, but scanning all for simplicity implies we should keep 'getUsers' as source of truth?
    // Scanning all is inefficient for DB, but fine for small scale. 
    // Ideally use query(collection(db, "users"), where("email", "==", email))
    const users = await getUsers();
    return users.find((u) => u.email === email);
};

export const findUserByCredentials = async (identifier: string, password: string): Promise<User | undefined> => {
    const users = await getUsers();
    return users.find((u) =>
        (u.email === identifier || u.name === identifier || u.email === identifier) &&
        verifyPassword(password, u.password)
    );
};
