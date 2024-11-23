import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    contactNo,
    interest,
    imageSrc, // aalisin na to - dars
    description,
    location,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  if (!Array.isArray(interest)) {
    return NextResponse.error();
  }

  const cleanedInterest = interest
    .flat() // Flatten any nested arrays
    .filter(item => typeof item === 'string' && item.trim() !== ''); // Keep only valid strings

  const [ profile , user ] = await prisma.$transaction([
    prisma.profile.create({
      data: {
        interest: {
          set: cleanedInterest,
        },
        description,
        contactNo,
        userId: currentUser.id,
        location: location.value,
      },
    }),
    prisma.user.update({
      where: { id: currentUser.id },
      data: { profileCreated: true },
    }),
  ]);

  return NextResponse.json({profile, user});
}
