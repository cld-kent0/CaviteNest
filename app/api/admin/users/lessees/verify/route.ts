import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const { id, idStatus, idFront, idBack, idType, role } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Lessee ID is required." },
        { status: 400 }
      );
    }

    // Validate required fields for ID verification
    if (idStatus === "verified") {
      if (!idFront || !idBack || !idType) {
        return NextResponse.json(
          {
            error:
              "ID Front, ID Back, and ID Type are required for verification.",
          },
          { status: 400 }
        );
      }
    }

    // Update user details, including ID verification fields
    const updatedLessee = await prisma.user.update({
      where: { id },
      data: {
        idStatus,
        idFront,
        idBack,
        idType,
        role: idStatus === "verified" ? "LESSOR" : role, // Promote to LESSOR if verified
      },
    });

    return NextResponse.json({
      message: `Lessee verification updated successfully.`,
      data: updatedLessee,
    });
  } catch (error) {
    console.error("Error updating Lessee verification:", error);
    return NextResponse.json(
      { error: "Failed to update verification status." },
      { status: 500 }
    );
  }
}
