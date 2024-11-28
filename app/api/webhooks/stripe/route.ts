import prisma from "@/app/libs/prismadb";
import { stripe } from "@/app/libs/stripe";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          {
            expand: ["line_items"],
          }
        );
        const customerId = session.customer as string;
        const customerDetails = session.customer_details;

        if (customerDetails?.email) {
          const user = await prisma.user.findUnique({
            where: { email: customerDetails.email },
          });
          if (!user) throw new Error("User not found");

          if (!user.customerId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { customerId },
            });
          }

          const lineItems = session.line_items?.data || [];

          for (const item of lineItems) {
            const priceId = item.price?.id;
            const isSubscription = item.price?.type === "recurring";
            let endDate = new Date();
            let plan: "free" | "premium" | "business" = "free";
            let period: "none" | "annually" | "quarterly" = "none";

            if (isSubscription) {
              // Determine plan and period based on price ID
              if (priceId === process.env.STRIPE_YEARLY_PREMIUM_PRICE_ID) {
                endDate.setFullYear(endDate.getFullYear() + 1);
                plan = "premium";
                period = "annually";
              } else if (
                priceId === process.env.STRIPE_QUARTERLY_PREMIUM_PRICE_ID
              ) {
                endDate.setMonth(endDate.getMonth() + 3);
                plan = "premium";
                period = "quarterly";
              } else if (
                priceId === process.env.STRIPE_YEARLY_BUSINESS_PRICE_ID
              ) {
                endDate.setFullYear(endDate.getFullYear() + 1);
                plan = "business";
                period = "annually";
              } else if (
                priceId === process.env.STRIPE_QUARTERLY_BUSINESS_PRICE_ID
              ) {
                endDate.setMonth(endDate.getMonth() + 3);
                plan = "business";
                period = "quarterly";
              } else {
                throw new Error("Invalid priceId");
              }

              await prisma.subscription.upsert({
                where: { userId: user.id },
                create: {
                  userId: user.id,
                  startDate: new Date(),
                  endDate,
                  plan,
                  period,
                  priceId: priceId || "", // Include Stripe priceId for reference
                  subscriptionStatus: "ACTIVE",
                },
                update: {
                  plan,
                  period,
                  startDate: new Date(),
                  endDate,
                },
              });

              await prisma.user.update({
                where: { id: user.id },
                data: {
                  plan,
                  //subscriptionStatus: "ACTIVE", // Update to ACTIVE
                },
              });
            } else {
              // Handle one-time purchase or other cases if needed
            }
          }
        }
        break;

      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(
          (event.data.object as Stripe.Subscription).id
        );
        const user = await prisma.user.findFirst({
          //dapat findUnique to but dahil sa error gawin ko muna temporary na hindi - dars
          where: { customerId: subscription.customer as string },
        });
        if (user) {
          // Update the subscription record to EXPIRED
          await prisma.subscription.updateMany({
            where: { userId: user.id },
            data: {
              subscriptionStatus: "EXPIRED",
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "free",
              //subscriptionStatus: "EXPIRED", // Update to EXPIRED
            },
          });
        } else {
          console.error("User not found for the subscription deleted event.");
          throw new Error("User not found for the subscription deleted event.");
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling event", error);
    return new Response("Webhook Error", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}
