import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(req: Request) {
  try {
    const { id, idStatus, idFront, idBack, idType} = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Lessor ID is required.' }, { status: 400 });
    }

    // Validate required fields for ID verification
    if (idStatus === 'verified') {
      if (!idFront || !idBack || !idType) {
        return NextResponse.json(
          { error: 'ID Front, ID Back, and ID Type are required for verification.' },
          { status: 400 }
        );
      }
    }

    const updatedLessor = await prisma.user.update({
      where: { id },
      data: { 
        idStatus,
        idFront,
        idBack,
        idType,
       },
    });

    return NextResponse.json({
      message: `Lessor verification updated successfully.`,
      data: updatedLessor,
    });
  } catch (error) {
    console.error('Error updating lessor verification:', error);
    return NextResponse.json({ error: 'Failed to update verification status.' }, { status: 500 });
  }
}
