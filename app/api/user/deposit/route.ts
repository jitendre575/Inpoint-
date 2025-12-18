
import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/db';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const amount = Number(formData.get('amount'));
        const utr = formData.get('utr') as string;
        const file = formData.get('screenshot') as File;

        if (!email || !amount || !utr || !file) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Handle File Upload
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads'); // Updated for robust creation check

        // Ensure dir exists (redundant if mkdir was run, but safe)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const screenshotUrl = `/uploads/${filename}`;

        // Create Deposit Record
        const deposit = {
            id: Date.now().toString(),
            amount,
            utr,
            screenshotUrl,
            status: 'Pending',
            date: new Date().toISOString()
        };

        if (!user.deposits) user.deposits = [];
        user.deposits.push(deposit);

        updateUser(user);

        // Remove password
        const { password: _, ...cleanUser } = user;

        return NextResponse.json({ message: 'Deposit request submitted', deposit, user: cleanUser });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
    }
}
