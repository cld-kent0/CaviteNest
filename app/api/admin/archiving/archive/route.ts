import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", data); // Log received data to confirm payload
    const { id, type } = data;

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    if (type === "listing") {
      result = await prisma.listing.update({
        where: { id },
        data: { is_archived: true },
      });
    } else if (type === "lessor" || type === "lessee") {
      result = await prisma.user.update({
        where: { id },
        data: { is_archived: true },
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error archiving the item" },
      { status: 500 }
    );
  }
}
