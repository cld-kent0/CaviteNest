import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  rentalType?: "rent" | "booking" | "both" | null; // Make rentalType optional and nullable
  rentalAddress?: string;
  rentalAmount?: number;
  rentalSecurityDeposit?: number;
  utilitiesMaintenance?: string;
  paymentMethod?: string;
  bookingAddress?: string;
  bookingFee?: number;
  bookingSecurityDeposit?: number;
  cancellationPolicy?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
      rentalType,
      rentalAddress,
      rentalAmount,
      rentalSecurityDeposit,
      utilitiesMaintenance,
      paymentMethod,
      bookingAddress,
      bookingFee,
      bookingSecurityDeposit,
      cancellationPolicy,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }
    if (category) {
      query.category = category;
    }
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }
    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }
    if (locationValue) {
      query.locationValue = locationValue;
    }

    // Handle rentalType filter, considering null values
    if (rentalType !== null) {
      query.rentalType = rentalType;
    }

    // Only add rentalAddress to query if it's not null or undefined
    if (rentalAddress !== null) {
      query.rentalAddress = rentalAddress;
    }

    if (rentalAmount !== undefined) {
      query.rentalAmount = rentalAmount;
    }

    if (rentalSecurityDeposit !== undefined) {
      query.rentalSecurityDeposit = rentalSecurityDeposit;
    }

    if (bookingSecurityDeposit !== undefined) {
      query.bookingSecurityDeposit = bookingSecurityDeposit;
    }

    if (utilitiesMaintenance) {
      query.utilitiesMaintenance = utilitiesMaintenance;
    }

    if (paymentMethod !== undefined) {
      query.paymentMethod = paymentMethod;
    }

    if (bookingAddress) {
      query.bookingAddress = bookingAddress;
    }

    if (bookingFee !== undefined) {
      query.bookingFee = bookingFee;
    }

    if (bookingSecurityDeposit !== undefined) {
      query.bookingSecurityDeposit = bookingSecurityDeposit;
    }

    if (cancellationPolicy) {
      query.cancellationPolicy = cancellationPolicy;
    }

    // Handle date range filtering (startDate and endDate) for availability
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    // Query listings from the database
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format and return the listings
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    throw new Error("Error fetching listings");
  }
}
