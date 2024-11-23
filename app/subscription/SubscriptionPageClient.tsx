'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Heading from './Heading';
import SubscriptionCard from './SubscriptionCard';
import Container from '../components/Container';

const SubscriptionPageClient = () => {
  const router = useRouter();
  const [userPlan, setUserPlan] = useState<string | null>(null);

  // Fetch user's subscription plan
  const getUserSubscription = async () => {
    try {
      const res = await fetch('/api/subscription'); // Call the API route
      const data = await res.json();
      if (res.ok) {
        setUserPlan(data.plan); // Set the user's subscription plan
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };

  useEffect(() => {
    getUserSubscription(); // Fetch user's plan on component mount
  }, []);

  const handleGoTo = (plan: { 
    title: string;
    description: string;
    price: string;
    features: string[];
    borderColor: string;
    lineColor: string;
    hoverColor: string;
    planType: string;
  }) => {
    const queryParams = new URLSearchParams({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      features: plan.features.join(','),
      borderColor: plan.borderColor,
      lineColor: plan.lineColor,
      hoverColor: plan.hoverColor,
      planType: plan.planType
    }).toString();
    router.push(`/subscription/subscriptionNext?${queryParams}`);
  };

  return (
    <div className="min-h-screen">
      <Container>
        <div className="text-center">
          <hr className="w-[100px] h-[8px] bg-yellow-500 rounded mx-auto mt-14" />
          <Heading
            title="Get Started with an Upgraded Account"
            subTitle="Choose your plan"
            center
          />
        </div>
        <div className="flex flex-wrap justify-center gap-7 mt-12">
          <SubscriptionCard
            title="Free Plan"
            description="Upload and Tell a story about your property."
            price="₱ 0.00"
            priceDesc="Pay nothing"
            border={true}
            borderColor="border-gray-600"
            lineColor="black"
            features={[
              "Upload a Property Listing",
              "Communicate with Clients using Messaging Module",
              "Check Availability of your properties real-time",
            ]}
            isSelected={userPlan === "free"}
            onSubscribe={() =>
              handleGoTo({
                title: "Free Plan",
                description: "Upload and Tell a story about your property.",
                price: "₱ 0.00",
                features: [
                  "Upload a Property Listing",
                  "Communicate with Clients using Messaging Module",
                  "Check Availability of your properties real-time",
                ],
                borderColor: "border-gray-600",
                lineColor: "black",
                hoverColor: "bg-gray-600",
                planType: "free",
              })
            }
          />
          <SubscriptionCard
            title="Premium Plan"
            description="Manage 3-5 properties with full access to all features."
            price="₱ 699.00"
            priceDesc={
              <>
                ₱ 1,249.00 when you&nbsp;
                <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
                  pay yearly
                </span>
              </>
            }
            border={true}
            borderColor="border-green-700"
            lineColor="green"
            hoverColor="bg-green-700"
            onSubscribe={() =>
              handleGoTo({
                title: "Premium Plan",
                description: "Manage 3-5 properties with full access to all features.",
                price: "₱ 699.00",
                features: [
                  "Upload 3-5 Property Listings",
                  "Communicate with Clients using Messaging Module",
                  "Check Availability of your properties real-time",
                  // "Display Reviews and Feedbacks",
                  "Verified Badge Included",
                ],
                borderColor: "border-green-700",
                lineColor: "green",
                hoverColor: "bg-green-700",
                planType: "premium",
              })
            }
            features={[
              "Upload 3-5 Property Listings",
              "Communicate with Clients using Messaging Module",
              "Check Availability of your properties real-time",
              // "Display Reviews and Feedbacks",
              "Verified Badge Included",
            ]}
            isSelected={userPlan === "premium"}
          />
          <SubscriptionCard
            title="Business Plan"
            description="Manage > 5 properties with full access to all features."
            price="₱ 999.00"
            priceDesc={
              <>
                ₱ 1,849.00 when you&nbsp;
                <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
                  pay yearly
                </span>
              </>
            }
            border={true}
            borderColor="border-blue-900"
            lineColor="blue"
            hoverColor="bg-blue-800"
            onSubscribe={() =>
              handleGoTo({
                title: "Business Plan",
                description: "Manage > 5 properties with full access to all features.",
                price: "₱ 999.00",
                features: [
                  "Upload 5 or more Property Listings",
                  "Communicate with Clients using Messaging Module",
                  "Check Availability of your properties real-time",
                  // "Display Reviews and Feedbacks",
                  "Verified Badge Included",
                  // "Feature Properties on Homepage",
                ],
                borderColor: "border-blue-900",
                lineColor: "blue",
                hoverColor: "bg-blue-800",
                planType: "business",
              })
            }
            features={[
              "Upload 5 or more Property Listings",
              "Communicate with Clients using Messaging Module",
              "Check Availability of your properties real-time",
              // "Display Reviews and Feedbacks",
              "Verified Badge Included",
              // "Feature Properties on Homepage",
            ]}
            isSelected={userPlan === "business"}
          />
        </div>
      </Container>
    </div>
  );
};

export default SubscriptionPageClient;
