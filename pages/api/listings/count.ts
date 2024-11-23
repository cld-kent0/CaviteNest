import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb"; // Ensure this points to your Prisma instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Count the number of listings associated with the given userId
    const count = await prisma.listing.count({
      where: {
        userId: userId as string, // Prisma can handle ObjectId types automatically for MongoDB
      },
    });

    // Return the count of listings
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
