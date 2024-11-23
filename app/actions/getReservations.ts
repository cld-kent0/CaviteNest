import prisma from "@/app/libs/prismadb";
import { SafeReservation, SafeUser } from "../types";  // Import types

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: IParams): Promise<SafeReservation[]> {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Safely map the reservations with default values for null fields
    const safeReservations: SafeReservation[] = reservations.map((reservation) => ({
      id: reservation.id,
      userId: reservation.userId,
      listingId: reservation.listingId,
      listingOwner: reservation.listingOwner,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      // Ensure dates are converted to ISO strings
      createdAt: reservation.createdAt ? reservation.createdAt.toISOString() : new Date().toISOString(), 
      startDate: reservation.startDate ? reservation.startDate.toISOString() : new Date().toISOString(),
      endDate: reservation.endDate ? reservation.endDate.toISOString() : new Date().toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt ? reservation.listing.createdAt.toISOString() : new Date().toISOString(),
      },
      users: reservation.user
        ? [{
            ...reservation.user,
            createdAt: reservation.user.createdAt ? reservation.user.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: reservation.user.updatedAt ? reservation.user.updatedAt.toISOString() : new Date().toISOString(),
            emailVerified: reservation.user.emailVerified ? reservation.user.emailVerified.toISOString() : null, // Convert to string or null
            favoriteIds: reservation.user.favoriteIds || [],
          }]
        : [], // In case user is null, provide an empty array
    }));
    

    return safeReservations;
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    throw new Error(error.message || "Error occurred while fetching reservations");
  }
}
