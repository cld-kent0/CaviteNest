import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import prisma from '@/app/libs/prismadb';
import { addHours } from 'date-fns';

export async function sendVerificationEmail(user: { email: string, id: string }) {
  // Generate a random token
  const token = randomBytes(32).toString('hex');

  // Set expiration (for example, 2 hours)
  const expires = addHours(new Date(), 2);

  // Save token in the database
  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
      expires,
    },
  });

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password
    },
  });

  // Send email with verification link
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your email',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}