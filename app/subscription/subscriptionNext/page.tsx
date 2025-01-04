// "use client";

// import React from "react";
// import Heading from "../Heading";
// import SubscriptionCard from "../SubscriptionCard";
// import PlanCard from "../PlanCard";
// import Container from "@/app/components/Container";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import { useRouter, useSearchParams } from "next/navigation";

// const getStripeLink = (planType: string, billingPeriod: string) => {
//     if (planType === "premium") {
//         return billingPeriod === "quarterly"
//             ? process.env.NEXT_PUBLIC_STRIPE_QUARTERLY_PREMIUM_PLAN_LINK
//             : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_PLAN_LINK;
//     } else if (planType === "business") {
//         return billingPeriod === "quarterly"
//             ? process.env.NEXT_PUBLIC_STRIPE_QUARTERLY_BUSINESS_PLAN_LINK
//             : process.env.NEXT_PUBLIC_STRIPE_YEARLY_BUSINESS_PLAN_LINK;
//     } else {
//         return null; // Free plan or unsupported
//     }
// };

// const SubscriptionNext = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     // Extract parameters from the query
//         const title = searchParams?.get("title") ?? "Default Title";
//     const description = searchParams?.get("description") ?? "Default Description";
//     const priceString = searchParams?.get("price") ?? "₱0.00";
//     const featuresString = searchParams?.get("features") ?? "";
//     const features = featuresString ? featuresString.split(",") : [];
//     const borderColor = searchParams?.get("borderColor") ?? "defaultBorderColor";
//     const lineColor = searchParams?.get("lineColor") ?? "defaultLineColor";
//     const hoverColor = searchParams?.get("hoverColor") ?? "defaultHoverColor";
//     const planType = searchParams?.get("planType") ?? "free"; // or another appropriate default value

//     // Adjust price based on your calculation
//     const calculateAdjustedPrice = (priceString: string): number => {
//         const numericPrice = parseFloat(priceString.replace(/[₱,]/g, "").trim());
//         return numericPrice * 2 - 149;
//     };
//     const adjustedPrice = calculateAdjustedPrice(priceString);

//     const handleGoBack = () => {
//         router.back();
//     };

//     const handleSelectPlan = (billingPeriod: string) => {
//         const stripeLink = getStripeLink(planType, billingPeriod);
//         if (stripeLink) {
//             window.location.href = stripeLink;
//         } else {
//             console.error(`Stripe link not found for ${planType} plan with ${billingPeriod} billing.`);
//         }
//     };

//     return (
//         <div className="min-h-screen">
//             <Container>
//                 <hr className="w-[100px] h-[8px] bg-yellow-500 rounded ml-20 mt-14" />
//                 <div className="flex flex-wrap items-center justify-start gap-2">
//                     <div onClick={handleGoBack} className="text-black cursor-pointer mr-6" title="Go Back">
//                         <FontAwesomeIcon icon={faArrowLeft} size="3x" />
//                     </div>
//                     <Heading title="Plan Selection" subTitle="Review your chosen Plan" />
//                 </div>
//                 <div className="flex flex-wrap justify-center gap-48 mt-20">
//                     <div className="flex-none justify-center">
//                         <SubscriptionCard
//                             title={title}
//                             description={description}
//                             price={priceString}
//                             features={features}
//                             borderColor={borderColor}
//                             lineColor={lineColor}
//                             hoverColor={hoverColor}
//                             isButtonHidden={true}
//                             border={true}
//                         />
//                     </div>
//                     <div className="flex-none -my-12">
//                         <h1 className="text-4xl font-extrabold">Select a Plan</h1>
//                         <div className="flex flex-col gap-4">
//                             {planType === "premium" && (
//                                 <>
//                                     <PlanCard
//                                         plan="Quarterly Premium"
//                                         price={priceString}
//                                         borderColor={borderColor}
//                                         hoverColor={hoverColor}
//                                         onClick={() => handleSelectPlan("quarterly")}
//                                     />
//                                     <PlanCard
//                                         plan="Annually Premium"
//                                         price={`₱ ${adjustedPrice}.00`}
//                                         borderColor={borderColor}
//                                         hoverColor={hoverColor}
//                                         onClick={() => handleSelectPlan("annually")}
//                                     />
//                                 </>
//                             )}
//                             {planType === "business" && (
//                                 <>
//                                     <PlanCard
//                                         plan="Quarterly Business"
//                                         price={priceString}
//                                         borderColor={borderColor}
//                                         hoverColor={hoverColor}
//                                         onClick={() => handleSelectPlan("quarterly")}
//                                     />
//                                     <PlanCard
//                                         plan="Annually Business"
//                                         price={`₱ ${adjustedPrice}.00`}
//                                         borderColor={borderColor}
//                                         hoverColor={hoverColor}
//                                         onClick={() => handleSelectPlan("annually")}
//                                     />
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default SubscriptionNext;

"use client";

import React, { useState } from "react";
import Heading from "../Heading";
import SubscriptionCard from "../SubscriptionCard";
import PlanCard from "../PlanCard";
import Container from "@/app/components/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/app/components/modals/Modal";
import GcashPaymentModal from "@/app/components/modals/GcashPaymentModal";

const getPaymentLink = (
  planType: string,
  billingPeriod: string,
  paymentMethod: string
) => {
  if (paymentMethod === "stripe") {
    return planType === "premium"
      ? billingPeriod === "quarterly"
        ? process.env.NEXT_PUBLIC_STRIPE_QUARTERLY_PREMIUM_PLAN_LINK
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_PLAN_LINK
      : billingPeriod === "quarterly"
        ? process.env.NEXT_PUBLIC_STRIPE_QUARTERLY_BUSINESS_PLAN_LINK
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_BUSINESS_PLAN_LINK;
    // } else if (paymentMethod === "gcash") {
    //     return process.env.NEXT_PUBLIC_GCASH_PLAN_LINK;
    // } else if (paymentMethod === "otherOption") {
    //     return process.env.NEXT_PUBLIC_GCASH_PLAN_LINK;
  }
  return null;
};

const SubscriptionNext = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [billingPeriod, setBillingPeriod] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGcashModalOpen, setIsGcashModalOpen] = useState(false); // State for opening Gcash modal

  // Add a state for subscriptionId
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const title = searchParams?.get("title") ?? "Default Title";
  const description = searchParams?.get("description") ?? "Default Description";
  const priceString = searchParams?.get("price") ?? "₱0.00";
  const featuresString = searchParams?.get("features") ?? "";
  const features = featuresString ? featuresString.split(",") : [];
  const borderColor = searchParams?.get("borderColor") ?? "defaultBorderColor";
  const lineColor = searchParams?.get("lineColor") ?? "defaultLineColor";
  const hoverColor = searchParams?.get("hoverColor") ?? "defaultHoverColor";
  const planType = searchParams?.get("planType") ?? "free";

  const calculateAdjustedPrice = (priceString: string): number => {
    const numericPrice = parseFloat(priceString.replace(/[₱,]/g, "").trim());
    return numericPrice * 2 - 149;
  };
  const adjustedPrice = calculateAdjustedPrice(priceString);

  const getPriceForBillingPeriod = (billingPeriod: string): string => {
    const numericPrice = parseFloat(priceString.replace(/[₱,]/g, "").trim());
    if (billingPeriod === "quarterly") {
      return priceString; // Quarterly price remains the same
    } else if (billingPeriod === "annually") {
      const annualPrice = numericPrice * 2 - 149; // Adjusted formula for annual price
      return `₱ ${annualPrice.toFixed(2)}`;
    }
    return "₱0.00"; // Default fallback
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSelectPlan = (selectedBillingPeriod: string) => {
    setBillingPeriod(selectedBillingPeriod);
    setIsModalOpen(true); // Open the modal when a billing period is selected
  };

  const handleConfirmPayment = () => {
    if (!billingPeriod || !selectedPaymentMethod) {
      console.error("Billing period or payment method not selected.");
      return;
    }

    if (selectedPaymentMethod === "stripe") {
      const paymentLink = getPaymentLink(planType, billingPeriod, "stripe");
      if (paymentLink) {
        window.location.href = paymentLink; // Redirect to Stripe
      } else {
        console.error("Stripe payment link not found.");
      }
    } else if (selectedPaymentMethod === "gcash") {
      setIsGcashModalOpen(true); // Open GCash payment modal
    }

    // const paymentLink = getPaymentLink(planType, billingPeriod, selectedPaymentMethod);
    // if (paymentLink) {
    //     window.location.href = paymentLink;
    // } else {
    //     console.error(`Payment link not found for ${planType} plan with ${billingPeriod} billing.`);
    // }
  };

  return (
    <div className="min-h-screen">
      <Container>
        <hr className="w-[100px] h-[8px] bg-yellow-500 rounded ml-20 mt-14" />
        <div className="flex flex-wrap items-center justify-start gap-2">
          <div
            onClick={handleGoBack}
            className="text-black cursor-pointer mr-6"
            title="Go Back"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="3x" />
          </div>
          <Heading title="Plan Selection" subTitle="Review your chosen Plan" />
        </div>
        <div className="flex flex-wrap justify-center gap-48 mt-20">
          <div className="flex-none justify-center">
            <SubscriptionCard
              title={title}
              description={description}
              price={priceString}
              features={features}
              borderColor={borderColor}
              lineColor={lineColor}
              hoverColor={hoverColor}
              isButtonHidden={true}
              border={true}
            />
          </div>
          <div className="flex-none -my-12">
            <h1 className="text-4xl font-extrabold">Select a Plan</h1>
            <div className="flex flex-col gap-4">
              {planType === "premium" && (
                <>
                  <PlanCard
                    plan="Quarterly Premium"
                    price={priceString}
                    borderColor={borderColor}
                    hoverColor={hoverColor}
                    onClick={() => handleSelectPlan("quarterly")}
                  />
                  <PlanCard
                    plan="Annually Premium"
                    price={`₱ ${adjustedPrice}.00`}
                    borderColor={borderColor}
                    hoverColor={hoverColor}
                    onClick={() => handleSelectPlan("annually")}
                  />
                </>
              )}
              {planType === "business" && (
                <>
                  <PlanCard
                    plan="Quarterly Business"
                    price={priceString}
                    borderColor={borderColor}
                    hoverColor={hoverColor}
                    onClick={() => handleSelectPlan("quarterly")}
                  />
                  <PlanCard
                    plan="Annually Business"
                    price={`₱ ${adjustedPrice}.00`}
                    borderColor={borderColor}
                    hoverColor={hoverColor}
                    onClick={() => handleSelectPlan("annually")}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Payment Method Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConfirmPayment}
        title="Choose a Payment Method"
        actionLabel="Confirm Payment"
      >
        <div className="relative gap-4 mt-4">
          <button
            onClick={() => setSelectedPaymentMethod("stripe")}
            className={`px-4 py-4 mt-4 rounded-lg w-full ${selectedPaymentMethod === "stripe"
              ? "bg-violet-800 text-white border-solid border-2 border-gray-500"
              : "bg-violet-500 text-white"
              }`}
          >
            Stripe
          </button>
          <button
            onClick={() => setSelectedPaymentMethod("gcash")}
            className={`px-4 py-4 mt-4 rounded-lg w-full ${selectedPaymentMethod === "gcash"
              ? "bg-blue-800 text-white border-solid border-2 border-gray-500"
              : "bg-blue-500 text-white"
              }`}
          >
            GCash
          </button>
          {/* <button
                        onClick={() => setSelectedPaymentMethod("otherOption")}
                        className={`px-4 py-4 mt-4 rounded-lg w-full ${selectedPaymentMethod === "otherOption" ? "bg-green-800 text-white border-solid border-2 border-gray-500" : "bg-green-500 text-white"}`}
                    >
                        Other Option
                    </button> */}
        </div>
      </Modal>

      {/* GCash Payment Modal */}
      <GcashPaymentModal
        isOpen={isGcashModalOpen}
        onClose={() => setIsGcashModalOpen(false)}
        selectedPlan={planType}
        billingPeriod={billingPeriod}
        price={getPriceForBillingPeriod(billingPeriod || "quarterly")} // Adjusted price
        subscriptionId={subscriptionId || ""} // Pass the subscriptionId here
        onSubmit={() => console.log("Processing GCash Payment...")}
      />
    </div>
  );
};
export default SubscriptionNext;
