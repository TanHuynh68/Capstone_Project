import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/molecules/chat/ChatMessage";

interface MessageListProps {
  messages: Message[];
  users: UserChat[];
}

export default function MessageList({ messages, users }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
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
    </ScrollArea>
  );
}
