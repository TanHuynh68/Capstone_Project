import { cn } from "@/lib/utils";
import ChatAvatar from "@/components/atoms/chat/ChatAvatar";
import ChatTime from "@/components/atoms/chat/ChatTime";
import { useCurrentUser } from "@/components/utils";

interface ChatMessageProps {
  content: string;
  timestamp: string;
  users: UserChat[];
  senderID: string;
}

export default function ChatMessage({
  content,
  timestamp,
  users,
  senderID
}: ChatMessageProps) {

  const user = useCurrentUser()
  return (
    <div
      className={cn("flex", senderID === user.id ? "justify-end" : "justify-start")}
    >
      {senderID != user.id && (
        <ChatAvatar
          src={""}
          name={users[0].account2Name}
          size="sm"
          className="mr-2 self-end"
        />
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-2 py-1",
          senderID === user.id ? "bg-blue-500 text-white" : "bg-gray-800"
        )}
      >
        <p>{content}</p>
        <ChatTime className="text-white" time={timestamp} isCurrentUser={senderID === user.id} />
      </div>
      {senderID === user.id && (
        <ChatAvatar
          src={""}
          name={users[0].account1Name}
          color="bg-blue-500"
          size="sm"
          className="ml-2 self-end"
        />
      )}
    </div>
  );
}
