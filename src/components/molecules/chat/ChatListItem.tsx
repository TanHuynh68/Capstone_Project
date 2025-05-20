"use client"

import { cn } from "@/lib/utils"
import ChatAvatar from "@/components/atoms/chat/ChatAvatar"

interface ChatListItemProps {
  id: string
  name: string
  avatar: string
  color: string
  lastMessage: string
  isActive: boolean
  onClick: () => void
}

export default function ChatListItem({ name, avatar, color, lastMessage, isActive, onClick }: ChatListItemProps) {
  return (
    <button
      className={cn("flex w-full items-start gap-3 p-3 text-left hover:bg-gray-900", isActive && "bg-gray-900")}
      onClick={onClick}
    >
      <ChatAvatar src={avatar} name={name} color={color} />
      <div className="flex-1 overflow-hidden">
        <div className="font-medium">{name}</div>
        <p className="truncate text-sm text-gray-400">{lastMessage}</p>
      </div>
    </button>
  )
}
