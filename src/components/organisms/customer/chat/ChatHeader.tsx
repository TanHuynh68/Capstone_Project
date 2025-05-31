import { Info } from "lucide-react"
import ChatButton from "@/components/atoms/customer/chat/ChatButton"
import UserHeader from "@/components/molecules/chat/UserHeader"
import { useCurrentUser } from "@/components/utils"

interface ChatHeaderProps {
  user?: UserChat[]
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  if (!user) return null
   const userMain = useCurrentUser();
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-2">
      <UserHeader  name={userMain.id != user[0].account1ID ? user[0].account1Name : user[0].account2Name} avatar={user[0].avatar || ''} />
      <div className="flex gap-1">
        <ChatButton>
          <Info className="h-5 w-5" />
          <span className="sr-only">Thông tin</span>
        </ChatButton>
      </div>
    </div>
  )
}
