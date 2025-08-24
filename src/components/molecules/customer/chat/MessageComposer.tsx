"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import ChatInput from "@/components/atoms/customer/chat/chat-show-data/ChatInput"
import FileUploadModal from "@/components/molecules/customer/chat/FileUploadModal"
import { toast } from "sonner"
import ChatService from "@/services/ChatService"
import CanvasInChatModal from "./CanvasInChatModal"

interface MessageComposerProps {
  onSendMessage: (message: string, messageType?: string) => void
}

export default function MessageComposer({ onSendMessage }: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false)

  const { uploadImageMessage } = ChatService()

  const handleSend = () => {
    if (!message.trim()) return
    onSendMessage(message, "text")
    setMessage("")
  }



  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow line breaks with Shift + Enter
        return
      }
      e.preventDefault() // Prevent default behavior of Enter key
      handleSend() // Send the message
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      if (file) {
        const response = await uploadImageMessage(file)
        if (response && response.imageCloudinaryUrl) {
          onSendMessage(response.imageCloudinaryUrl, "image")
          toast.success("Đã tải lên tệp thành công")
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Không thể tải lên tệp. Vui lòng thử lại.")
      throw error
    }
  }

  return (
    <>


      <form onSubmit={handleSubmit} className="p-4">
        <ChatInput
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onSendClick={handleSend}
          onFileUploadClick={() => setIsFileModalOpen(true)}
          onCanvasClick={() => setIsCanvasModalOpen(true)}
          onSend3DDesign={(canvas3DData, title, id) => {
            const messageData = {
              canvas3DData,
              title,
              id,
              timestamp: new Date().toISOString()
            }
            onSendMessage(JSON.stringify(messageData), "json")
            toast.success(`Đã gửi thiết kế 3D: ${title}`)
          }}
          canSend={message.trim().length > 0}
        />
      </form>

      {/* File Upload Modal */}
      <FileUploadModal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)} onUpload={handleFileUpload} />

      {/* Canvas In Chat Modal */}
      <CanvasInChatModal
        isOpen={isCanvasModalOpen}
        onClose={() => setIsCanvasModalOpen(false)}
        onSelectCanvas={(data) => {
          onSendMessage(JSON.stringify(data), "json")
        }}
      />
    </>
  )
}
