// "use client";

// import { useEffect, useState } from "react";

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
//     const [newPlan, setNewPlan] = useState<Partial<Plan>>({
//         name: "",
//         description: "",
//         price: 0,
//         annualPrice: 0, // Add this field
//         features: [],
//     });

//     const fetchPlans = async () => {
//         const response = await fetch("/api/subscription/plans");
//         const data: Plan[] = await response.json();
//         setPlans(data);
//     };

//     const savePlan = async () => {
//         const method = newPlan?.id ? "PATCH" : "POST";
//         const url = newPlan?.id
//             ? `/api/subscription/plans/${newPlan.id}`
//             : "/api/subscription/plans";

//         const response = await fetch(url, {
//             method,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(newPlan),
//         });

//         const savedPlan: Plan = await response.json();

//         if (newPlan?.id) {
//             setPlans(plans.map(plan => (plan.id === savedPlan.id ? savedPlan : plan)));
//         } else {
//             setPlans([...plans, savedPlan]);
//         }

//         setNewPlan({ name: "", description: "", price: 0, annualPrice: 0, features: [] });
//         setEditingPlan(null); // Clear editing state after saving
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
//                                     <li key={index}>&#8226; {feature}</li>
//                                 ))}
//                             </ul>
//                             <button
//                                 onClick={() => setEditingPlan(plan)}
//                                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                             >
//                                 Edit
//                             </button>
//                         </div>

//                     ))}
//                 </div>

//                 {/* Create/Update Plan Section */}
//                 <div className="bg-white shadow-md rounded-lg p-6">
//                     <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                         {newPlan?.id ? "Update Subscription Plan" : "Create Subscription Plan"}
//                     </h2>
//                     <div className="space-y-4">
//                         <div>
//                             <label
//                                 htmlFor="name"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Plan Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 value={newPlan.name}
//                                 onChange={e =>
//                                     setNewPlan({ ...newPlan, name: e.target.value })
//                                 }
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor="description"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Description
//                             </label>
//                             <textarea
//                                 id="description"
//                                 value={newPlan.description}
//                                 onChange={e =>
//                                     setNewPlan({ ...newPlan, description: e.target.value })
//                                 }
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor="price"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Price (₱)
//                             </label>
//                             <input
//                                 type="number"
//                                 id="price"
//                                 value={newPlan.price}
//                                 onChange={e =>
//                                     setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })
//                                 }
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor="annualPrice"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Annual Price (₱)
//                             </label>
//                             <input
//                                 type="number"
//                                 id="annualPrice"
//                                 value={newPlan.annualPrice}
//                                 onChange={e =>
//                                     setNewPlan({ ...newPlan, annualPrice: parseFloat(e.target.value) })
//                                 }
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label
//                                 htmlFor="features"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Features (comma-separated)
//                             </label>
//                             <input
//                                 type="text"
//                                 id="features"
//                                 value={newPlan.features?.join(", ")}
//                                 onChange={e =>
//                                     setNewPlan({
//                                         ...newPlan,
//                                         features: e.target.value.split(",").map(f => f.trim()),
//                                     })
//                                 }
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <button
//                             onClick={savePlan}
//                             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                         >
//                             {newPlan?.id ? "Update Plan" : "Create Plan"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ManageSubscriptions;

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
                    <button
                        onClick={() => setIsCreateModalOpen(true)} // Open the create modal
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Create New Plan
                    </button>
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
