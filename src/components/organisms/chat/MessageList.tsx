import { ScrollArea } from "@/components/ui/scroll-area"
import ChatMessage from "@/components/molecules/chat/ChatMessage"

interface MessageListProps {
  messages: Message[]
  users: UserChat[]
}

export default function MessageList({ messages, users }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col gap-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === "current-user"
          const user = isCurrentUser
            ? { fullName: "Bạn", avatar: "/placeholder.svg?height=40&width=40" }
            : users.find((u) => u.id === msg.senderId)!

          return (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              isCurrentUser={isCurrentUser}
              userAvatar={user.avatar || ""}
              userName={user.fullName}
              userColor={isCurrentUser ? "bg-blue-500" : users.find((u) => u.id === msg.senderId)?.color}
            />
          )
        })}
      </div>
    </ScrollArea>
  )
}
