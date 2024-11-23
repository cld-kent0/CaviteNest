import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        console.log(currentUser, 'CURRENT_USER');

        const body = await request.json();
        console.log(body, 'REQUEST_BODY');

        const { name, image } = body;

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                image: image,
                name: name
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error: any) {
        console.error(error.stack, 'ERROR_SETTINGS');
        return new NextResponse('Internal Error', { status: 500 });
    }
}
