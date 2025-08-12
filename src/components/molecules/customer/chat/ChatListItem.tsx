"use client";

import { cn } from "@/lib/utils";
import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar";
import { formatDateTimeVN, useCurrentUser } from "@/utils";

interface ChatListItemProps {
  id: string;
  name: string;
  avatar: string;
  onClick: any;
  usersInChatSection: UserChat;
  isActive?: boolean;
}

// Helper function to calculate relative time
const getRelativeTime = (updatedAt: string): string => {
  const now = new Date();
  const messageTime = new Date(formatDateTimeVN(updatedAt));
  const diffInMs = now.getTime() - messageTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Vừa xong";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    return messageTime.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  }
};

const renderLastMessage = (lastMessage: string, messageType: string) => {
  switch (messageType) {
    case "Image":
      return "Đã gửi 1 hình ảnh";
    case "Link":
      return "Đã gửi 1 đường dẫn";
    case "Json":
      return "Đã gửi 1 bản vẽ";
    case "Text":
      return lastMessage;
    default:
      return lastMessage;
  }
};

export default function ChatListItem({
  name,
  avatar,
  onClick,
  id,
  usersInChatSection,
  isActive = false,
}: ChatListItemProps) {
  const currentUser = useCurrentUser();

  // Determine if message is unread for current user
  const isUnread =
    currentUser?.id === usersInChatSection.account1.accountID
      ? !usersInChatSection.account1IsRead
      : !usersInChatSection.account2IsRead;

  // Get relative time
  const relativeTime = getRelativeTime(usersInChatSection.updatedAt);

  return (
    <div className="p-1 ">
      <button
        className={cn(
          "flex items-start cursor-pointer gap-3 p-3 text-left hover:bg-primary hover:text-white transition-colors w-full rounded-lg",
          isActive && "bg-primary text-white"
        )}
        onClick={() => onClick(id)}
      >
        <div className="relative">
          <ChatAvatar src={avatar} name={name} />
          {isUnread && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-1">
            <div
              className={cn(
                "font-medium truncate",
                isUnread && "font-bold",
                isActive && "text-white"
              )}
            >
              {name}
            </div>
            <div
              className={cn(
                "text-xs text-gray-500 flex-shrink-0 ml-2",
                isActive && "text-gray-200",
                isUnread && "text-gray-700 font-semibold"
              )}
            >
              {relativeTime}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={cn(
                "text-sm truncate w-full",
                isUnread && "font-semibold text-gray-900",
                isActive && "text-gray-200",
                !isUnread && !isActive && "text-gray-500"
              )}
            >
              {currentUser?.id === usersInChatSection.senderID
                ? `Bạn: ${renderLastMessage(
                    usersInChatSection.lastMessage,
                    usersInChatSection.messageType
                  )}`
                : renderLastMessage(
                    usersInChatSection.lastMessage,
                    usersInChatSection.messageType
                  )}
            </div>
            {isUnread && !isActive && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
