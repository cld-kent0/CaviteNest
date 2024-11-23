// app/messages/components/UserList.tsx
"use client"; // Mark this as a client component

import React, { useState } from "react";
import { SafeUser } from "@/app/types";
import UserBox from "./UserBox";

interface UserListProps {
  items: SafeUser[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Define onStartConversation function here for handling the event
  const handleStartConversation = (userId: string) => {
    console.log("Starting conversation with user:", userId);
    // Add logic to start the conversation here
  };

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter items based on the search query
  const filteredItems = items.filter(
    (item) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()) // Use optional chaining
  );

  return (
    <aside className="fixed inset-y-0 pb-20 pt-28 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 py-4">People</div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border p-2 rounded w-full mb-4"
          />
        </div>

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <UserBox
              key={item.id}
              data={item}
              onStartConversation={() => handleStartConversation(item.id)}
            />
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </aside>
  );
};

export default UserList;
