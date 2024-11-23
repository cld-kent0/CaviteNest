import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb'; // Make sure you have the Prisma client initialized in this file

// GET request to fetch the QR code information
export async function GET() {
  try {
    const qrCode = await prisma.qRCode.findFirst(); // Adjust if you need to filter by certain criteria
    if (!qrCode) {
      return NextResponse.json({ message: 'QR Code not found' }, { status: 404 });
    }
    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Error fetching QR Code:', error);
    return NextResponse.json({ message: 'Failed to fetch QR Code' }, { status: 500 });
  }
}
