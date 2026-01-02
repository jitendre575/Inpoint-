import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const apkPath = path.join(process.cwd(), 'public', 'app', 'app-release.apk');

    if (!fs.existsSync(apkPath)) {
        return NextResponse.json({ error: 'APK file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(apkPath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': 'attachment; filename="app-release.apk"',
        },
    });
}
