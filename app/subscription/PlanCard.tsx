"use client";

import React from "react";

interface PlanCardProps{
    plan?: string;
    price?: string;
    borderColor?: string;
    hoverColor?: string;
    onClick?: () => void;  // Add the onClick prop
}

const PlanCard: React.FC<PlanCardProps> = ({
    plan = "Plan",
    price = "₱ 0.00",
    borderColor = 'border-gray-300',
    hoverColor = 'bg-gray-300',
    onClick,  // Destructure the onClick prop
}) => {
    return (
        <div className="flex flex-col gap-8">
            <div className={`
                shadow-xl 
                border-2 
                ${borderColor}
                rounded-md 
                p-8 
                mt-6
            `}>
            <div className="
                text-3xl 
                font-bold 
                mb-3">
                    {plan}
            </div>
            <hr className={`w-[120px] h-[5px] mb-3 -mt-2 ml-1 ${borderColor}`}/>
            <div className="
                text-2xl
                font-medium
                ml-5
                mb-6
                mt-4">
                    {price} / {plan?.toLowerCase()}
            </div>
            <div className="flex justify-center">
                <button
                 onClick={onClick}  // Attach the onClick handler
                 className={`
                    p-2
                    px-5
                    border-2
                    border-black
                    rounded-full
                    font-bold
                    text-xl
                    text-black
                    bg-yellow-300
                    hover:${hoverColor}
                    hover:text-white
                    transition duration-300s
                `}>
                    Select
                </button>
            </div>
            </div>
        </div>
    );
};

export default PlanCard;

