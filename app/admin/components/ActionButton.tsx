'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { BiDotsHorizontal } from 'react-icons/bi';

interface ActionButtonProps {
  itemId: string; // Generic ID for the item (lessee, lessor, property, subscription)
  actions: {
    label: string; // Display text for the action
    onClick: (id: string) => void; // Function to execute on click
  }[];
}

const ActionButton: React.FC<ActionButtonProps> = ({ itemId, actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <div className="relative">
      <div
        onClick={toggleOpen}
        className="
          border
          border-neutral-300
          rounded-full
          cursor-pointer
          hover:shadow-md
          transition
          bg-gray-100
          flex
          items-center
          justify-center
        "
      >
        <BiDotsHorizontal className='size-6' />
      </div>

      {isOpen && (
        <div
          className="
            absolute
            rounded-lg
            shadow-xl
            bg-gray-100
            overflow-hidden
            left-1/2
            transform -translate-x-1/2
            mt-2
            w-40
            text-sm
            z-10
          "
        >
          <div className="flex flex-col cursor-pointer">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.onClick(itemId)}
                className={`block px-6 py-4 text-center hover:bg-gray-200 transition ${
                  action.label === 'Archive'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : action.label === 'Block'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : action.label === 'Unarchive'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : action.label === 'Delete'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-sky-900 hover:bg-sky-950 text-white'
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

export default ActionButton;
