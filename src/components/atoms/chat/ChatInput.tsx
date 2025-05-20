import { Input } from "@/components/ui/input"
import { InputProps } from "../login/Input"

interface ChatInputProps extends InputProps {
  placeholder?: string
}

export default function ChatInput({ placeholder = "Nhập tin nhắn...", ...props }: ChatInputProps) {
  return (
    <Input
      className="flex-1 rounded-full bg-gray-800 border-0 focus-visible:ring-1 focus-visible:ring-gray-700"
      placeholder={placeholder}
      {...props}
    />
  )
}
