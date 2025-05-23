"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"

interface ImageGalleryProps {
  images: ProjectImage[]
  title: string
  className?: string
}

export default function ImageGallery({ images, title, className = "" }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openModal = (index: number) => {
    setSelectedImage(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Không có hình ảnh</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.projectImageID}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 aspect-square"
            onClick={() => openModal(index)}
          >
            <img
              src={image.imageUrl || "/placeholder.svg"}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal hiển thị ảnh lớn */}
      <Dialog open={selectedImage !== null} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl w-full p-0">
          {selectedImage !== null && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={closeModal}
              >
                <X className="h-4 w-4" />
              </Button>

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              <img
                src={images[selectedImage].imageUrl || "/placeholder.svg"}
                alt={`${title} ${selectedImage + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
