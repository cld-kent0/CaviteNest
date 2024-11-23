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
        { error: "Completed payments cannot be declined" },
        { status: 400 }
      );
    }

    // Update the payment status to DECLINED
    await prisma.gcashPayment.update({
      where: { id },
      data: {
        status: "DECLINED",
      },
    });

    return NextResponse.json({
      message: "Payment declined successfully",
    });
  } catch (error) {
    console.error("Error declining payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
