import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { reservationId, status } = req.body;

    if (!reservationId || status !== "confirmed") {
      return res
        .status(400)
        .json({ error: "Invalid status or missing reservationId" });
    }

    try {
      // Fetch the reservation details to get the user email, listing details, etc.
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { listing: true, user: true }, // Include the related listing and user
      });

      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      // Log the listing ID before making any changes
      console.log(`Reservation found. Listing ID: ${reservation.listing.id}`);

      // Update the reservation status to 'confirmed'
      const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: { status },
      });

      // Check if the end date is 1/1/1970 and archive the listing if necessary
      const unixEpoch = new Date("1970-01-01").getTime();
      if (
        reservation.endDate &&
        new Date(reservation.endDate).getTime() === unixEpoch &&
        reservation.listing
      ) {
        // Archive the associated listing
        await prisma.listing.update({
          where: { id: reservation.listing.id },
          data: { is_archived: true }, // Assuming 'is_archived' is a boolean field in the Listing model
        });
      }

      // Step 1: Set up the email transporter using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use any email service provider here
        auth: {
          user: process.env.GMAIL_USER, // Your Gmail address
          pass: process.env.GMAIL_PASS, // Use environment variables for better security
        },
      });

      // Step 2: Define the email content with HTML for better formatting
      if (reservation.user.email) {  // Ensure that the email exists
        const mailOptions = {
          from: process.env.GMAIL_USER, // Your email address
          to: reservation.user.email,   // User's email, only if it is not null
          subject: 'Reservation Confirmed',
          html: `
            <h2>Reservation Confirmation</h2>
            <p><strong>Thank you for inquiring with us!</strong></p>
            <p>Your reservation for the listing titled <strong>"${reservation.listing.title}"</strong> has been confirmed.</p>
            <table style="width: 100%; border: 1px solid #ddd; border-collapse: collapse;">
              <tr>
                <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Reservation ID</th>
                <td style="padding: 8px;">${reservationId}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Listing Title</th>
                <td style="padding: 8px;">${reservation.listing.title}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Start Date</th>
                <td style="padding: 8px;">${reservation.startDate ? new Date(reservation.startDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">End Date</th>
                <td style="padding: 8px;">${reservation.endDate ? new Date(reservation.endDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Total Price</th>
                <td style="padding: 8px;">$${reservation.totalPrice || 'N/A'}</td>
              </tr>
            </table>
            <p>If you have any questions, feel free to reach out.</p>
            <p>Best regards, <br> CaviteNest</p>
          `,
        };

        // Step 3: Send the email
        await transporter.sendMail(mailOptions);
      } else {
        console.error('User email not found, cannot send email notification.');
      }

      // Return the updated reservation
      return res.status(200).json(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
