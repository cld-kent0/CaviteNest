import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from "next/server";

// Define the condition types for users and listings
type UserSearchCondition = {
    name?: { contains: string; mode: "insensitive" };
    email?: { contains: string; mode: "insensitive" };
    id?: string; // Add id property
};

type ListingSearchCondition = {
    title?: { contains: string; mode: "insensitive" };
    category?: { contains: string; mode: "insensitive" };
    id?: string; // Add id property
};

export async function GET(req: Request) {
    const url = new URL(req.url);
    const keyword = url.searchParams.get("keyword") || "";

    // Create an array for user search conditions
    const userConditions: UserSearchCondition[] = [
        { name: { contains: keyword, mode: "insensitive" } },
        { email: { contains: keyword, mode: "insensitive" } },
    ];

    // Check if the keyword is a valid ObjectID
    if (keyword.length === 24) {
        userConditions.push({ id: keyword }); // Add ID condition if valid
    }

    const users = await prisma.user.findMany({
        where: { OR: userConditions },
    });

    // Create an array for listing search conditions
    const listingConditions: ListingSearchCondition[] = [
        { title: { contains: keyword, mode: "insensitive" } },
        { category: { contains: keyword, mode: "insensitive" } },
    ];

    // Check if the keyword is a valid ObjectID
    if (keyword.length === 24) {
        listingConditions.push({ id: keyword }); // Add ID condition if valid
    }

    const listings = await prisma.listing.findMany({
        where: { OR: listingConditions },
    });

    return NextResponse.json({ users, listings });
}
