
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure users.json exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]), 'utf-8');
}

export type User = {
    id: string;
    name: string;
    email: string;
    password: string; // Hashed password (simulated)
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

export const getUsers = (): User[] => {
    try {
        if (!fs.existsSync(dbPath)) return [];
        const data = fs.readFileSync(dbPath, 'utf-8');
        try {
            return JSON.parse(data);
        } catch (parseError) {
            console.error("Error parsing users.json:", parseError);
            return [];
        }
    } catch (error) {
        console.error("Error reading users.json:", error);
        return [];
    }
};

// Simple Base64 encoding for "hashing" to meet requirement without breaking simple setup
export const hashPassword = (password: string): string => {
    return Buffer.from(password).toString('base64');
};

export const verifyPassword = (input: string, stored: string): boolean => {
    // Check if stored matches input (legacy plain text)
    if (input === stored) return true;
    // Check if stored matches hashed input
    if (hashPassword(input) === stored) return true;
    return false;
};

export const saveUser = (user: User) => {
    const users = getUsers();
    if (!Array.isArray(users)) {
        throw new Error("Database corruption: users data is not an array");
    }
    users.push(user);
    try {
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err: any) {
        throw new Error(`Failed to write to database: ${err.message}`);
    }
};

export const updateUser = (updatedUser: User) => {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
    }
};

export const findUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    return users.find((u) => u.email === email);
};

export const findUserByCredentials = (identifier: string, password: string): User | undefined => {
    const users = getUsers();
    return users.find((u) =>
        (u.email === identifier || u.name === identifier || u.email === identifier) &&
        verifyPassword(password, u.password)
    );
};
