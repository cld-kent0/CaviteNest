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
    interest,
    //imageSrc, 
    description,
    location,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const [ profile , user ] = await prisma.$transaction([
    prisma.profile.create({
      data: {
        interest,
        //imageSrc, // di ko alam kung kasama to - dars
        description,
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
