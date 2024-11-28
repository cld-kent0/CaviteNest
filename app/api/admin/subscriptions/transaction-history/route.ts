import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    const gcashPayments = await prisma.gcashPayment.findMany({
      include: {
        user: true,
        subscription: true,
      },
    });

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true,
      },
    });

    const transactions = [
      ...gcashPayments.map((payment) => ({
        id: payment.id,
        type: "Gcash Payment",
        user: payment.user.name,
        plan: payment.plan,
        billingPeriod: payment.billingPeriod,
        price: payment.price,
        status: payment.status,
        createdAt: payment.createdAt,
      })),
      ...subscriptions.map((subscription) => {
        // Calculate the subscription price based on the plan and period
        let price = null;
        if (subscription.plan === "premium") {
          price =
            subscription.period === "quarterly"
              ? 699
              : subscription.period === "yearly"
              ? 1249
              : null;
        } else if (subscription.plan === "business") {
          price =
            subscription.period === "quarterly"
              ? 999
              : subscription.period === "yearly"
              ? 1849
              : null;
        }

        return {
          id: subscription.id,
          type: "Subscription",
          user: subscription.user.name,
          plan: subscription.plan,
          period: subscription.period,
          price: price ? `₱ ${price}.00` : "N/A", // Assign the calculated price
          status: subscription.subscriptionStatus,
          createdAt: subscription.createdAt,
        };
      }),
    ];

    // Sort transactions by createdAt in descending order (most recent first)
    transactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
