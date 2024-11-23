import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb"; // Adjust the path if necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { listingId } = req.query;

    // Validate if listingId is present and is a string
    if (!listingId || typeof listingId !== "string") {
      return res.status(400).json({ error: "listingId is required and must be a string" });
    }

    try {
      // Fetch the latest reservation details for the provided listingId
      const latestReservation = await prisma.reservation.findFirst({
        where: {
          listingId: listingId, // Match reservations for this listingId
        },
        orderBy: {
          createdAt: "desc", // Order by createdAt in descending order to get the latest reservation
        },
        include: {
          listing: true, // Optionally include related Listing details
          user: true, // Optionally include related User details
        },
      });

      // If no reservation found, return an empty object instead of an empty array
      if (!latestReservation) {
        return res.status(200).json({ message: "No reservations found for this listing." });
      }

      // Return the latest reservation data
      return res.status(200).json(latestReservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Only allow GET method
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
