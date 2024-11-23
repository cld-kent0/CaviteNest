// app/api/carousel/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, description, image } = await req.json();

  try {
    const updatedItem = await prisma.carouselItem.update({
      where: { id },
      data: { title, description, image },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating carousel item:", error);
    return NextResponse.json({ error: "Failed to update carousel item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Attempt to delete the carousel item by ID
    const deletedItem = await prisma.carouselItem.delete({
      where: { id },
    });

    // Return the deleted item as a response
    return NextResponse.json(deletedItem, { status: 200 });
  } catch (error) {
    console.error("Error deleting carousel item:", error);
    return NextResponse.json({ error: "Failed to delete carousel item" }, { status: 500 });
  }
}