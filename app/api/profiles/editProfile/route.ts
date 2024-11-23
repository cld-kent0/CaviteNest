import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Assuming you have Prisma set up
import getCurrentUser from "@/app/actions/getCurrentUser"; // Assuming you have a method to get the current user

export async function PUT(request: Request) {
  // Get the current authenticated user
  const currentUser = await getCurrentUser();

  // If no current user is found, respond with an error
  if (!currentUser) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // Parse the incoming request body (profile data)
  const body = await request.json();
  console.log("Received interests in backend:", body.interest);
  const { contactNo, interest, location, imageSrc, description, userId } = body;


  // Ensure the `userId` matches the current user's ID
  if (userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized to edit this profile" }, { status: 403 });
  }

  try {
    // Find the profile that needs to be updated
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: currentUser.id },
    });

    // If the profile doesn't exist, return an error
    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};

    // Compare contact number
    if (existingProfile.contactNo !== contactNo) {
      dataToUpdate.contactNo = contactNo || null;
    }

    // Compare location
    if (JSON.stringify(existingProfile.location) !== JSON.stringify(location)) {
      dataToUpdate.location = location?.value || null;
    }

    // Compare description
    if (existingProfile.description !== description) {
      dataToUpdate.description = description || null;
    }

    // Check for changes in interests
    const currentInterests = existingProfile?.interest || [];
    const interestsAreDifferent =
      JSON.stringify(currentInterests.sort()) !== JSON.stringify((interest || []).sort());

    if (interestsAreDifferent) {
      dataToUpdate.interest = { set: interest || [] };
    }

    // If no fields are updated, return a message without updating
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: "No changes detected" });
    }
    // Update the profile with the new data
    const updatedProfile = await prisma.profile.update({
      where: { userId: currentUser.id },
      data: dataToUpdate, }); 
      return NextResponse.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Something went wrong while updating the profile." },
        { status: 500 }
      );
    }
}
