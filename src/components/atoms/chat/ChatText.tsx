import { cn } from "@/lib/utils"

interface ChatTextProps {
  content: string
  isCurrentUser?: boolean
  className?: string
}

export default function ChatText({ content, className = "" }: ChatTextProps) {
  return <div className={cn("whitespace-pre-wrap break-words", className)}>{content}</div>
}
