import bcrypt from "bcrypt"; // Fix typo here
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword: hashedPassword, // Ensure this matches your Prisma schema
        role: 'LESSEE',
        // role, inalis ko muna yung role upon registration kasi kailangan default as lessee and user sa pag reregister - dars
      },
    });

    // Return the created user (you may want to exclude the password in real-world apps)
    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
