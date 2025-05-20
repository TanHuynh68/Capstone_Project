import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IMG } from "@/constants"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  src?: string
  name: string
  color?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function ChatAvatar({ src, name, color, size = "md", className }: ChatAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Avatar className={cn(sizeClasses[size], "border-2", color, className)}>
      <AvatarImage src={src || IMG.AVATAR_TEMP} alt={name} />
      <AvatarFallback className={color}>{initials}</AvatarFallback>
    </Avatar>
  )
}
