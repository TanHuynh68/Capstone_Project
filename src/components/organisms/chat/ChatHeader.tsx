import { Phone, Video, Info } from "lucide-react"
import ChatButton from "@/components/atoms/chat/ChatButton"
import UserHeader from "@/components/molecules/chat/UserHeader"
import { useCurrentUser } from "@/components/utils"

interface ChatHeaderProps {
  user?: UserChat[]
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  if (!user) return null
   const userMain = useCurrentUser();
    console.log('userMain: ', userMain)
  return (
    <div className="flex items-center justify-between border-b border-gray-800 p-3.5">
      <UserHeader name={userMain.id != user[0].account1ID ? user[0].account1Name : user[0].account2Name} avatar={user[0].avatar || ''} />
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
