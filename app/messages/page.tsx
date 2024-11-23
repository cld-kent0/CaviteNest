// app/messages/Messages.tsx
import EmptyState from "@/app/components/message/EmptyState";

const Messages = () => {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
};

export default Messages;
