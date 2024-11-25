import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// Helper function to add a field to dataToUpdate if it has changed
function addIfChanged(
  existingValue: any,
  newValue: any,
  field: string,
  dataToUpdate: any
) {
  if (
    existingValue !== newValue &&
    newValue !== undefined &&
    newValue !== null
  ) {
    dataToUpdate[field] = newValue ?? null; // Null if the new value is undefined
  }
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  // Check if the user is authenticated
  if (!currentUser) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  // Parse the incoming request body
  const body = await request.json();
  const {
    listingId,
    rentalType,
    category,
    location,
    guestCount,
    roomCount,
    bathroomCount,
    imageSrc,
    title,
    description,
    amenities,
    rentalAddress,
    rentalAmount,
    rentalSecurityDeposit,
    utilitiesMaintenance,
    paymentMethod,
    bookingAddress,
    bookingFee,
    bookingSecurityDeposit,
    cancellationPolicy,
    rentalPrice,
    bookingPrice,
  } = body;

  // Ensure a listing ID is provided
  if (!listingId) {
    return NextResponse.json(
      { error: "Listing ID is required" },
      { status: 400 }
    );
  }

  try {
    // Find the existing listing in the database
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    // Handle case where listing is not found
    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if the current user owns the listing
    if (existingListing.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this listing" },
        { status: 403 }
      );
    }

    // Prepare the fields to update
    const dataToUpdate: any = {};

    // Convert values to integers if applicable and add to dataToUpdate if changed
    addIfChanged(
      existingListing.rentalType,
      rentalType,
      "rentalType",
      dataToUpdate
    );
    addIfChanged(existingListing.category, category, "category", dataToUpdate);
    addIfChanged(
      existingListing.locationValue,
      location?.value,
      "locationValue",
      dataToUpdate
    );
    addIfChanged(
      existingListing.guestCount,
      guestCount,
      "guestCount",
      dataToUpdate
    );
    addIfChanged(
      existingListing.roomCount,
      roomCount,
      "roomCount",
      dataToUpdate
    );
    addIfChanged(
      existingListing.bathroomCount,
      bathroomCount,
      "bathroomCount",
      dataToUpdate
    );
    addIfChanged(existingListing.imageSrc, imageSrc, "imageSrc", dataToUpdate);
    addIfChanged(existingListing.title, title, "title", dataToUpdate);
    addIfChanged(
      existingListing.description,
      description,
      "description",
      dataToUpdate
    );

    // Handle amenities change (sort and compare)
    const currentAmenities = existingListing.amenities || [];
    const amenitiesAreDifferent =
      JSON.stringify(currentAmenities.sort()) !==
      JSON.stringify((amenities || []).sort());
    if (amenitiesAreDifferent) {
      dataToUpdate.amenities = { set: amenities || [] };
    }

    // Handle other fields like price and booking details
    addIfChanged(
      existingListing.rentalAddress,
      rentalAddress,
      "rentalAddress",
      dataToUpdate
    );
    addIfChanged(
      existingListing.rentalAmount,
      rentalAmount ? parseInt(rentalAmount, 10) : undefined,
      "rentalAmount",
      dataToUpdate
    );
    addIfChanged(
      existingListing.rentalSecurityDeposit,
      rentalSecurityDeposit
        ? rentalSecurityDeposit === ""
          ? null
          : parseInt(rentalSecurityDeposit, 10)
        : undefined,
      "rentalSecurityDeposit",
      dataToUpdate
    );
    addIfChanged(
      existingListing.utilitiesMaintenance,
      utilitiesMaintenance,
      "utilitiesMaintenance",
      dataToUpdate
    );
    addIfChanged(
      existingListing.paymentMethod,
      paymentMethod,
      "paymentMethod",
      dataToUpdate
    );
    addIfChanged(
      existingListing.bookingAddress,
      bookingAddress,
      "bookingAddress",
      dataToUpdate
    );
    addIfChanged(
      existingListing.bookingFee,
      bookingFee
        ? bookingFee === ""
          ? null
          : parseInt(bookingFee, 10)
        : undefined,
      "bookingFee",
      dataToUpdate
    );
    addIfChanged(
      existingListing.bookingSecurityDeposit,
      bookingSecurityDeposit
        ? bookingSecurityDeposit === ""
          ? null
          : parseInt(bookingSecurityDeposit, 10)
        : undefined,
      "bookingSecurityDeposit",
      dataToUpdate
    );
    addIfChanged(
      existingListing.cancellationPolicy,
      cancellationPolicy,
      "cancellationPolicy",
      dataToUpdate
    );
    addIfChanged(
      existingListing.price,
      rentalPrice ? parseInt(rentalPrice, 10) : existingListing.price,
      "price",
      dataToUpdate
    );
    addIfChanged(
      existingListing.price,
      bookingPrice ? parseInt(bookingPrice, 10) : existingListing.price,
      "price",
      dataToUpdate
    );

    // Return early if no changes are detected
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: "No changes detected" });
    }

    // Update the listing in the database
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: dataToUpdate,
    });

    // Return the updated listing
    return NextResponse.json(updatedListing);
  } catch (error) {
    // Log the error and return a generic error message
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the listing." },
      { status: 500 }
    );
  }
}
