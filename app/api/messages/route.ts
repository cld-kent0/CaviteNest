import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId, handleAcceptAndInquire, reservationDetails } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let listingId = null; // Initialize listingId
    let listingOwner = null; // Initialize listingUserId

    // If reservation details exist, use the listingId
    if (handleAcceptAndInquire && reservationDetails) {
      const { startDate, endDate, totalPrice } = reservationDetails;
      listingId = reservationDetails.listingId;
      listingOwner = reservationDetails.listingOwner;

      // Check if there is already a reservation for the same listingId
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          listingId: reservationDetails.listingId,
          status: { not: "confirmed" }, // Avoid cancelled reservations
        },
      });

      if (existingReservation) {
        return new NextResponse(
          JSON.stringify({ error: "Reservation already exists for this listing." }),
          { status: 400 }
        );
      }

      // Create a new reservation if no reservation exists
      await prisma.reservation.create({
        data: {
          userId: currentUser.id,
          listingId: reservationDetails.listingId,
          listingOwner: reservationDetails.listingOwner,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          status: "pending", // Default status for new reservations
        },
      });
    }

    // Create a new message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
        seen: {
          connect: { id: currentUser.id },
        },
        listingId: listingId || null, // Attach the listingId to the message
        listingOwner: listingOwner || null, // Attach the listingUserId to the message
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    // Update the conversation with the latest message
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: { connect: { id: newMessage.id } },
      },
      include: {
        users: true,
        messages: { include: { seen: true } },
      },
    });

    // Trigger Pusher events for real-time updates
    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    // Return the new message, including listingId and listingOwner
    return NextResponse.json({
      ...newMessage,
      listingId,
      listingOwner,
    });
  } catch (error: any) {
    console.error(error, "ERROR_MESSAGES");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
