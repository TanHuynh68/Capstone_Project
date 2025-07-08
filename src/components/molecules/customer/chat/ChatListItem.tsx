
import { cn } from "@/lib/utils"
import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar"
import { useCurrentUser } from "@/utils"

interface ChatListItemProps {
  id: string
  name: string
  avatar: string
  onClick: any
  usersInChatSection: UserChat
  isActive?: boolean
}

export default function ChatListItem({
  name,
  avatar,
  onClick,
  id,
  usersInChatSection,
  isActive = false,
}: ChatListItemProps) {
  const currentUser = useCurrentUser()

  return (
    <button
      className={cn(
        "flex items-start gap-3 p-3 text-left hover:bg-gray-100 w-full transition-colors",
        isActive && "bg-blue-50 border-r-2 border-blue-500",
      )}
      onClick={() => onClick(id)}
    >
      <ChatAvatar src={avatar} name={name} />
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium truncate", isActive && "text-blue-600")}>{name}</div>
        <div className="text-sm text-gray-400 truncate">
          {currentUser?.id === usersInChatSection.senderID
            ? `Bạn: ${renderLastMessage(usersInChatSection.lastMessage, usersInChatSection.messageType)}`
            : renderLastMessage(usersInChatSection.lastMessage, usersInChatSection.messageType)}
        </div>
      </div>
      {/* Unread indicator - you can add this if you have unread count */}
      {/* {unreadCount > 0 && (
        <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
          {unreadCount}
        </div>
      )} */}
    </button>
  )
}

const renderLastMessage = (lastMessage: string, messageType: string) => {
  switch (messageType) {
    case "Image":
      return "Đã gửi 1 hình ảnh"
    case "Link":
      return "Đã gửi 1 đường dẫn"
    case "Json":
      return "Đã gửi 1 bản vẽ"
    case "Text":
      return lastMessage
    default:
      return lastMessage
  }
}
