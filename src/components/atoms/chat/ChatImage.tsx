"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatImageProps {
  src: string;
  alt?: string;
  isCurrentUser?: boolean;
  className?: string;
}

export default function ChatImage({
  src,
  alt = "Hình ảnh",
  className = "",
}: ChatImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = alt || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  if (imageError) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded bg-gray-100",
          className
        )}
      >
        <div className="w-4 h-4 bg-gray-400 rounded" />
        <span className="text-sm text-gray-600">Không thể tải hình ảnh</span>
      </div>
    );
  }

  return (
    <>
      <div className={cn("relative group cursor-pointer", className)}>
        <div className="relative overflow-hidden rounded-lg max-w-xs">
          {!imageLoaded && (
            <div className="w-48 h-32 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className={cn(
              "max-w-xs max-h-48 object-cover rounded-lg transition-all duration-200",
              imageLoaded ? "opacity-100" : "opacity-0 absolute"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            onClick={handleImageClick}
          />

          {imageLoaded && (
            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-lg">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          )}
        </div>
      </div>

      {/* Modal xem ảnh phóng to */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <div className="relative">
            {/* Header với các nút action */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Hình ảnh */}
            <img
              src={src || "/placeholder.svg"}
              alt={alt}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
