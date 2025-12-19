
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

export const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
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
