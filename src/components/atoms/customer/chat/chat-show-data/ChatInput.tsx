"use client"

import { Textarea } from "@/components/ui/textarea"
import { Plus, ImageIcon, FileText, Send, Box } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type React from "react"
import Canvas3DList from "@/pages/customer/plushdoll-design/canvas-3d/Canvas3DList"

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
  onSendClick?: () => void
  onFileUploadClick?: () => void
  onCanvasClick?: () => void
  onSend3DDesign?: (canvas3DData: string, title: string, id: string) => void
  canSend?: boolean
}

export default function ChatInput({
  placeholder = "Nhập tin nhắn...",
  onSendClick,
  onFileUploadClick,
  onCanvasClick,
  onSend3DDesign,
  canSend = false,
  ...props
}: ChatInputProps) {
  const [show3DDesignModal, setShow3DDesignModal] = useState(false)
  const [selected3DDesign, setSelected3DDesign] = useState<{
    canvas3D: string
    title: string
    id: string
  } | null>(null)

  const handleSend3DDesign = () => {
    if (selected3DDesign && onSend3DDesign) {
      onSend3DDesign(selected3DDesign.canvas3D, selected3DDesign.title, selected3DDesign.id)
      setSelected3DDesign(null)
      setShow3DDesignModal(false)
    }
  }

  const handle3DDesignSelect = (canvas3D: string, title: string, id: string) => {
    setSelected3DDesign({ canvas3D, title, id })
  }

  return (
    <div className="relative flex items-end">
      {/* Plus Icon - Left Side */}
      <div className="absolute left-3 bottom-3 z-10">
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
            <button
              type="button"
              onClick={() => setShow3DDesignModal(true)}
              className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-muted transition-all text-sm font-medium"
            >
              <span>Gửi thiết kế 3D</span>
              <Box className="h-4 w-4 text-primary" />
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Textarea */}
      <Textarea
        className="rounded-2xl border border-gray-300 bg-white min-h-[50px] max-h-[200px] w-full overflow-y-auto resize-none pl-12 pr-12 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 break-all"
        placeholder={placeholder}
        {...props}
      />

      {/* Send Button - Right Side */}
      <div className="absolute right-3 bottom-3 z-10">
        <button
          type="button"
          onClick={onSendClick}
          disabled={!canSend}
          className={`p-2 rounded-full transition-all ${
            canSend ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Gửi</span>
        </button>
      </div>

      {/* 3D Design Selection Modal */}
      <Dialog open={show3DDesignModal} onOpenChange={setShow3DDesignModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Box className="h-5 w-5 text-blue-600" />
              Chọn thiết kế 3D để gửi vào chat
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto min-h-0 p-1">
            <Canvas3DList
              onSelect={handle3DDesignSelect}
            />
          </div>

          {/* Selection info - Fixed at bottom */}
          {selected3DDesign && (
            <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg border border-blue-200 mt-3">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Đã chọn: {selected3DDesign.title}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons - Fixed at bottom */}
          <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t mt-3">
            <Button
              variant="outline"
              onClick={() => setShow3DDesignModal(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSend3DDesign}
              disabled={!selected3DDesign}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Gửi thiết kế 3D
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
