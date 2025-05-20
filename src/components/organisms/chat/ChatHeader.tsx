import { Phone, Video, Info } from "lucide-react"
import ChatButton from "@/components/atoms/chat/ChatButton"
import UserHeader from "@/components/molecules/chat/UserHeader"

interface ChatHeaderProps {
  user?: UserChat
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  if (!user) return null

  return (
    <div className="flex items-center justify-between border-b border-gray-800 p-4">
      <UserHeader name={user.fullName} avatar={user.avatar || ''} color={user.color} status={user.status} />
      <div className="flex gap-1">
        <ChatButton>
          <Phone className="h-5 w-5" />
          <span className="sr-only">Gọi điện</span>
        </ChatButton>
        <ChatButton>
          <Video className="h-5 w-5" />
          <span className="sr-only">Gọi video</span>
        </ChatButton>
        <ChatButton>
          <Info className="h-5 w-5" />
          <span className="sr-only">Thông tin</span>
        </ChatButton>
      </div>
    </div>
  )
}
