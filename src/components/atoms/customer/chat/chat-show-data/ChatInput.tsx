import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

export default function ChatInput({
  placeholder = "Nhập tin nhắn...",
  ...props
}: ChatInputProps) {
  return (
    <Textarea
      className="flex-1 rounded-sm border border-gray-800 bg-gray-100 min-h-[40px] max-h-[150px] w-full overflow-hidden resize-none" // Thay đổi overflow-y thành hidden
      placeholder={placeholder}
      {...props}
    />
  );
}
