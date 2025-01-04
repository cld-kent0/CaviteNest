"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "./Heading";
import SubscriptionCard from "./SubscriptionCard";
import Container from "../components/Container";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  annualPrice: number; // Add this field
  features: string[];
};

type PaymentHistoryItem = {
  plan: string;
  amount: string | number;
  status: string;
  start: string;
  end: string;
};

const SubscriptionPageClient = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/subscription/plans");
      const data = await res.json();
      if (res.ok) {
        setPlans(data.map((plan: any) => ({
          ...plan,
          annualPrice: plan.annualPrice || 0, // Ensure annualPrice is included
        })));
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  // Fetch user's subscription plan
  const getUserSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      if (res.ok) {
        setUserPlan(data.plan);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user subscription:", error);
    }
  };

  // Fetch user's payment history
  const getPaymentHistory = async () => {
    try {
      const res = await fetch("/api/subscription/payment-history");
      const data = await res.json();
      if (res.ok && Array.isArray(data.history)) {
        setPaymentHistory(data.history);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchPlans(), getUserSubscription(), getPaymentHistory()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map plan names to 'free', 'premium', 'business'
  const mapPlanName = (planName: string) => {
    switch (planName) {
      case "Free Plan":
        return "free";
      case "Premium Plan":
        return "premium";
      case "Business Plan":
        return "business";
      default:
        return "";
    }
  };


  const getPlanColors = (planType: string) => {
    switch (planType) {
      case "free":
        return { lineColor: "black", borderColor: "border-black-600", hoverColor: "bg-gray-700" };
      case "premium":
        return { lineColor: "green", borderColor: "border-green-700", hoverColor: "bg-green-700" };
      case "business":
        return { lineColor: "blue", borderColor: "border-blue-900", hoverColor: "bg-blue-800" };
      default:
        return { lineColor: "black", borderColor: "border-black-600", hoverColor: "bg-gray-700" };
    }
  };

  const handleGoTo = (plan: SubscriptionPlan) => {

    const planType = mapPlanName(plan.name); // Map the plan to 'free', 'premium', or 'business'
    const colors = getPlanColors(planType); // Get the colors based on the plan type

    const queryParams = new URLSearchParams({
      title: plan.name,
      description: plan.description,
      price: `₱${plan.price.toFixed(2)}`,
      features: plan.features.join(","),
      planType: planType,
      // planType: plan.name.toLowerCase(),
      lineColor: colors.lineColor,
      borderColor: colors.borderColor,
      hoverColor: colors.hoverColor,
    }).toString();
    router.push(`/subscription/subscriptionNext?${queryParams}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const toSentenceCase = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();


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
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              title={plan.name}
              description={plan.description}
              price={`₱${plan.price.toFixed(2)}`}
              priceDesc={
                <>
                  ₱{plan.annualPrice.toFixed(2)} when you&nbsp;
                  <span
                    style={{
                      textDecoration: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    pay annually
                  </span>
                </>
              }
              features={plan.features}
              border={true}
              hoverColor={
                plan.name === "Free Plan"
                  ? "bg-gray-600"
                  : plan.name === "Premium Plan"
                    ? "bg-green-700"
                    : "bg-blue-800"
              }
              borderColor={
                plan.name === "Free Plan"
                  ? "border-gray-600"
                  : plan.name === "Premium Plan"
                    ? "border-green-700"
                    : "border-blue-900"
              }
              lineColor={
                plan.name === "Free Plan"
                  ? "black"
                  : plan.name === "Premium Plan"
                    ? "green"
                    : "blue"
              }
              isSelected={userPlan?.toLowerCase() === mapPlanName(plan.name)}
              onSubscribe={() => handleGoTo(plan)}
            />
          ))}
        </div>
        <hr className="mt-20" />
        <div className="mb-28 py-12">
          <Heading title="Payment History" center />
          {loading ? (
            <p className="text-center mt-4">Loading...</p>
          ) : paymentHistory?.length > 0 ? (
            <table className="min-w-full bg-white shadow-md rounded mx-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Plan</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Start Period</th>
                  <th className="px-4 py-2 text-left">End Period</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, index) => (
                  <tr
                    key={index}
                    className={`border-t ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                  >
                    <td className="px-4 py-2">
                      {toSentenceCase(payment.plan)}
                    </td>
                    <td className="px-4 py-2">{payment.amount}</td>
                    <td className="px-4 py-2">{payment.status}</td>
                    <td className="px-4 py-2">{formatDate(payment.start)}</td>
                    <td className="px-4 py-2">{formatDate(payment.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center mt-4">No payment history available.</p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SubscriptionPageClient;


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Heading from "./Heading";
// import SubscriptionCard from "./SubscriptionCard";
// import Container from "../components/Container";

// const SubscriptionPageClient = () => {
//   const router = useRouter();
//   const [userPlan, setUserPlan] = useState<string | null>(null);
//   const [paymentHistory, setPaymentHistory] = useState<
//     {
//       date: string;
//       amount: string;
//       plan: string;
//       status: string;
//       start: string;
//       end: string;
//     }[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch user's subscription plan
//   const getUserSubscription = async () => {
//     try {
//       const res = await fetch("/api/subscription"); // Call the API route
//       const data = await res.json();
//       if (res.ok) {
//         setUserPlan(data.plan); // Set the user's subscription plan
//       } else {
//         console.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching user subscription:", error);
//     }
//   };

//   // Fetch user's payment history
//   const getPaymentHistory = async () => {
//     try {
//       const res = await fetch("/api/subscription/payment-history");
//       const data = await res.json();
//       if (res.ok && Array.isArray(data.history)) {
//         setPaymentHistory(data.history);
//       }
//     } catch (error) {
//       console.error("Error fetching payment history:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await getUserSubscription();
//         await getPaymentHistory();
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

// const handleGoTo = (plan: {
//   title: string;
//   description: string;
//   price: string;
//   features: string[];
//   borderColor: string;
//   lineColor: string;
//   hoverColor: string;
//   planType: string;
// }) => {
//   const queryParams = new URLSearchParams({
//     title: plan.title,
//     description: plan.description,
//     price: plan.price,
//     features: plan.features.join(","),
//     borderColor: plan.borderColor,
//     lineColor: plan.lineColor,
//     hoverColor: plan.hoverColor,
//     planType: plan.planType,
//   }).toString();
//   router.push(`/subscription/subscriptionNext?${queryParams}`);
// };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB"); // Formats to dd-mm-yyyy
//   };

//   const toSentenceCase = (text: string) =>
//     text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

//   return (
//     <div className="min-h-screen">
//       <Container>
//         <div className="text-center">
//           <hr className="w-[100px] h-[8px] bg-yellow-500 rounded mx-auto mt-14" />
//           <Heading
//             title="Get Started with an Upgraded Account"
//             subTitle="Choose your plan"
//             center
//           />
//         </div>
//         <div className="flex flex-wrap justify-center gap-7 mt-12">
//           <SubscriptionCard
//             title="Free Plan"
//             description="Upload and Tell a story about your property."
//             price="₱ 0.00"
//             priceDesc="Pay nothing"
//             hoverColor="bg-gray-600"
//             border={true}
//             borderColor="border-gray-600"
//             lineColor="black"
//             features={[
//               "Upload a Property Listing",
//               "Communicate with Clients using Messaging Module",
//               "Check Availability of your properties real-time",
//             ]}
//             isSelected={userPlan === "free"}
//             onSubscribe={() =>
//               handleGoTo({
//                 title: "Free Plan",
//                 description: "Upload and Tell a story about your property.",
//                 price: "₱ 0.00",
//                 features: [
//                   "Upload a Property Listing",
//                   "Communicate with Clients using Messaging Module",
//                   "Check Availability of your properties real-time",
//                 ],
//                 borderColor: "border-gray-600",
//                 lineColor: "black",
//                 hoverColor: "bg-gray-600",
//                 planType: "free",
//               })
//             }
//           />
//           <SubscriptionCard
//             title="Premium Plan"
//             description="Manage 3-5 properties with full access to all features."
//             price="₱ 699.00"
//             priceDesc={
//               <>
//                 ₱ 1,249.00 when you&nbsp;
//                 <span
//                   style={{ textDecoration: "underline", fontWeight: "bold" }}
//                 >
//                   pay annually
//                 </span>
//               </>
//             }
//             border={true}
//             borderColor="border-green-700"
//             lineColor="green"
//             hoverColor="bg-green-700"
//             onSubscribe={() =>
//               handleGoTo({
//                 title: "Premium Plan",
//                 description:
//                   "Manage 3-5 properties with full access to all features.",
//                 price: "₱ 699.00",
//                 features: [
//                   "Upload 3-5 Property Listings",
//                   "Communicate with Clients using Messaging Module",
//                   "Check Availability of your properties real-time",
//                   "Verified Badge Included",
//                 ],
//                 borderColor: "border-green-700",
//                 lineColor: "green",
//                 hoverColor: "bg-green-700",
//                 planType: "premium",
//               })
//             }
//             features={[
//               "Upload 3-5 Property Listings",
//               "Communicate with Clients using Messaging Module",
//               "Check Availability of your properties real-time",
//               "Verified Badge Included",
//             ]}
//             isSelected={userPlan === "premium"}
//           />
//           <SubscriptionCard
//             title="Business Plan"
//             description="Manage > 5 properties with full access to all features."
//             price="₱ 999.00"
//             priceDesc={
//               <>
//                 ₱ 1,849.00 when you&nbsp;
//                 <span
//                   style={{ textDecoration: "underline", fontWeight: "bold" }}
//                 >
//                   pay annually
//                 </span>
//               </>
//             }
//             border={true}
//             borderColor="border-blue-900"
//             lineColor="blue"
//             hoverColor="bg-blue-800"
//             onSubscribe={() =>
//               handleGoTo({
//                 title: "Business Plan",
//                 description:
//                   "Manage > 5 properties with full access to all features.",
//                 price: "₱ 999.00",
//                 features: [
//                   "Upload 5 or more Property Listings",
//                   "Communicate with Clients using Messaging Module",
//                   "Check Availability of your properties real-time",
//                   "Verified Badge Included",
//                   "Feature Properties on Homepage",
//                 ],
//                 borderColor: "border-blue-900",
//                 lineColor: "blue",
//                 hoverColor: "bg-blue-800",
//                 planType: "business",
//               })
//             }
//             features={[
//               "Upload 5 or more Property Listings",
//               "Communicate with Clients using Messaging Module",
//               "Check Availability of your properties real-time",
//               "Verified Badge Included",
//               "Feature Properties on Homepage",
//             ]}
//             isSelected={userPlan === "business"}
//           />
//         </div>
//         <hr className="mt-20" />
//         {/* Payment history */}
//         <div className="mb-28 py-12">
//           <Heading title="Payment History" center />
//           {loading ? (
//             <p className="text-center mt-4">Loading...</p>
//           ) : paymentHistory?.length > 0 ? (
//             <table className="min-w-full bg-white shadow-md rounded mx-auto">
//               <thead>
//                 <tr>
//                   <th className="px-4 py-2 text-left">Plan</th>
//                   <th className="px-4 py-2 text-left">Amount</th>
//                   <th className="px-4 py-2 text-left">Status</th>
//                   <th className="px-4 py-2 text-left">Start Period</th>
//                   <th className="px-4 py-2 text-left">End Period</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paymentHistory.map((payment, index) => (
//                   <tr
//                     key={index}
//                     className={`border-t ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
//                       }`}
//                   >
//                     <td className="px-4 py-2">
//                       {toSentenceCase(payment.plan)}
//                     </td>
//                     <td className="px-4 py-2">{payment.amount}</td>
//                     <td className="px-4 py-2">{payment.status}</td>
//                     <td className="px-4 py-2">{formatDate(payment.start)}</td>
//                     <td className="px-4 py-2">{formatDate(payment.end)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-center mt-4">No payment history available.</p>
//           )}
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default SubscriptionPageClient;