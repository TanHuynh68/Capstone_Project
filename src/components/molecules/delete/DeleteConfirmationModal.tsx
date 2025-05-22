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
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type DeleteStatus = "idle" | "loading" | "success" | "error"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title?: string
  description?: string
  itemName?: string
  itemType?: string
  status?: DeleteStatus
  errorMessage?: string
  className?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  description = "Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.",
  itemName,
  itemType = "mục",
  status = "idle",
  errorMessage = "Đã xảy ra lỗi khi xóa. Vui lòng thử lại sau.",
  className,
}: DeleteConfirmationModalProps) {
  const [internalStatus, setInternalStatus] = useState<DeleteStatus>(status)

  // Reset status when modal opens/closes
  if (!isOpen && internalStatus !== "idle") {
    setInternalStatus("idle")
  }

  // Update internal status when prop changes
  if (isOpen && status !== internalStatus) {
    setInternalStatus(status)
  }

  const handleConfirm = async () => {
    try {
      setInternalStatus("loading")
      await onConfirm()
      setInternalStatus("success")

      // Auto close after success (optional)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Delete error:", error)
      setInternalStatus("error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        <DialogHeader>
          {internalStatus === "idle" && (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          )}
          {internalStatus === "loading" && (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          )}
          {internalStatus === "success" && (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          )}
          {internalStatus === "error" && (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          )}

          <DialogTitle className="text-center text-lg">
            {internalStatus === "idle" && title}
            {internalStatus === "loading" && "Đang xóa..."}
            {internalStatus === "success" && "Xóa thành công!"}
            {internalStatus === "error" && "Xóa thất bại"}
          </DialogTitle>

          <DialogDescription className="text-center">
            {internalStatus === "idle" && (
              <>
                {description}
                {itemName && (
                  <div className="mt-2 font-medium text-gray-900">
                    {itemType}: <span className="text-red-500">{itemName}</span>
                  </div>
                )}
              </>
            )}
            {internalStatus === "loading" && `Đang xóa ${itemType.toLowerCase()}...`}
            {internalStatus === "success" && `${itemType} đã được xóa thành công.`}
            {internalStatus === "error" && errorMessage}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex sm:justify-center">
          {internalStatus === "idle" && (
            <>
              <Button variant="outline" onClick={onClose} className="sm:w-24">
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleConfirm} className="sm:w-24">
                Xóa
              </Button>
            </>
          )}
          {internalStatus === "loading" && (
            <Button disabled className="sm:w-24">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xóa
            </Button>
          )}
          {internalStatus === "success" && (
            <Button variant="outline" onClick={onClose} className="sm:w-24">
              Đóng
            </Button>
          )}
          {internalStatus === "error" && (
            <>
              <Button variant="outline" onClick={onClose} className="sm:w-24">
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleConfirm} className="sm:w-24">
                Thử lại
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
