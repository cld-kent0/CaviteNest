import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { stripe } from '@/app/libs/stripe'; // Import stripe library
import Stripe from 'stripe';

// Fetch all subscriptions for admin
export async function GET() {
    try {
      const subscriptions = await prisma.subscription.findMany({
  include: {
    user: true, // Include user details
  },
});



return NextResponse.json(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ message: 'Failed to fetch subscriptions' }, { status: 500 });
    }
  }

// // Unsubscribe endpoint (cancels the subscription in Stripe and database)
// export async function unsubscribe(req: Request, { params }: { params: { subscriptionId: string } }) {
//     const { subscriptionId } = params;
  
//     try {
//       const subscription = await prisma.subscription.findUnique({
//         where: { id: subscriptionId },
//         include: {
//           user: true, // Make sure to include user details
//         },
//       });
  
//       if (!subscription || !subscription.user?.customerId) {
//         return NextResponse.json({ message: 'Subscription or customer not found' }, { status: 404 });
//       }
  
//       await stripe.subscriptions.update(subscription.user.customerId, {
//         cancel_at_period_end: true,
//       });
  
//       // Optionally, update the database or set subscription status as 'canceled'
//       await prisma.subscription.update({
//         where: { id: subscriptionId },
//         data: { status: 'canceled' },
//       });
  
//       return NextResponse.json({ message: 'Unsubscribed successfully' });
//     } catch (error) {
//       console.error('Error unsubscribing:', error);
//       return NextResponse.json({ message: 'Error unsubscribing' }, { status: 500 });
//     }
//   }
  
// // Delete subscription (permanently remove from database)
// export async function DELETE(req: Request, { params }: { params: { subscriptionId: string } }) {
//   const { subscriptionId } = params;

//   try {
//     // Delete subscription in the database
//     await prisma.subscription.delete({
//       where: { id: subscriptionId },
//     });

//     return NextResponse.json({ message: 'Subscription deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting subscription:', error);
//     return NextResponse.json({ message: 'Error deleting subscription' }, { status: 500 });
//   }
// }

// // Cancel subscription (Cancel immediately in Stripe and database)
// export async function cancelSubscription(req: Request, { params }: { params: { subscriptionId: string } }) {
//     const { subscriptionId } = params;
  
//     try {
//       const subscription = await prisma.subscription.findUnique({
//         where: { id: subscriptionId },
//       });
  
//       if (!subscription) {
//         return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
//       }
  
//       // Cancel the subscription immediately on Stripe
//       await stripe.subscriptions.cancel(subscriptionId);
  
//       // Optionally, remove the subscription from the database
//       await prisma.subscription.delete({
//         where: { id: subscriptionId },
//       });
  
//       return NextResponse.json({ message: 'Subscription canceled successfully' });
//     } catch (error) {
//       console.error('Error canceling subscription:', error);
//       return NextResponse.json({ message: 'Error canceling subscription' }, { status: 500 });
//     }
//   }
  
