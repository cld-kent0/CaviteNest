"use client";

import { useEffect } from "react";
import EmptyState from "./components/EmptyState";

interface ErrorStaateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStaateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <EmptyState title="Uh Oh" subTitle="Something went wrong." />;
};

export default ErrorState;
