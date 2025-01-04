"use client";

import { useEffect, useState } from "react";
import EditSubscriptionModal from "../../components/modals/EditSubscriptionModal";
import CreateSubscriptionModal from "../../components/modals/CreateSubscriptionModal"; // Import the new CreateSubscriptionModal

type Plan = {
    id: string;
    name: string;
    description: string;
    price: number;
    annualPrice: number;
    features: string[];
};

const ManageSubscriptions = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for creating new subscription plan
    const maxPlans = 3; // Limit the number of plans to 3

    const fetchPlans = async () => {
        const response = await fetch("/api/subscription/plans");
        const data: Plan[] = await response.json();
        setPlans(data);
    };

    const handleSave = async (updatedPlan: Plan) => {
        const method = updatedPlan.id ? "PATCH" : "POST";
        const url = updatedPlan.id
            ? `/api/subscription/plans/${updatedPlan.id}`
            : "/api/subscription/plans";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPlan),
        });

        const savedPlan: Plan = await response.json();

        if (updatedPlan.id) {
            setPlans(plans.map(plan => (plan.id === savedPlan.id ? savedPlan : plan)));
        } else {
            setPlans([...plans, savedPlan]);
        }

        setIsModalOpen(false);
        setEditingPlan(null);
    };

    // Function to handle saving a new subscription plan from the create modal
    const handleCreateSave = async (newPlan: Plan) => {
        const response = await fetch("/api/subscription/plans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPlan),
        });

        const savedPlan: Plan = await response.json();
        setPlans([...plans, savedPlan]);
        setIsCreateModalOpen(false);
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Manage Subscription Plans
                </h1>

                <div className="mb-6 text-center">
                    {plans.length < maxPlans ? (
                        <button
                            onClick={() => setIsCreateModalOpen(true)} // Open the create modal
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            Create New Plan
                        </button>
                    ) : (
                        <p className="text-red-600 font-semibold">You can only create up to {maxPlans} plans.</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    {plans.map(plan => (
                        <div
                            key={plan.id}
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-semibold text-gray-700">{plan.name}</h2>
                            <p className="text-gray-600 mt-2">{plan.description}</p>
                            <p className="text-lg font-bold text-gray-800 mt-4">
                                Monthly Price: ₱{plan.price}
                            </p>
                            <p className="text-lg font-bold text-gray-800 mt-2">
                                Annual Price: ₱{plan.annualPrice}
                            </p>
                            <ul className="mt-4 text-sm text-gray-600">
                                {plan.features.map((feature, index) => (
                                    <li key={index}>✔ {feature}</li>
                                ))}
                            </ul>
                            <button
                                onClick={() => {
                                    setEditingPlan(plan);
                                    setIsModalOpen(true);
                                }}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>

                {/* Edit Subscription Modal */}
                <EditSubscriptionModal
                    isOpen={isModalOpen}
                    plan={editingPlan}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />

                {/* Create Subscription Modal */}
                <CreateSubscriptionModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)} // Close the create modal
                    onSave={handleCreateSave} // Handle save for the create plan
                />
            </div>
        </div>
    );
};

export default ManageSubscriptions;


// "use client";

// import { useEffect, useState } from "react";
// import EditSubscriptionModal from "../../components/modals/EditSubscriptionModal";
// import CreateSubscriptionModal from "../../components/modals/CreateSubscriptionModal"; // Import the new CreateSubscriptionModal

// type Plan = {
//     id: string;
//     name: string;
//     description: string;
//     price: number;
//     annualPrice: number;
//     features: string[];
// };

// const ManageSubscriptions = () => {
//     const [plans, setPlans] = useState<Plan[]>([]);
//     const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for creating new subscription plan

//     const fetchPlans = async () => {
//         const response = await fetch("/api/subscription/plans");
//         const data: Plan[] = await response.json();
//         setPlans(data);
//     };

//     const handleSave = async (updatedPlan: Plan) => {
//         const method = updatedPlan.id ? "PATCH" : "POST";
//         const url = updatedPlan.id
//             ? `/api/subscription/plans/${updatedPlan.id}`
//             : "/api/subscription/plans";

//         const response = await fetch(url, {
//             method,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(updatedPlan),
//         });

//         const savedPlan: Plan = await response.json();

//         if (updatedPlan.id) {
//             setPlans(plans.map(plan => (plan.id === savedPlan.id ? savedPlan : plan)));
//         } else {
//             setPlans([...plans, savedPlan]);
//         }

//         setIsModalOpen(false);
//         setEditingPlan(null);
//     };

//     // Function to handle saving a new subscription plan from the create modal
//     const handleCreateSave = async (newPlan: Plan) => {
//         const response = await fetch("/api/subscription/plans", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(newPlan),
//         });

//         const savedPlan: Plan = await response.json();
//         setPlans([...plans, savedPlan]);
//         setIsCreateModalOpen(false);
//     };

//     useEffect(() => {
//         fetchPlans();
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-100 py-10">
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//                     Manage Subscription Plans
//                 </h1>

//                 <div className="mb-6 text-center">
//                     <button
//                         onClick={() => setIsCreateModalOpen(true)} // Open the create modal
//                         className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//                     >
//                         Create New Plan
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
//                     {plans.map(plan => (
//                         <div
//                             key={plan.id}
//                             className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
//                         >
//                             <h2 className="text-xl font-semibold text-gray-700">{plan.name}</h2>
//                             <p className="text-gray-600 mt-2">{plan.description}</p>
//                             <p className="text-lg font-bold text-gray-800 mt-4">
//                                 Monthly Price: ₱{plan.price}
//                             </p>
//                             <p className="text-lg font-bold text-gray-800 mt-2">
//                                 Annual Price: ₱{plan.annualPrice}
//                             </p>
//                             <ul className="mt-4 text-sm text-gray-600">
//                                 {plan.features.map((feature, index) => (
//                                     <li key={index}>✔ {feature}</li>
//                                 ))}
//                             </ul>
//                             <button
//                                 onClick={() => {
//                                     setEditingPlan(plan);
//                                     setIsModalOpen(true);
//                                 }}
//                                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                             >
//                                 Edit
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Edit Subscription Modal */}
//                 <EditSubscriptionModal
//                     isOpen={isModalOpen}
//                     plan={editingPlan}
//                     onClose={() => setIsModalOpen(false)}
//                     onSave={handleSave}
//                 />

//                 {/* Create Subscription Modal */}
//                 <CreateSubscriptionModal
//                     isOpen={isCreateModalOpen}
//                     onClose={() => setIsCreateModalOpen(false)} // Close the create modal
//                     onSave={handleCreateSave} // Handle save for the create plan
//                 />
//             </div>
//         </div>
//     );
// };

// export default ManageSubscriptions;
