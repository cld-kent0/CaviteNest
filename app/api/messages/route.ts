import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import nodemailer from "nodemailer";

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

      // Send email notification to the user (if the message is not from them)
      if (user.email && user.id !== currentUser.id) {
        sendEmailNotification(user.email, newMessage);
      }
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

async function sendEmailNotification(recipientEmail: string, message: any) {
  // Set up the email transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can change this to your email provider
    auth: {
      user: "cavitenest.platform2024@gmail.com", // Your email
      pass: "rlkd bbzm ozoa zonv", // Your email password (use OAuth2 or app password for security)
    },
  });

  // Fetch sender's name (assuming sender data is included in the message object)
  const senderName = message.sender ? message.sender.name : "Cavitenest User"; // Fallback to a default name if not available

  // Assuming you have a way to get the recipient's name (from database or message object)
  const recipientName = "User"; // Replace this with actual recipient name

  // Set up email data
  const mailOptions = {
    from: "cavitenest.platform2024@gmail.com",
    to: recipientEmail,
    subject: "New Message Notification on Cavitenest Platform",
    text: `
    Dear ${recipientName},

    You have received a new message from ${senderName} in one of your conversations on the Cavitenest platform.

    Message Details:
    "${message.body}"

    Please log in to your account to view the full message and respond by clicking the link below:
    https://cavite-nest.vercel.app/conversations

    If you need any assistance, feel free to contact us.

    Best regards,
    Cavitenest Support Team
    `,
    html: `
    <p>Dear <strong>${recipientName}</strong>,</p>

    <p>You have received a new message from <strong>${senderName}</strong> in one of your conversations on the <strong>Cavitenest platform</strong>.</p>

    <p><strong>Message Details:</strong><br>
    "${message.body}"
    </p>

    <p>Please log in to your account to view the full message and respond by clicking the link below:</p>
    <p><a href="https://cavite-nest.vercel.app/conversations" target="_blank">View Conversations</a></p>

    <p>If you need any assistance, feel free to contact us.</p>

    <p>Best regards,<br>
    <strong>Cavitenest Support Team</strong></p>
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to " + recipientEmail);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}
