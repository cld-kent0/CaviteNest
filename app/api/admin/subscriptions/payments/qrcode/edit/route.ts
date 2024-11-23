import prisma from '@/app/libs/prismadb'; // Update this with the actual path to your Prisma client
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { qrCodeData, qrCodeImage, id, accountNumber, accountName } = await req.json();

    if (!qrCodeData || !accountNumber || !accountName) {
      return NextResponse.json({ message: 'QR Code data, phone number, and account name are required' }, { status: 400 });
    }

    // If ID is provided, it's an update, otherwise, it's a create
    let qrCode;
    if (id) {
      // Update the QR code with the provided ID
      qrCode = await prisma.qRCode.update({
        where: { id: id },
        data: { qrCodeData, qrCodeImage, accountNumber, accountName },
      });
    } else {
      // Create a new QR code
      qrCode = await prisma.qRCode.create({
        data: {
          qrCodeData,
          qrCodeImage: qrCodeImage || null,
          accountNumber,
          accountName,
        },
      });
    }

    return NextResponse.json(qrCode, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
