// app/api/subscription/payment-history/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function GET(req: Request) {
  try {
    // Get session using getServerSession
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch GCash payment history for the user
    const gcashPayments = await prisma.gcashPayment.findMany({
      where: { userId: user.id },
      select: {
        createdAt: true,
        price: true,
        plan: true,
      },
    });

    // Fetch subscription history for the user
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      select: {
        createdAt: true,
        plan: true,
        period: true,
      },
    });

    // Format GCash payment data
    const formattedPayments = gcashPayments.map((payment) => ({
      date: payment.createdAt.toISOString(),
      amount: `₱ ${payment.price}`,
      plan: payment.plan,
    }));

    // Format subscription data
    const formattedSubscriptions = subscriptions.map((subscription) => {
      const price =
        subscription.plan === "premium"
          ? subscription.period === "quarterly"
            ? 699
            : 1249
          : subscription.plan === "business"
          ? subscription.period === "quarterly"
            ? 999
            : 1849
          : null;

      return {
        date: subscription.createdAt.toISOString(),
        amount: price ? `₱ ${price}` : "N/A",
        plan: subscription.plan,
      };
    });

    // Combine and sort by date
    const history = [...formattedPayments, ...formattedSubscriptions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}