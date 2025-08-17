"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import ImageGalleryModal from "@/components/molecules/customer/order-detail/ImageGalleryModal";

interface ReportImages {
  reportImageID: string;
  imageURL: string;
  imageNote?: string;
}

interface ReportImagesProps {
  reportImages: ReportImages[];
}

export default function ReportImages({ reportImages }: ReportImagesProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  if (!reportImages || reportImages.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-gray-600" />
            Hình ảnh báo cáo ({reportImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {reportImages.map((image, index) => (
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
                <div className="inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                {image.imageNote && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-white/90 text-gray-800 truncate"
                    >
                      {image.imageNote}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Images Gallery Modal */}
      <ImageGalleryModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={reportImages.map((img) => ({
          url: img.imageURL || "/placeholder.svg",
          alt: `Report image`,
          description: img.imageNote || "Hình ảnh báo cáo",
        }))}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
