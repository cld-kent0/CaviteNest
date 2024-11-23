import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Adjust the import based on your project structure

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const { paymentId, userId, plan } = body;

    // Log the incoming request payload for debugging
    console.log("Request Body:", { paymentId, userId, plan });

    // Validate the required fields
    if (!paymentId || !userId || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the payment details from the database
    const payment = await prisma.gcashPayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Check if the subscription is new or existing
    const isNewSubscription = !payment.subscriptionId;

    if (payment.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Payment is already completed" },
        { status: 400 }
      );
    }

    // Fetch the user details from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine subscription period and set dates
    const subscriptionPeriod = payment.billingPeriod === "yearly" ? "yearly" : "quarterly";
    const startDate = new Date();
    const endDate =
      subscriptionPeriod === "yearly"
        ? new Date(new Date().setFullYear(startDate.getFullYear() + 1))
        : new Date(new Date().setMonth(startDate.getMonth() + 3));

    // Create or update the subscription in the database
    const updatedSubscription = await prisma.subscription.upsert({
      where: isNewSubscription
        ? { userId }  // Use userId to create a new subscription
        : { id: payment.subscriptionId! },  // Use the subscriptionId to update an existing subscription
      create: {
        userId,
        plan,
        period: subscriptionPeriod,
        startDate,
        endDate,
        paymentMethodType: "GCASH",
        subscriptionStatus: "ACTIVE",
      },
      update: {
        plan,
        period: subscriptionPeriod,
        startDate,
        endDate,
      },
    });

    // Update the payment record to mark it as completed
    const updatedPayment = await prisma.gcashPayment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        subscriptionId: updatedSubscription.id,
      },
    });

    // Update the user's plan in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    // Respond with success and updated data
    return NextResponse.json({
      message: "Plan upgraded successfully",
      payment: updatedPayment,
      subscription: updatedSubscription,
      user: updatedUser,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error upgrading plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
