import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import prisma from '@/app/libs/prismadb';
import { addHours } from 'date-fns';

export async function POST(req: NextRequest) {
  const { email, id } = await req.json();
  
  // Fetch user from the database
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Generate a random token
  const token = randomBytes(32).toString('hex');
  
  // Set expiration (for example, 2 hours)
  const expires = addHours(new Date(), 2);
  
  // Save token in the database
  await prisma.verificationToken.create({
    data: {
      token,
      userId: id,
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
    to: email,
    subject: 'Email Verification Request',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="text-align: center; color: #4CAF50;">Verify Your Email Address</h2>
            <p style="font-size: 16px;">Dear <strong>${user.name || 'User'}</strong>,</p>
            <p style="font-size: 16px;">
              Thank you for registering with CaviteNest. Please verify your email address to complete your registration process.
            </p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">Verify Email Address</a>
            </p>
            <p style="font-size: 16px;">
              If you did not create an account with us, please ignore this email. Your email address will not be used for any further communication.
            </p>
            <p style="font-size: 14px; color: #777;">This verification link will expire in 2 hours.</p>
            <p style="font-size: 14px;">If you have any questions or need assistance, please feel free to contact us at <a href="mailto:cavitenest.platform2024@gmail.com" style="color: #4CAF50;">cavitenest.platform2024@gmail.com</a>.</p>
            <p style="font-size: 14px; color: #777;">Best regards,<br/>The CaviteNest Team</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Verification email sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}
