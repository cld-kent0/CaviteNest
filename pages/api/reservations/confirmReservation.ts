import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb"; // Adjust the path if necessary

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
      // Fetch the reservation details to get the end date and listing ID
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { listing: true }, // Include the related listing for the listingId
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
          data: { is_archived: true }, // Assuming 'archived' is a boolean field in the Listing model
        });
      }

      return res.status(200).json(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
