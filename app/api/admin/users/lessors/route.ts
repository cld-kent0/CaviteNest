// app/api/admin/lessors/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    // Fetch users with the role of 'LESSOR' and their subscriptions
    const lessors = await prisma.user.findMany({
      where: {
        role: "LESSOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        is_archived: true,
        idStatus: true,
        idFront: true,
        idBack: true,
        idType: true,
        image: true,
        Subscription: {
          // Include subscription details
          select: {
            plan: true,
            period: true,
            startDate: true,
            endDate: true,
            subscriptionStatus: true,
          },
        },
      },
    });

    return NextResponse.json(lessors);
  } catch (error) {
    console.error("Error fetching lessors:", error);
    return NextResponse.error();
  }
}
