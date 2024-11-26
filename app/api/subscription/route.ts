// app/api/subscription/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// Import your next-auth options

export async function GET(req: Request) {
  try {
    // Get session using getServerSession, which is compatible with NextRequest
    const session = await getServerSession(authOptions); // kinuha ko yung current user here - dars

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch the user's subscription plan from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email }, // Identifying the user by email
      select: {
        plan: true, // Assuming the 'plan' field exists in your user model
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Send the subscription plan as a response
    return NextResponse.json({ plan: user.plan }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
