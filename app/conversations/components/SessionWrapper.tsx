// app/components/SessionWrapper.tsx
"use client"; // This line makes it a client component

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionWrapperProps {
  children: ReactNode;
  session: any; // You can use a more specific type based on your session structure
}

const SessionWrapper: React.FC<SessionWrapperProps> = ({
  children,
  session,
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionWrapper;
