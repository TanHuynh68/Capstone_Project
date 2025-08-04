"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import ChatListItem from "@/components/molecules/customer/chat/ChatListItem";
import { useCurrentUser } from "@/utils";

interface ChatSidebarProps {
  users: any[];
  onSelectChat: any;
  messages: any[];
  activeChat: string;
}

export default function ChatSidebar({
  users,
  onSelectChat,
  activeChat,
}: ChatSidebarProps) {
  const userMain = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term only - no sorting by active chat
  const filteredUsers = users.filter((user) => {
    const displayName =
      userMain.id !== user.account1.accountID
        ? user.account1.accountName
        : user.account2.accountName;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex w-80 flex-col">
      <div className="flex items-center justify-between p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold">Trò Chuyện</h1>
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
        <h2 className="text-lg font-semibold">
          Cuộc trò chuyện ({filteredUsers?.length || 0})
        </h2>
      </div>

      <ScrollArea className="flex-1">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <ChatListItem
              usersInChatSection={user}
              key={user.chatRoomID}
              id={user.chatRoomID}
              name={
                userMain.id !== user.account1.accountID
                  ? user.account1.accountName
                  : user.account2.accountName
              }
              avatar={
                userMain.id !== user.account1.accountID
                  ? user.account1.avatar
                  : user.account2.avatar
              }
              onClick={onSelectChat}
              isActive={activeChat === user.chatRoomID}
            />
          ))
        ) : searchTerm ? (
          <div className="p-4 text-gray-500">
            Không tìm thấy cuộc trò chuyện nào với "{searchTerm}".
          </div>
        ) : (
          <div className="p-4 text-gray-500">Không có cuộc trò chuyện nào.</div>
        )}
      </ScrollArea>
    </div>
  );
}
