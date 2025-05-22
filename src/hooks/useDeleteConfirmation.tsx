"use client"

import { useState } from "react"
import type { DeleteStatus } from "@/components/molecules/delete/DeleteConfirmationModal"

export interface UseDeleteConfirmationProps<T> {
  onDelete: (item: T) => Promise<void>
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useDeleteConfirmation<T>({ onDelete, onSuccess, onError }: UseDeleteConfirmationProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)
  const [status, setStatus] = useState<DeleteStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const openDeleteModal = (item: T) => {
    setItemToDelete(item)
    setStatus("idle")
    setErrorMessage("")
    setIsOpen(true)
  }

  const closeDeleteModal = () => {
    setIsOpen(false)
    // Reset state after animation completes
    setTimeout(() => {
      if (status === "success") {
        setItemToDelete(null)
      }
      setStatus("idle")
      setErrorMessage("")
    }, 300)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      setStatus("loading")
      await onDelete(itemToDelete)
      setStatus("success")

      if (onSuccess) {
        onSuccess()
      }

      // Auto close after success (optional)
      setTimeout(() => {
        closeDeleteModal()
      }, 1500)
    } catch (error) {
      console.error("Delete error:", error)
      setStatus("error")

      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Đã xảy ra lỗi khi xóa. Vui lòng thử lại sau.")
      }

      if (onError) {
        onError(error)
      }
    }
  }

  return {
    isOpen,
    itemToDelete,
    status,
    errorMessage,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  }
}
