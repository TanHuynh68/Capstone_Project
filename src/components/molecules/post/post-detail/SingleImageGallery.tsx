"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn } from "lucide-react";

interface SingleImageGalleryProps {
  imageUrl: string;
  title: string;
  className?: string;
  alt?: string;
}

export default function SingleImageGallery({
  imageUrl,
  title,
  className = "",
  alt = "Image",
}: SingleImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!imageUrl) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Không có hình ảnh</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div
        className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 w-[250px] h-[250px] mx-auto"
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            openModal(e as unknown as React.MouseEvent);
          }
        }}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Modal hiển thị ảnh lớn */}
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent
          className="max-w-4xl w-full p-0"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>

            <img
              src={imageUrl || "/placeholder.svg"}
              alt={alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
