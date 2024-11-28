import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    const payments = await prisma.gcashPayment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            customerId: true,
          },
        },
        subscription: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching Gcash payments:", error);
    return NextResponse.error();
  }
}
