import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { plan, billingPeriod, receiptFile, price, status,  referenceNo } = body;

    // Validate the input data
    if (!plan || !billingPeriod || !price || !receiptFile) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Convert price to a float
    //   const priceAsFloat = parseFloat(price.replace(/[₱,]/g, '').trim());  // Remove currency symbols and commas

    //  if (isNaN(priceAsFloat)) {
    //   return NextResponse.json({ message: "Invalid price format" }, { status: 400 });
    //  }
    

    const userId = currentUser.id;

    // Check if the user already has a GcashPayment record
    const existingPayment = await prisma.gcashPayment.findFirst({
      where: { 
        userId,
        status: "PENDING", // Add the condition for status
       },
    });

    if (existingPayment) {
      return NextResponse.json({ message: "A payment record already exists for this user." }, { status: 409 });
    }

    // Create a new GcashPayment record
    const payment = await prisma.gcashPayment.create({
      data: {
        userId,
        plan,
        billingPeriod,
        receiptFile: receiptFile || null,
        referenceNo: referenceNo || null, // Include the optional reference number
        price,  // Use the parsed float here
        status, // Default status
      },
    });

    return NextResponse.json({ message: "GcashPayment record created successfully", payment }, { status: 201 });
  } catch (error) {
    console.error("Error creating GcashPayment record:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
