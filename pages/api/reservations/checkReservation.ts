import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";

const handleInquire = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("API route hit"); // Ensure this is printing

  const { userId, listingId } = req.body;
  console.log("Received userId:", userId);
  console.log("Received listingId:", listingId);

  if (!userId || !listingId) {
    return res
      .status(400)
      .json({ message: "User ID or Listing ID is missing." });
  }

  try {
    // Check if there's a pending or confirmed reservation for the user and listing
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId,
        listingId,
        status: {
          in: ["pending", "confirmed"], // Check for both "pending" and "confirmed" statuses
        },
      },
    });

    // Log the result of the reservation check
    console.log("Existing reservation:", existingReservation);

    if (existingReservation) {
      return res.status(200).json({
        message:
          "You already have a reservation (pending or confirmed) for this property.",
      });
    }

    return res.status(200).json({
      message:
        "No pending or confirmed reservations found. You can proceed with a new reservation.",
    });
  } catch (error) {
    console.error("Error checking for existing reservations:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export default handleInquire;
