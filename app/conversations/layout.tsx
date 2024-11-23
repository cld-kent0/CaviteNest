// app/layout.tsx or wherever your ConversationsLayout is defined
import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import { getServerSession } from "next-auth/next"; // Import getServerSession
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust the path accordingly
import SessionWrapper from "../conversations/components/SessionWrapper"; // Import the client component

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const session = await getServerSession(authOptions); // Fetch the session

  return (
    <Sidebar>
      <div className="h-full">
        <SessionWrapper session={session}>
          {" "}
          {/* Wrap with SessionWrapper */}
          <ConversationList initialItems={conversations} />
          {children}
        </SessionWrapper>
      </div>
    </Sidebar>
  );
}
