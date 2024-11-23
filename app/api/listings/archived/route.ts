import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  // Fetch archived listings for the current user
  const archivedListings = await prisma.listing.findMany({
    where: {
      userId: currentUser.id,
      is_archived: true,  // Only get listings that are archived
    },
  });

  return NextResponse.json(archivedListings);
}
