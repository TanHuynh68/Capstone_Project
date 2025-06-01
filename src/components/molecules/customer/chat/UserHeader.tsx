import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar"

interface UserHeaderProps {
  name: string
  avatar: string;
  color?: string
  status?: string
}

export default function UserHeader({ name, avatar, color, status }: UserHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <ChatAvatar size="sm" src={avatar} name={name} color={color} />
      <div>
        <div className="font-medium">{name}</div>
        {status && <div className="text-xs text-gray-400">{status}</div>}
      </div>
    </div>
  )
}
