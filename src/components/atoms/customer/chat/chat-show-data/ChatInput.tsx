
import { InputProps } from "../../../auth/login/Input"
import { Input } from "../Input"

interface ChatInputProps extends InputProps {
  placeholder?: string
}

export default function ChatInput({ placeholder = "Nhập tin nhắn...", ...props }: ChatInputProps) {
  return (
    <Input
      className="flex-1 rounded-sm border border-gray-800 bg-gray-100"
      placeholder={placeholder}
      {...props}
    />
  )
}
