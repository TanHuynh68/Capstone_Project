
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
    <div className="p-1">
      <button
      className={cn(
        "flex items-start gap-3 p-3 text-left hover:bg-primary  hover:text-white transition-colors w-full rounded-lg",
        isActive && "",
      )}
      onClick={() => onClick(id)}
    >
      <ChatAvatar src={avatar} name={name} />
      <div className="flex-1 min-w-0 w-full">
        <div className={cn("font-medium truncate", isActive && "")}>{name}</div>
        <div className="text-sm truncate w-full">
          {currentUser?.id === usersInChatSection.senderID
            ? `Bạn: ${renderLastMessage(usersInChatSection.lastMessage, usersInChatSection.messageType)}`
            : renderLastMessage(usersInChatSection.lastMessage, usersInChatSection.messageType)}
        </div>
      </div>
    </button>
    </div>
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
