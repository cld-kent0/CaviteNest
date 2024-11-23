// pages/api/reset-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/app/libs/prismadb"; // Adjust this path according to your project structure
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log(req.body); // Log the request body for debugging

    const { token, password } = req.body;

    // Validate token and password
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: hashedPassword, // Ensure this field matches your schema
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: 'Password reset successful' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
