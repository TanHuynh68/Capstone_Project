"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteMessageModalProps {
  isOpen: boolean
  messageId: string
  onClose: () => void
  onConfirm: (messageId: string) => Promise<void>
}

export default function DeleteMessageModal({ isOpen, messageId, onClose, onConfirm }: DeleteMessageModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onConfirm(messageId)
      onClose()
    } catch (error) {
      console.error("Error deleting message:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Xóa tin nhắn
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa tin nhắn"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
