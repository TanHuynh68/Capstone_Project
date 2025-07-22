"use client"

import { Textarea } from "@/components/ui/textarea"
import { Plus, ThumbsUp, ImageIcon, FileText } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type React from "react"

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
  onSendClick?: () => void
  onFileUploadClick?: () => void
  onCanvasClick?: () => void
  canSend?: boolean
}

export default function ChatInput({
  placeholder = "Nhập tin nhắn...",
  onSendClick,
  onFileUploadClick,
  onCanvasClick,
  canSend = false,
  ...props
}: ChatInputProps) {
  return (
    <div className="relative flex items-center">
      {/* Plus Icon - Left Side */}
      <div className="absolute left-3 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <Plus className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Tùy chọn</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="w-44 p-2 bg-popover text-popover-foreground rounded-xl shadow-md border border-border space-y-1"
          >
            <button
              type="button"
              onClick={onFileUploadClick}
              className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-muted transition-all text-sm font-medium"
            >
              <span>Gửi ảnh</span>
              <ImageIcon className="h-4 w-4 text-primary" />
            </button>
            <button
              type="button"
              onClick={onCanvasClick}
              className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-muted transition-all text-sm font-medium"
            >
              <span>Gửi thiết kế</span>
              <FileText className="h-4 w-4 text-primary" />
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Textarea */}
      <Textarea
        className="rounded-2xl border border-gray-300 bg-white min-h-[50px] max-h-[120px] w-full overflow-y-auto resize-none pl-12 pr-12 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder={placeholder}
        {...props}
      />

      {/* Send Button - Right Side */}
      <div className="absolute right-3 z-10">
        <button
          type="button"
          onClick={onSendClick}
          disabled={!canSend}
          className={`p-2 rounded-full transition-all ${
            canSend ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="sr-only">Gửi</span>
        </button>
      </div>
    </div>
  )
}
