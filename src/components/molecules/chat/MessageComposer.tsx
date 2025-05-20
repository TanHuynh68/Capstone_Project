"use client"

import { useState, type FormEvent } from "react"
import { PlusCircle, Paperclip, Smile, ThumbsUp } from "lucide-react"
import ChatButton from "@/components/atoms/chat/ChatButton"
import ChatInput from "@/components/atoms/chat/ChatInput"

interface MessageComposerProps {
  onSendMessage: (message: string) => void
}

export default function MessageComposer({ onSendMessage }: MessageComposerProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    onSendMessage(message)
    setMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-800 p-4">
      <ChatButton type="button">
        <PlusCircle className="h-5 w-5" />
        <span className="sr-only">Thêm</span>
      </ChatButton>
      <ChatButton type="button">
        <Paperclip className="h-5 w-5" />
        <span className="sr-only">Đính kèm</span>
      </ChatButton>
      <ChatInput placeholder="Nhập tin nhắn..." value={message} onChange={(e) => setMessage(e.target.value)} />
      <ChatButton type="button">
        <Smile className="h-5 w-5" />
        <span className="sr-only">Biểu tượng cảm xúc</span>
      </ChatButton>
      <ChatButton type="submit" disabled={!message.trim()}>
        <ThumbsUp className="h-5 w-5" />
        <span className="sr-only">Gửi</span>
      </ChatButton>
    </form>
  )
}
