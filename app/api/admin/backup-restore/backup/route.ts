// app/api/admin/backup-restore/backup/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST() {
    try {
        // Fetch data from the database
        const users = await prisma.user.findMany();
        const listings = await prisma.listing.findMany();
        const reservations = await prisma.reservation.findMany();
        const backupData = { users, listings, reservations };

        // Define the backup directory path
        const backupPath = path.join(process.cwd(), 'backups');

        // Check if the backups directory exists, if not create it
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true }); // Ensure the directory structure is created
        }

        // Generate a unique backup file name based on the current timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replace invalid characters
        const backupFile = path.join(backupPath, `backup_${timestamp}.json`);

        // Write the backup data to the file
        fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

        // Return a successful response with the backup file path
        return NextResponse.json({ message: 'Backup created successfully', backupFile });
    } catch (error: unknown) { // Explicitly type the error
        console.error(error); // Log the error for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Failed to create backup', details: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma connection is closed
    }
}
