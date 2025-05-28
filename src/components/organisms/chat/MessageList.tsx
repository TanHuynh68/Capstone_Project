"use client"

import { useRef, useEffect } from "react"
import ChatMessage from "@/components/molecules/chat/ChatMessage"


interface MessageListProps {
  messages: Message[]
  users: UserChat[]
  loading?: boolean
  className?: string
  onDeleteMessage?: (messageId: string) => Promise<void>
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>
}

export default function MessageList({
  messages,
  users,
  loading = false,
  className = "",
  onDeleteMessage,
  onEditMessage,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (loading) {
    return (
      <div className={`flex h-full items-center justify-center ${className}`}>
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Đang tải tin nhắn...</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className={`flex h-full items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-gray-500">Chưa có tin nhắn nào.</p>
          <p className="text-sm text-gray-400">Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col space-y-4 p-4 ${className}`} data-testid="message-list">
      {messages.map((message) => (
        <ChatMessage
          key={message.senderID}
          id={message.senderID}
          content={message.content}
          timestamp={message.sentAt}
          messageType={message.messageType}
          users={users}
          senderID={message.senderID}
          onDeleteMessage={onDeleteMessage}
          onEditMessage={onEditMessage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
