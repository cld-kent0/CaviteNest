import { NextResponse } from 'next/server';
import prisma from "@/app/libs/prismadb";

export async function GET() {
  try {
    const aboutUs = await prisma.aboutUs.findFirst();
    if (!aboutUs) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }
    return NextResponse.json(aboutUs);
  } catch (error) {
    console.error('Error fetching About Us:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { vision, mission, heroImageSrc, heroTitle, heroDescription } = await request.json();

  try {
    let aboutUs = await prisma.aboutUs.findFirst();

    if (aboutUs) {
      aboutUs = await prisma.aboutUs.update({
        where: { id: aboutUs.id },
        data: { vision, mission, heroImageSrc, heroTitle, heroDescription },
      });
    } else {
      aboutUs = await prisma.aboutUs.create({
        data: { vision, mission, heroImageSrc, heroTitle, heroDescription },
      });
    }

    return NextResponse.json(aboutUs);
  } catch (error) {
    console.error('Error updating About Us:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
