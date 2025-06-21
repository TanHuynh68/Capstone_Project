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
      className="  rounded-sm border border-gray-800 bg-gray-100 min-h-[100px] max-h-[200px] w-full overflow-y-auto resize-none"
      placeholder={placeholder}
      {...props}
    />
  );
}
