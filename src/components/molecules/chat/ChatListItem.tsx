"use client"

import { cn } from "@/lib/utils"
import ChatAvatar from "@/components/atoms/chat/ChatAvatar"

interface ChatListItemProps {
  id: string
  name: string
  avatar: string
  // lastMessage: string
  // isActive: boolean
  onClick: any
}

export default function ChatListItem({ name, avatar, onClick, id }: ChatListItemProps) {
  return (
    <button
      className={cn("flex w-full items-start gap-3 p-3 text-left hover:bg-gray-200")}
      onClick={()=>onClick(id)}
    >
      <ChatAvatar src={avatar} name={name} />
      <div className="flex-1 overflow-hidden">
        <div className="font-medium text-blue-500">{name}</div>
        {/* <p className="truncate text-sm text-gray-400">{lastMessage}</p> */}
      </div>
    </button>
  )
}
