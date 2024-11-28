import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id } = body;

    if (!id || !type) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const updateData = { is_archived: false };

    let result;
    if (type === "listing") {
      result = await prisma.listing.update({ where: { id }, data: updateData });
    } else if (["lessor", "lessee"].includes(type)) {
      result = await prisma.user.update({ where: { id }, data: updateData });
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Unarchived successfully", result },
      { status: 200 }
    );
  } catch (error) {
    // Type narrowing for `error`
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
