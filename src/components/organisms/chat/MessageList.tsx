import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/molecules/chat/ChatMessage";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/atoms/loading-spinner/LoadingSpinner";

interface MessageListProps {
  messages: Message[];
  users: UserChat[];
  shouldScrollToBottom: boolean;
}

export default function MessageList({
  messages,
  users,
  shouldScrollToBottom,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number>(0);

  // đẩy tin nhắn mới nhất khi mới vào
  useEffect(() => {
    if (count === 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setCount(1);
  }, [messages, shouldScrollToBottom, count]); // Theo dõi mảng messages

  useEffect(() => {
    if (shouldScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]); // Theo dõi mảng messages

  if (messages.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollArea className="flex-1 p-4 ">
      <div className="flex flex-col gap-4">
        {messages?.map((msg) => (
          <ChatMessage
            senderID={msg.senderID}
            key={msg.senderID}
            content={msg.content}
            timestamp={msg.sentAt}
            users={users}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
