import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received payload:', body); // Log the incoming data

    const {
        title,
        description,
        imageSrc,  // Expecting a string or an array of image URLs
        category,
        location,
        guestCount,
        roomCount,
        bathroomCount,
        rentalPrice,
        bookingPrice,
        amenities,
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
    } = body;

    // Ensure imageSrc is an array, even if it's a single string
    const images = Array.isArray(imageSrc) ? imageSrc : imageSrc ? [imageSrc] : [];

    // Validate only required fields (removed imageSrc from required fields)
    const requiredFields = {
        title,
        description,
        category,
        guestCount,
        roomCount,
        bathroomCount,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return NextResponse.json({ error: `${key} is required` }, { status: 400 });
        }
    }

    try {
        // Build the data object conditionally
        const data: any = {
            title,
            description,
            imageSrc: images,  // imageSrc is now guaranteed to be an array
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue: location?.value,
            userId: currentUser.id,
            amenities,
            rentalType,
            rentalAddress,
            utilitiesMaintenance,
            paymentMethod,
            bookingAddress,
            cancellationPolicy,
        };

        // Conditionally add optional fields as parsed integers if they exist
        if (rentalPrice) data.price = parseInt(rentalPrice, 10);
        if (bookingPrice) data.price = parseInt(bookingPrice, 10);
        if (rentalAmount) data.rentalAmount = parseInt(rentalAmount, 10);
        if (rentalSecurityDeposit) data.rentalSecurityDeposit = parseInt(rentalSecurityDeposit, 10);
        if (bookingFee) data.bookingFee = parseInt(bookingFee, 10);
        if (bookingSecurityDeposit) data.bookingSecurityDeposit = parseInt(bookingSecurityDeposit, 10);

        // Create listing with multiple images (imageSrc is now guaranteed to be an array)
        const listing = await prisma.listing.create({ data });

        return NextResponse.json(listing, { status: 201 });
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
    }
}