import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser"; // Function to get the current logged-in user
import prisma from "@/app/libs/prismadb"; // Prisma instance for database interaction

// Handle POST request for creating a reservation
export async function POST(request: Request) {
  // Get the current user (i.e., the one making the request)
  const currentUser = await getCurrentUser();

  // If no user is found, return an error response
  if (!currentUser) {
    console.error("User not found");
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 } // Unauthorized
    );
  }

  // Parse the request body
  const body = await request.json();
  console.log("Request body:", body); // Log incoming body

  const { listingId, startDate, endDate, totalPrice, status, rentalType, selectedUserId } = body;

  // Check for missing required fields
  if (!listingId || !startDate || !totalPrice || !rentalType || !selectedUserId) {
    console.error("Missing fields:", { listingId, startDate, totalPrice, rentalType, selectedUserId });
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 } // Bad request
    );
  }

  try {
    // Begin a Prisma transaction to create the reservation and conditionally archive the listing for rent
    const listingAndReservation = await prisma.$transaction(async (prisma) => {
      // Create the reservation and associate it with the selected user
      const reservation = await prisma.listing.update({
        where: {
          id: listingId,
        },
        data: {
          reservations: {
            create: {
              userId: selectedUserId, // Use the selected user's ID, not the currentUser's ID
              startDate: new Date(startDate),
              endDate: endDate ? new Date(endDate) : null, // Ensure endDate is null if not provided
              totalPrice,
              status: status || "pending",
              listingOwner: currentUser.id
            },
          },
          // Conditionally archive the listing only if rentalType is "rent"
          is_archived: rentalType === "rent" ? true : undefined,
        },
        include: {
          reservations: {
            include: {
              user: true, // Include the user data in the reservation response
            },
          },
        },
      });

      return reservation;
    });

    // Return the listing and reservation data
    return NextResponse.json(listingAndReservation);
  } catch (error) {
    // Handle the error correctly by checking its type
    if (error instanceof Error) {
      console.error("Error creating reservation:", error.message);
      return NextResponse.json(
        { message: error.message || "Error creating reservation" },
        { status: 500 } // Internal server error
      );
    } else {
      // Handle the case where the error is not of type Error
      console.error("Unknown error:", error);
      return NextResponse.json(
        { message: "An unknown error occurred" },
        { status: 500 } // Internal server error
      );
    }
  }
}

// Handle GET request for fetching reservations for a specific user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "Missing userId" },
      { status: 400 }
    );
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        userId,
      },
      include: {
        listing: true, // Include listing data
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching reservations" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// import getCurrentUser from "@/app/actions/getCurrentUser";
// import prisma from "@/app/libs/prismadb";

// export async function POST(request: Request) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) {
//     return NextResponse.error();
//   }

//   const body = await request.json();

//   const { listingId, startDate, endDate, totalPrice, status } = body;

//   if (!listingId || !startDate || !endDate || !totalPrice) {
//     return NextResponse.error();
//   }

//   const listingAndReservation = await prisma.listing.update({
//     where: {
//       id: listingId,
//     },
//     data: {
//       reservations: {
//         create: {
//           userId: currentUser.id,
//           startDate,
//           endDate,
//           totalPrice,
//           status: "pending"
//         },
//       },
//     },
//   });

//   return NextResponse.json(listingAndReservation);
// }
