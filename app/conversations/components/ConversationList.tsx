"use client";

import clsx from "clsx";
import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import { FullConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => [conversation, ...current]);
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (
            currentConversation &&
            conversation &&
            currentConversation.id === conversation.id
          ) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.filter((convo) => convo.id !== conversation.id)
      );

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  // Function to add a new conversation
  const addConversation = useCallback((conversation: FullConversationType) => {
    setItems((current) => [conversation, ...current]);
  }, []);

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 pb-20 mt-28 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
        isOpen ? "hidden" : "block w-full left-0"
      )}
    >
      <div className="px-5">
        <div className="flex justify-between mb-4 mt-4">
          <div className="text-2xl font-bold text-neutral-800">Messages</div>
          {/* <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
            <MdOutlineGroupAdd size={20} />
          </div> */}
        </div>
        {items.map((item) => (
          <ConversationBox
            key={item.id}
            data={item}
            selected={conversationId === item.id}
          />
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
