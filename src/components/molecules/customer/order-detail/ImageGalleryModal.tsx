"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: Array<{
    url: string
    alt: string
    description?: string
  }>
  initialIndex?: number
}

export default function ImageGalleryModal({ isOpen, onClose, images, initialIndex = 0 }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const currentImage = images[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
    if (e.key === "Escape") onClose()
  }

  const downloadImage = async () => {
    if (!currentImage?.url || isDownloading) return

    setIsDownloading(true)
    try {
      const response = await fetch(currentImage.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Extract filename from URL or create a default one
      const urlParts = currentImage.url.split("/")
      const filename = urlParts[urlParts.length - 1] || `image-${currentIndex + 1}.jpg`

      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Tải xuống thành công",
        description: `Đã tải xuống ${filename}`,
      })
    } catch (error) {
      console.error("Download failed:", error)
      toast({
        title: "Lỗi tải xuống",
        description: "Không thể tải xuống hình ảnh. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  if (!isOpen || !currentImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center" onKeyDown={handleKeyDown} tabIndex={0}>
          {/* Header with controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={downloadImage}
              disabled={isDownloading}
              className="bg-black/50 hover:bg-black/70 text-white"
              title="Tải xuống hình ảnh"
            >
              {isDownloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="bg-black/50 hover:bg-black/70 text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Main image */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={currentImage.url || "/placeholder.svg"}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
          </div>

          {/* Image info */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <div className="bg-black/70 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">{currentImage.description}</p>
              {images.length > 1 && (
                <p className="text-xs opacity-70 mt-2">
                  {currentIndex + 1} / {images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
