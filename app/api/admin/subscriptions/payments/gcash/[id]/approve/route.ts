import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Adjust based on your project structure

// Named export for the POST method
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 });
  }

  try {
    // Fetch the GcashPayment details
    const payment = await prisma.gcashPayment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Payment is already completed" },
        { status: 400 }
      );
    }

    // Create a new subscription based on the payment data
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: payment.userId,
        plan: payment.plan,
        period: payment.billingPeriod === "yearly" ? "yearly" : "quarterly",
        startDate: new Date(),
        endDate:
          payment.billingPeriod === "yearly"
            ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            : new Date(new Date().setMonth(new Date().getMonth() + 3)),
        paymentMethodType: "GCASH",
        subscriptionStatus: "ACTIVE",
      },
    });

    // Update the payment status to COMPLETED
    await prisma.gcashPayment.update({
      where: { id },
      data: {
        status: "COMPLETED",
        subscriptionId: newSubscription.id,
      },
    });

    // Update the user's plan and customerId
    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        plan: payment.plan,
        customerId: newSubscription.id,
      },
    });

    return NextResponse.json({
      message: "Payment approved and subscription created successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Error approving payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
