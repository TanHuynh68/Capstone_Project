"use client"

import { Github, Moon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatButton from "@/components/atoms/chat/ChatButton"
import ChatListItem from "@/components/molecules/chat/ChatListItem"
import { useCurrentUser } from "@/components/utils"

interface ChatSidebarProps {
  users: UserChat[]
  messages: Message[]
  activeChat: string
  onSelectChat: (chatRoomID: string) => void
}

export default function ChatSidebar({ messages, users, onSelectChat }: ChatSidebarProps) {
  const userMain = useCurrentUser();
  console.log('userMain: ', userMain)
  return (
    <div className="flex w-80 flex-col border-r border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-800 p-4 sticky top-0 z-10 bg-gray-950">
        <h1 className="text-xl font-bold text-indigo-400">Trò Chuyện</h1>
        <div className="flex gap-2">
          <ChatButton>
            <Github className="h-5 w-5" />
            <span className="sr-only">Github</span>
          </ChatButton>
          <ChatButton>
            <Moon className="h-5 w-5" />
            <span className="sr-only">Chế độ tối</span>
          </ChatButton>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Cuộc trò chuyện ({messages?.length})</h2>
        <div className="flex gap-2">
          <ChatButton>
            <span className="sr-only">Tùy chọn</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </ChatButton>
          <ChatButton>
            <span className="sr-only">Cuộc trò chuyện mới</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </ChatButton>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {users?.map((user) => {
          return (
            <ChatListItem
              key={user.chatRoomID}
              id={user.chatRoomID}
              name={userMain.id != user.account1ID ? user.account1Name : user.account2Name}
              avatar={""}
              onClick={() => onSelectChat(user.chatRoomID)}
            />
          )
        })}
      </ScrollArea>
    </div>
  )
}
