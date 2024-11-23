"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useState, useRef } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import { useSession } from "next-auth/react"; // Import useSession for session handling

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const { data: session } = useSession(); // Get session data (current user info)
  const [messages, setMessages] = useState(initialMessages);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined); // State to store the user ID
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    if (session?.user?.email) {
      // Fetch user ID from database using the session email
      axios
        .get(`/api/user?id=${session.user.email}`)
        .then((response) => {
          if (response.data?.id) {
            setCurrentUserId(response.data.id); // Set the fetched user ID in the state
          }
        })
        .catch((error) => {
          console.error("Error fetching user ID", error);
        });
    }
  }, [session?.user?.email]); // Trigger effect when the session email changes

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div ref={bottomRef} className="pt-24">
        {messages.map((message, i) => (
          <MessageBox
            key={message.id}
            data={message}
            isLast={i === messages.length - 1}
            listingId={message.listingId} // Pass the listing ID here
            listingOwner={message.listingOwner} // Pass the listing owner's ID here
            currentUserId={currentUserId} // Pass the fetched currentUserId to MessageBox
          />
        ))}
      </div>
    </div>
  );
};

export default Body;
