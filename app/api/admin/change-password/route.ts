import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Adjust the import path according to your structure
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next"; // Make sure this import is correct
import { authOptions } from "@/pages/api/auth/[...nextauth]";


export const POST = async (req: NextRequest) => {
  // Get the user session using the request
  const session = await getServerSession({ req, ...authOptions }); // Adjust this line
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  // Parse the request body
  const { oldPassword, newPassword } = await req.json();

  // Fetch the user's current password from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Check if user exists and has a hashed password
  if (!user || !user.hashedPassword) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  // Check if the old password is correct
  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.hashedPassword);
  if (!isOldPasswordValid) {
    return NextResponse.json({ message: "Old password is incorrect." }, { status: 401 });
  }

  // Hash the new password and update it in the database
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email: session.user.email },
    data: { hashedPassword: hashedNewPassword },
  });

  return NextResponse.json({ message: "Password changed successfully." }, { status: 200 });
};
