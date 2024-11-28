import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DeleteRequestBody {
  type: "listing" | "lessor" | "lessee";
  id: string;
}

export async function DELETE(req: NextRequest) {
  const { type, id }: DeleteRequestBody = await req.json();

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    if (type === "listing") {
      await prisma.listing.delete({ where: { id } });
    } else if (type === "lessor" || type === "lessee") {
      await prisma.user.delete({ where: { id } });
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ message: `${type} deleted successfully` });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json(
      {
        message: "Error deleting",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
