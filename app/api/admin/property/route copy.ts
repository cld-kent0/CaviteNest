



//ito yung una kong ginawa para makuha yung mga listing pero ang ginawa ko ay ginamit ko yung get listing papunta sa route ng API sa property

import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

// GET /api/admin/property
export async function GET() {
  try {
    const properties = await prisma.listing.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        locationValue: true,
        is_archived: true,
      },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST /api/admin/property
export async function POST(request: Request) {
    const body = await request.json();
    
    // Destructure the incoming data
    const { 
      title, 
      description, 
      imageSrc, 
      category,
      roomCount, 
      bathroomCount, 
      guestCount, 
      locationValue,
      userId,
      price
    } = body;
  
    try {
      const newProperty = await prisma.listing.create({
        data: {
          title,
          description,
          imageSrc,
          category, // Assuming you want to use the category field
          roomCount,
          bathroomCount,
          guestCount,
          locationValue,
          userId, // This should be passed from the frontend
          price,
          is_archived: false, // Default value can be set here
        },
      });
      return NextResponse.json(newProperty, { status: 201 });
    } catch (error) {
      console.error('Error creating property:', error);
      return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
  }
  