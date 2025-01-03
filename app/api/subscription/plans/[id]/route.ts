import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { name, description, price, annualPrice, features } = await req.json();

        if (!params.id) {
            return NextResponse.json(
                { error: "Subscription plan ID is required" },
                { status: 400 }
            );
        }

        const updatedPlan = await prisma.subscriptionPlan.update({
            where: { id: params.id },
            data: { name, description, price, annualPrice, features },
        });

        return NextResponse.json(updatedPlan);
    } catch (error) {
        console.error("Error updating subscription plan:", error);
        return NextResponse.json(
            { error: "Failed to update subscription plan" },
            { status: 500 }
        );
    }
}
