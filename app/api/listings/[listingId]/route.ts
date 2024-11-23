import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
  }

  const { action } = await request.json();

  if (action === "archive") {
    // Archive the listing
    const updatedListing = await prisma.listing.updateMany({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
      data: {
        is_archived: true,
      },
    });

    return NextResponse.json(updatedListing);
  }

  if (action === "unarchive") {
    // Unarchive the listing
    const updatedListing = await prisma.listing.updateMany({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
      data: {
        is_archived: false,
      },
    });

    return NextResponse.json(updatedListing);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
  }

  // Try to delete the listing
  try {
    const deletedListing = await prisma.listing.delete({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(deletedListing);
  } catch (error) {
    return NextResponse.json({ error: "Error deleting listing or listing not found" }, { status: 404 });
  }
}
