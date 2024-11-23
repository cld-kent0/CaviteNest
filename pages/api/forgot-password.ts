// pages/api/forgot-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import prisma from "@/app/libs/prismadb"; // Adjust this path according to your project structure
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token and expiration time
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update the user with the reset token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail password or app password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="text-align: center; color: #4CAF50;">Password Reset Request</h2>
              <p style="font-size: 16px;">Dear <strong>${user.name || 'User'}</strong>,</p>
              <p style="font-size: 16px;">
                We received a request to reset the password for your account. If you made this request, please click the button below to reset your password:
              </p>
              <p style="text-align: center;">
                <a href="http://localhost:3000/reset-password?token=${resetToken}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">Reset Password</a>
              </p>
              <p style="font-size: 16px;">
                If you did not request a password reset, please ignore this email. Your account will remain secure.
              </p>
              <p style="font-size: 14px; color: #777;">This link will expire in 1 hour.</p>
              <p style="font-size: 14px;">If you have any issues or questions, feel free to contact us at <a href="mailto:support@example.com" style="color: #4CAF50;">support@example.com</a>.</p>
              <p style="font-size: 14px; color: #777;">Best regards,<br/>The CaviteNest Team</p>
            </div>
          </body>
        </html>
      `,
    };
    
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Reset email sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
