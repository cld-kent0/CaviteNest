import { stripe } from "@/app/libs/stripe";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

// this is for the cancelation of subcription -dars

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Missing subscription ID" },
        { status: 400 }
      );
    }

    // Fetch user and subscription from database
    const user = await prisma.user.findFirst({
      where: { Subscription: { id: subscriptionId } },
      include: { Subscription: true },
    });

    if (!user || !user.Subscription) {
      return NextResponse.json(
        { error: "User or subscription not found" },
        { status: 404 }
      );
    }

    // Cancel the subscription on Stripe
    // await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

    // Update subscription status in Prisma
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { subscriptionStatus: "CANCELLED" },
    });

    // Update subscription status in Prisma
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: "free",
      },
    });

    return NextResponse.json({
      message: "Subscription cancellation initiated",
    });
  } catch (error) {
    console.error("Error during subscription cancellation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
