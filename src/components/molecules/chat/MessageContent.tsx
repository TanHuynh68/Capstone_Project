"use client"

import ChatImage from "@/components/atoms/chat/ChatImage"
import ChatLink from "@/components/atoms/chat/ChatLink"
import ChatText from "@/components/atoms/chat/ChatText"

interface MessageContentProps {
  content: string
  messageType: string
  isCurrentUser?: boolean
  className?: string
}

export default function MessageContent({
  content,
  messageType,
  isCurrentUser = false,
  className = "",
}: MessageContentProps) {
  const renderContent = () => {
    switch (messageType?.toLowerCase()) {
      case "image":
        return <ChatImage src={content} alt="Hình ảnh tin nhắn" isCurrentUser={isCurrentUser} className={className} />

      case "link":
        return <ChatLink url={content} isCurrentUser={isCurrentUser} className={className} />

      case "text":
      default:
        return <ChatText content={content} isCurrentUser={isCurrentUser} className={className} />
    }
  }
  return <>{renderContent()}</>
}
