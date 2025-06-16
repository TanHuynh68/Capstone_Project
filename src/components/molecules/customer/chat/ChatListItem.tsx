"use client";

import { cn } from "@/lib/utils";
import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar";
import { useCurrentUser } from "@/components/utils";

interface ChatListItemProps {
  id: string;
  name: string;
  avatar: string;
  onClick: any;
  usersInChatSection: UserChat;
}

export default function ChatListItem({
  name,
  avatar,
  onClick,
  id,
  usersInChatSection,
}: ChatListItemProps) {
  const currentUser = useCurrentUser();
  return (
    <button
      className={cn(
        "flex  items-start gap-3 p-3 text-left hover:bg-gray-100 " 
      )}
      onClick={() => onClick(id)}
    >
      <ChatAvatar src={avatar} name={name} />
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-400 truncate w-52">
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
      </div>
    </button>
  );
}

const renderLastMessage = (lastMessage: string, messageType: string) => {
  switch (messageType) {
    case "Image":
      return 'Đã gửi 1 hình ảnh';
    case "Link":
      return "Đã gửi 1 đường dẫn";
    case "Json":
      return "Đã gửi 1 bản vẽ";
    case "Text":
      return lastMessage;
    default:
      return lastMessage; // Fallback for any other message types
  }
};
