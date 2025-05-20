import { cn } from "@/lib/utils"

interface ChatTimeProps {
  time: string
  isCurrentUser?: boolean
  className?: string
}

export default function ChatTime({ time, isCurrentUser = false, className }: ChatTimeProps) {
  return (
    <div className={cn("mt-1 text-right text-xs", isCurrentUser ? "text-gray-600" : "text-gray-400", className)}>
      {time}
    </div>
  )
}
