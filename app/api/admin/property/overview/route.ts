import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch property counts grouped by category, excluding archived properties
    const propertyCountByCategory = await prisma.listing.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      where: {
        is_archived: false, // Exclude archived properties
      },
    });

    // Format the result into a suitable object for the frontend
    const formattedData: { [key: string]: number } = propertyCountByCategory.reduce((acc, { category, _count }) => {
      acc[category] = _count.id; // Use category as key and count as value
      return acc;
    }, {} as { [key: string]: number }); // Initialize as an empty object

    return NextResponse.json({ propertyCountByCategory: formattedData });
  } catch (error) {
    console.error("Error fetching property overview data:", error);
    return NextResponse.error();
  } finally {
    await prisma.$disconnect();
  }
}
