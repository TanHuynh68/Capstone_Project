import { cn } from "@/lib/utils"
import ChatAvatar from "@/components/atoms/chat/ChatAvatar"
import ChatTime from "@/components/atoms/chat/ChatTime"

interface ChatMessageProps {
  content: string
  timestamp: string
  isCurrentUser: boolean
  userAvatar: string
  userName: string
  userColor?: string
}

export default function ChatMessage({
  content,
  timestamp,
  isCurrentUser,
  userAvatar,
  userName,
  userColor,
}: ChatMessageProps) {
  return (
    <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
      {!isCurrentUser && (
        <ChatAvatar src={userAvatar} name={userName} color={userColor} size="sm" className="mr-2 self-end" />
      )}
      <div className={cn("max-w-[70%] rounded-lg px-4 py-2", isCurrentUser ? "bg-white text-black" : "bg-gray-800")}>
        <p>{content}</p>
        <ChatTime time={timestamp} isCurrentUser={isCurrentUser} />
      </div>
      {isCurrentUser && (
        <ChatAvatar src={userAvatar} name={userName} color="bg-blue-500" size="sm" className="ml-2 self-end" />
      )}
    </div>
  )
}
