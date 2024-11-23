import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb'; // Assuming you're using Prisma for database access

// PUT method handler
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // Parse the incoming request body
  const { imageSrc }: { imageSrc: string } = await request.json();

  if (!imageSrc) {
    return NextResponse.json({ message: "No image URL provided" }, { status: 400 });
  }

  try {
    // Update the profile image URL in the database
    const updatedProfile = await prisma.profile.update({
      where: { id }, // Match the profile by ID
      data: { imageSrc }, // Update the imageSrc field
    });

    // Return a success response with the updated profile
    return NextResponse.json({
      message: "Profile image updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
  }
}
