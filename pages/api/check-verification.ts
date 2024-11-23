// /pages/api/check-verification.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb"; // Your Prisma instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  try {
    // Fetch the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { idStatus: true }, // Only fetch idStatus for this user
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the idStatus
    res.status(200).json({ idStatus: user.idStatus });
  } catch (error) {
    console.error("Error fetching user verification status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
