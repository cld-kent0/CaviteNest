'use client'

import Modal from '@/app/components/modals/Modal';
import React, { useState, useEffect } from 'react';

interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    annualPrice: number;
    features: string[];
}

interface EditSubscriptionModalProps {
    isOpen: boolean;
    plan: Plan | null;
    onClose: () => void;
    onSave: (updatedPlan: Plan) => void;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({ isOpen, plan, onClose, onSave }) => {
    const [newPlan, setNewPlan] = useState<Partial<Plan>>({
        name: "",
        description: "",
        price: 0,
        annualPrice: 0,
        features: [],
    });

    useEffect(() => {
        if (plan) {
            setNewPlan({ ...plan });
        }
    }, [plan]);

    const handleSave = () => {
        if (
            newPlan.name &&
            newPlan.description &&
            newPlan.price !== undefined &&
            newPlan.annualPrice !== undefined
        ) {
            onSave(newPlan as Plan);
        } else {
            // Optionally, handle validation feedback here
            console.error("All fields are required, including price and annual price (can be 0).");
        }
    };

    if (!isOpen || !plan) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Subscription Plan"
            actionLabel="Save"
            onSubmit={handleSave}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plan Name</label>
                    <input
                        type="text"
                        id="name"
                        value={newPlan.name || ""}
                        // onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={newPlan.description || ""}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₱)</label>
                    <input
                        type="number"
                        id="price"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="annualPrice" className="block text-sm font-medium text-gray-700">Annual Price (₱)</label>
                    <input
                        type="number"
                        id="annualPrice"
                        value={newPlan.annualPrice}
                        onChange={(e) => setNewPlan({ ...newPlan, annualPrice: parseFloat(e.target.value) })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="features" className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
                    <input
                        type="text"
                        id="features"
                        value={newPlan.features?.join(", ") || ""}
                        onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split(",").map(f => f.trim()) })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditSubscriptionModal;
