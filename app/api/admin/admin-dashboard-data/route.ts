import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch total count of Lessors and Lessees excluding archived
    const totalLessors = await prisma.user.count({
      where: {
        role: 'LESSOR',
        is_archived: false, // Exclude archived lessors
      }
    });

    const totalLessees = await prisma.user.count({
      where: {
        role: 'LESSEE',
        is_archived: false, // Exclude archived lessees
      }
    });


    // Fetch total properties count excluding archived listings
    const totalProperties = await prisma.listing.count({
      where: {
        is_archived: false, // Exclude archived properties
      }
    });

    // Fetch count of active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        subscriptionStatus: 'ACTIVE', // Only count active subscriptions
      },
    });


    return NextResponse.json({
      totalLessors,
      totalLessees,
      activeSubscriptions,
      totalProperties,
      // subscribedUsers,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.error();
  } finally {
    await prisma.$disconnect();
  }
}
