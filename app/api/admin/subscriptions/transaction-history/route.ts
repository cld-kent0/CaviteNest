import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function GET() {
  try {
    const gcashPayments = await prisma.gcashPayment.findMany({
      include: {
        user: true,
        subscription: true,
      },
    });

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true,
      },
    });

    const transactions = [
      ...gcashPayments.map((payment) => ({
        id: payment.id,
        type: 'Gcash Payment',
        user: payment.user.name,
        plan: payment.plan,
        billingPeriod: payment.billingPeriod,
        price: payment.price,
        status: payment.status,
        createdAt: payment.createdAt,
      })),
      ...subscriptions.map((subscription) => ({
        id: subscription.id,
        type: 'Subscription',
        user: subscription.user.name,
        plan: subscription.plan,
        period: subscription.period,
        price: null, // No price for subscriptions in this schema
        status: subscription.subscriptionStatus,
        createdAt: subscription.createdAt,
      })),
    ];

     // Sort transactions by createdAt in descending order (most recent first)
     transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
