"use client";

import React, { useState, useCallback } from "react";
import { BiDotsHorizontal } from "react-icons/bi";

interface SubscriptionActionsProps {
  itemId: string; // The ID of the subscription or item associated with the actions
  actions: {
    label: string; // The label for the button (e.g., "View", "Cancel")
    onClick: (id: string) => void; // The function to execute when the action is clicked, receiving `itemId`
  }[];
}

const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  itemId,
  actions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      {/* Dots Button */}
      <div
        onClick={toggleOpen}
        className="border border-neutral-300 rounded-full cursor-pointer hover:shadow-md transition bg-gray-100 flex items-center justify-center p-2"
      >
        <BiDotsHorizontal size={20} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute rounded-lg shadow-xl bg-gray-100 overflow-hidden left-1/2 transform -translate-x-1/2 mt-2 w-45 text-sm z-10 whitespace-nowrap"
        >
          <div className="flex flex-col cursor-pointer">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.onClick(itemId)}
                className={`block px-4 py-2 text-center hover:bg-gray-200 transition 
                  ${
                    action.label === "View"
                      ? "bg-sky-900 hover:bg-sky-950 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionActions;
