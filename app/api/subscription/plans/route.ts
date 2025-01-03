// app/api/subscription/plans/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET() {
    try {
        const plans = await prisma.subscriptionPlan.findMany();
        return NextResponse.json(plans);
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        return NextResponse.json(
            { error: "Failed to fetch subscription plans" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { name, description, price, annualPrice, features } = await req.json();

        if (!name || !description || price == null || !features) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const newPlan = await prisma.subscriptionPlan.create({
            data: { name, description, price, annualPrice, features },
        });

        return NextResponse.json(newPlan);
    } catch (error) {
        console.error("Error creating subscription plan:", error);
        return NextResponse.json(
            { error: "Failed to create subscription plan" },
            { status: 500 }
        );
    }
}
