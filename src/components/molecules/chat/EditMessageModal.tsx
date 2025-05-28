"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Loader2 } from "lucide-react"

interface EditMessageModalProps {
  isOpen: boolean
  messageId: string
  content: string
  onClose: () => void
  onConfirm: (messageId: string, newContent: string) => Promise<void>
}

export default function EditMessageModal({ isOpen, messageId, content, onClose, onConfirm }: EditMessageModalProps) {
  const [newContent, setNewContent] = useState(content)
  const [isEditing, setIsEditing] = useState(false)

  // Reset content when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewContent(content)
    }
  }, [isOpen, content])

  const handleEdit = async () => {
    if (!newContent.trim()) return

    try {
      setIsEditing(true)
      await onConfirm(messageId, newContent.trim())
      onClose()
    } catch (error) {
      console.error("Error editing message:", error)
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-gray-900 text-gray-100 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-500" />
            Chỉnh sửa tin nhắn
          </DialogTitle>
          <DialogDescription className="text-gray-400">Chỉnh sửa nội dung tin nhắn của bạn.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 ">
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Nhập nội dung tin nhắn mới"
            className="min-h-[100px] w-[460px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            disabled={isEditing}
          />
        </div>

        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            disabled={isEditing}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleEdit}
            disabled={isEditing || !newContent.trim() || newContent === content}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEditing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
