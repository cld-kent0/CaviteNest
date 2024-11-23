import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 } // Unauthorized
    );
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    return NextResponse.json(
      { message: "Invalid reservation ID" },
      { status: 400 } // Bad request
    );
  }

  try {
    // Find the reservation to get the listingId before deleting it
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { id: true, listingId: true },
    });

    if (!reservation) {
      return NextResponse.json(
        { message: "Reservation not found" },
        { status: 404 } // Not found
      );
    }

    // Delete the reservation
    const deletedReservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser.id }, // Creator of the reservation
          { listing: { userId: currentUser.id } }, // Creator of the listing
        ],
      },
    });

    // If no reservations were deleted
    if (deletedReservation.count === 0) {
      return NextResponse.json(
        { message: "User is not authorized to delete this reservation" },
        { status: 403 } // Forbidden
      );
    }

    // Check if there are any other reservations for the listing
    const listingReservations = await prisma.reservation.findMany({
      where: { listingId: reservation.listingId },
    });

    // If no reservations are left, unarchive the listing
    if (listingReservations.length === 0) {
      await prisma.listing.update({
        where: { id: reservation.listingId },
        data: { is_archived: false },
      });
    }

    return NextResponse.json({ message: "Reservation deleted successfully" });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting reservation:", error.message);
      return NextResponse.json(
        { message: "Error deleting reservation", error: error.message },
        { status: 500 } // Internal server error
      );
    } else {
      // Handle case where `error` is not an instance of `Error`
      console.error("Unknown error:", error);
      return NextResponse.json(
        { message: "An unknown error occurred" },
        { status: 500 } // Internal server error
      );
    }
  }
}
