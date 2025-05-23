import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface UserInfoProps {
  fullName: string | null
  avatar: string | null
  accountID: string
  className?: string
}

export default function UserInfo({ fullName, avatar, accountID, className = "" }: UserInfoProps) {
  const displayName = fullName || "Người dùng ẩn danh"
  const initials = displayName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={displayName} />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {avatar ? initials : <User className="h-6 w-6" />}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium text-gray-900">{displayName}</h3>
        <p className="text-sm text-gray-500">ID: {accountID.slice(0, 8)}...</p>
      </div>
    </div>
  )
}
