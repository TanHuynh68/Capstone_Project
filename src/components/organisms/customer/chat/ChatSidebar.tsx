"use client"

import { Home, Moon, Search } from "lucide-react"
import { useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

import ChatButton from "@/components/atoms/customer/chat/ChatButton"
import ChatListItem from "@/components/molecules/customer/chat/ChatListItem"

import { useCurrentUser } from "@/components/utils"

import { Link } from "react-router-dom"
import { USER_ROUTES } from "@/routes/path"

interface ChatSidebarProps {
  users: UserChat[]
  messages: Message[]
  activeChat: string
  onSelectChat: (chatId: string) => void
}

export default function ChatSidebar({ users, onSelectChat, messages, activeChat }: ChatSidebarProps) {
  const userMain = useCurrentUser()
  const [searchTerm, setSearchTerm] = useState("")

  console.log("ChatSidebar_users: ", users)
  console.log("ChatSidebar_messages: ", messages)

  // Filter users based on search term
  const filteredUsers = users?.filter((user) => {
    const displayName = userMain.id !== user.account1.accountID ? user.account1.accountName : user.account2.accountName

    return displayName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // ✨ Users đã được sắp xếp từ component cha (Chat.tsx) theo thời gian tin nhắn mới nhất
  // Chỉ cần ưu tiên active chat lên đầu nếu cần
  const sortedUsers = filteredUsers?.sort((a, b) => {
    // Ưu tiên chat đang active
    if (a.chatRoomID === activeChat) return -1
    if (b.chatRoomID === activeChat) return 1

    // Giữ nguyên thứ tự đã được sắp xếp từ component cha
    return 0
  })

  return (
    <div className="flex w-80 flex-col">
      <div className="flex items-center justify-between p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold">Trò Chuyện</h1>
        <div className="flex gap-2">
          <Link to={USER_ROUTES.HOME_PAGE} aria-label="Home">
            <ChatButton>
              <Home className="h-5 w-5" />
            </ChatButton>
          </Link>
          <ChatButton aria-label="Toggle Dark Mode">
            <Moon className="h-5 w-5" />
          </ChatButton>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 pt-2">
        <h2 className="text-lg font-semibold">Cuộc trò chuyện ({filteredUsers?.length || 0})</h2>
      </div>

      <ScrollArea className="flex-1">
        {sortedUsers?.length > 0 ? (
          sortedUsers.map((user) => (
            <ChatListItem
              usersInChatSection={user}
              key={user.chatRoomID}
              id={user.chatRoomID}
              name={userMain.id !== user.account1.accountID ? user.account1.accountName : user.account2.accountName}
              avatar={userMain.id !== user.account1.accountID ? user.account1.avatar : user.account2.avatar}
              onClick={onSelectChat}
              isActive={activeChat === user.chatRoomID}
            />
          ))
        ) : searchTerm ? (
          <div className="p-4 text-gray-500">Không tìm thấy cuộc trò chuyện nào với "{searchTerm}".</div>
        ) : (
          <div className="p-4 text-gray-500">Không có cuộc trò chuyện nào.</div>
        )}
      </ScrollArea>
    </div>
  )
}
