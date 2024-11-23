// app/api/carousel/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb'; // Adjust the path based on your project structure

export async function GET() {
  try {
    const carouselItems = await prisma.carouselItem.findMany(); // Fetch data from the MongoDB database
    return NextResponse.json(carouselItems); // Respond with JSON data
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    return NextResponse.json({ error: "Failed to fetch carousel items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, image } = await req.json(); // Parse the incoming JSON data

    // Create a new carousel item in the database
    const newCarouselItem = await prisma.carouselItem.create({
      data: {
        title,
        description,
        image,
      },
    });

    return NextResponse.json(newCarouselItem, { status: 201 }); // Respond with the created item and a success status
  } catch (error) {
    console.error("Error creating carousel item:", error);
    return NextResponse.json({ error: "Failed to create carousel item" }, { status: 500 });
  }
}

