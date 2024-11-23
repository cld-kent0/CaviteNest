// app/api/admin/backup-restore/restore/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const formData = await req.formData(); // Get the form data
    const backupFile = formData.get('backupFile'); // Get the uploaded file

    if (!backupFile || !(backupFile instanceof File)) {
        return NextResponse.json({ error: 'Valid backup file is required' }, { status: 400 });
    }

    try {
        const backupDir = path.join(process.cwd(), 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const backupPath = path.join(backupDir, backupFile.name);
        
        // Save the uploaded file to disk
        const fileBuffer = await backupFile.arrayBuffer(); // Read file as ArrayBuffer
        const buffer = Buffer.from(fileBuffer); // Convert ArrayBuffer to Buffer
        
        // Write the buffer to the backup path
        await fs.promises.writeFile(backupPath, buffer as any); // Cast to 'any' to bypass the type check

        // Read the backup data
        const backupData = JSON.parse(await fs.promises.readFile(backupPath, 'utf8'));

        // Validate the structure of backup data
        if (!backupData.users || !backupData.listings || !backupData.reservations) {
            return NextResponse.json({ error: 'Invalid backup file structure' }, { status: 400 });
        }

        // Restore users, listings, and reservations (make sure to handle duplicates or existing records)
        await prisma.user.deleteMany(); // Clear existing users (optional)
        await prisma.listing.deleteMany(); // Clear existing listings (optional)
        await prisma.reservation.deleteMany(); // Clear existing reservations (optional)

        await prisma.user.createMany({ data: backupData.users });
        await prisma.listing.createMany({ data: backupData.listings });
        await prisma.reservation.createMany({ data: backupData.reservations });

        return NextResponse.json({ message: 'Data restored successfully' });
    } catch (error: unknown) { // Explicitly type the error
        console.error(error); // Log the error for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Failed to restore data', details: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
