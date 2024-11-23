import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { front, back, idtype } = body;

  // Validate the inputs
  if (!front || !back || !idtype) {
    return NextResponse.json(
      { message: "Front, back, and ID type are required." },
      { status: 400 }
    );
  }

  try {
    // Update the profile with the ID information
    const profile = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        idFront: front,
        idBack: back,
        idType: idtype,
      },
    });

    // Optionally mark the user as ID-verified
    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: { idStatus: 'pending' },
    });

    return NextResponse.json({ profile, user });
  } catch (error) {
    console.error("Error uploading ID details:", error);
    return NextResponse.error();
  }
}
