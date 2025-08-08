"use client";

import ImageGalleryModal from "@/components/molecules/customer/order-detail/ImageGalleryModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

interface ReportImage {
  reportImageID: string;
  imageURL: string;
  imageNote?: string;
}

interface ReportImagesProps {
  reportImages: ReportImage[];
}

export default function ReportImages({ reportImages }: ReportImagesProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!reportImages || reportImages.length === 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-orange-600" />
            Hình ảnh báo cáo ({reportImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-2">
            {reportImages.slice(0, 9).map((image, index) => (
              <div
                key={image.reportImageID}
                className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.imageURL || "/placeholder.svg"}
                  alt={`Report image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                {image.imageNote && image.imageNote !== "string" && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                    {image.imageNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ImageGalleryModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={reportImages.map((img) => ({
          url: img.imageURL || "/placeholder.svg",
          alt: `Report image`,
          description: img.imageNote !== "string" ? img.imageNote : undefined,
        }))}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
