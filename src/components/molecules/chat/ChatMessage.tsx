"use client"

import { cn } from "@/lib/utils"
import ChatAvatar from "@/components/atoms/chat/ChatAvatar"
import ChatTime from "@/components/atoms/chat/ChatTime"
import MessageContent from "@/components/molecules/chat/MessageContent"
import { useCurrentUser } from "@/components/utils"

interface UserChat {
  id: string
  account1Name: string
  account2Name: string
}

interface ChatMessageProps {
  content: string
  timestamp: string
  users: UserChat[]
  senderID: string
  messageType: string
}

export default function ChatMessage({ content, timestamp, messageType, users, senderID }: ChatMessageProps) {
  const user = useCurrentUser()
  const isCurrentUser = senderID === user.id

  // Lấy thông tin người gửi
  const getSenderInfo = () => {
    if (isCurrentUser) {
      return {
        name: users[0]?.account1Name || "Bạn",
        avatar: "",
      }
    } else {
      return {
        name: users[0]?.account2Name || "Người dùng",
        avatar: "",
      }
    }
  }

  const senderInfo = getSenderInfo()

  return (
    <div className={cn("flex mb-4", isCurrentUser ? "justify-end" : "justify-start")}>
      {/* Avatar bên trái cho tin nhắn của người khác */}
      {!isCurrentUser && (
        <ChatAvatar src={senderInfo.avatar} name={senderInfo.name} size="sm" className="mr-3 self-end" />
      )}

      {/* Nội dung tin nhắn */}
      <div className={cn("max-w-[70%] flex flex-col", isCurrentUser ? "items-end" : "items-start")}>
        {/* Bubble tin nhắn */}
        <div
          className={cn(
            "rounded-lg px-3 py-2 relative",
            isCurrentUser ? "bg-blue-500 text-white rounded-br-sm" : "bg-gray-200 text-gray-900 rounded-bl-sm",
            // Điều chỉnh padding cho các loại tin nhắn khác nhau
            messageType?.toLowerCase() === "image" ? "p-1" : "px-3 py-2",
            messageType?.toLowerCase() === "link" ? "p-0" : "",
          )}
        >
          <MessageContent content={content} messageType={messageType} isCurrentUser={isCurrentUser} />
        </div>

        {/* Thời gian */}
        <ChatTime
          className={cn("mt-1 text-xs", isCurrentUser ? "text-gray-400" : "text-gray-500")}
          time={timestamp}
          isCurrentUser={isCurrentUser}
        />
      </div>

      {/* Avatar bên phải cho tin nhắn của người dùng hiện tại */}
      {isCurrentUser && (
        <ChatAvatar
          src={senderInfo.avatar}
          name={senderInfo.name}
          color="bg-blue-500"
          size="sm"
          className="ml-3 self-end"
        />
      )}
    </div>
  )
}
