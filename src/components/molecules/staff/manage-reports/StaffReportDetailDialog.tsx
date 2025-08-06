"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ImageIcon,
} from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { useState } from "react";
import ImageGalleryModal from "../../customer/order-detail/ImageGalleryModal";
import { getCustomerReportStatusBadge } from "@/components/atoms/customer-reports/CustomerReportBadges";
import { Textarea } from "@/components/ui/textarea";

interface StaffReportDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportDetail: ReportDetail | null;
  loading: boolean;
}

export default function StaffReportDetailDialog({
  isOpen,
  onClose,
  reportDetail,
  loading,
}: StaffReportDetailDialogProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!reportDetail && !loading) return null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  console.log("reportDetail: ", reportDetail);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Chi tiết báo cáo vi phạm
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : reportDetail ? (
            <div className="space-y-6 py-2">
              {/* Basic Information */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r bg-pr rounded-t-lg h-full">
                  <CardTitle className="text-lg flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full"></div>
                    <div className="flex justify-between w-full">
                      <div>Thông tin cơ bản</div>
                      {getCustomerReportStatusBadge(reportDetail.reportStatus)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold ">Ngày tạo</Label>
                      <p className="text-sm  p-2 rounded mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 " />
                        {formatFullDateWithDistance2(reportDetail?.createdAt)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold ">
                        Người báo cáo
                      </Label>
                      <p className="text-sm  p-2 rounded mt-1">
                        {reportDetail.reporter}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Label className="text-sm font-semibold ">Tiêu đề</Label>
                      <p className="text-sm  p-2 rounded mt-1">
                        {reportDetail.title}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold ">
                      Nội dung báo cáo
                    </Label>
                    <Textarea className="text-sm  p-2 rounded mt-1">
                      {reportDetail.content}
                    </Textarea>
                  </div>
                </CardContent>
              </Card>

              {/* Report Images */}
              {reportDetail.reportImages &&
                reportDetail.reportImages.length > 0 && (
                  <Card className="shadow-sm border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-orange-600" />
                        Hình ảnh đính kèm ({reportDetail.reportImages.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* First row - 3 images */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {reportDetail.reportImages
                          .slice(0, 3)
                          .map((image, index) => (
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
                              <div className=" inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                              {image.imageNote &&
                                image.imageNote !== "string" && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                    {image.imageNote}
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>

                      {/* Second row - 3 images (4-6) */}
                      {reportDetail.reportImages.length > 3 && (
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          {reportDetail.reportImages
                            .slice(3, 6)
                            .map((image, index) => (
                              <div
                                key={image.reportImageID}
                                className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                onClick={() => handleImageClick(index + 3)}
                              >
                                <img
                                  src={image.imageURL || "/placeholder.svg"}
                                  alt={`Report image ${index + 4}`}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder.svg";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                                {image.imageNote &&
                                  image.imageNote !== "string" && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                      {image.imageNote}
                                    </div>
                                  )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Third row - 3 images (7-9) */}
                      {reportDetail.reportImages.length > 6 && (
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          {reportDetail.reportImages
                            .slice(6, 9)
                            .map((image, index) => (
                              <div
                                key={image.reportImageID}
                                className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                onClick={() => handleImageClick(index + 6)}
                              >
                                <img
                                  src={image.imageURL || "/placeholder.svg"}
                                  alt={`Report image ${index + 7}`}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder.svg";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                                {image.imageNote &&
                                  image.imageNote !== "string" && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                      {image.imageNote}
                                    </div>
                                  )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Fourth row - 1 image (10) */}
                      {reportDetail.reportImages.length > 9 && (
                        <div className="grid grid-cols-3 gap-2">
                          <div
                            className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                            onClick={() => handleImageClick(9)}
                          >
                            <img
                              src={
                                reportDetail.reportImages[9].imageURL ||
                                "/placeholder.svg"
                              }
                              alt="Report image 10"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                            {reportDetail.reportImages[9].imageNote &&
                              reportDetail.reportImages[9].imageNote !==
                                "string" && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                  {reportDetail.reportImages[9].imageNote}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

              {/* Resolution Information */}
              {(reportDetail.resolver ||
                reportDetail.processNote ||
                reportDetail.resolvedAt) && (
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {reportDetail.reportStatus === "Approved" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : reportDetail.reportStatus === "Rejected" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-600" />
                      )}
                      Thông tin xử lý
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportDetail.resolver && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">
                            Người xử lý
                          </Label>
                          <p className="text-sm bg-gray-100 p-2 rounded mt-1">
                            {reportDetail.resolver}
                          </p>
                        </div>
                      )}
                      {reportDetail.resolvedAt && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">
                            Ngày xử lý
                          </Label>
                          <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {formatFullDateWithDistance2(
                              reportDetail.resolvedAt
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    {reportDetail.processNote && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">
                          Ghi chú xử lý
                        </Label>
                        <Textarea className="text-sm leading-relaxed whitespace-pre-wrap">
                          {reportDetail.processNote}
                        </Textarea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Image Gallery Modal */}
      {reportDetail?.reportImages && reportDetail.reportImages.length > 0 && (
        <ImageGalleryModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          images={reportDetail.reportImages.map((img) => ({
            url: img.imageURL || "/placeholder.svg",
            alt: `Report image`,
            description: img.imageNote !== "string" ? img.imageNote : undefined,
          }))}
          initialIndex={selectedImageIndex}
        />
      )}
    </>
  );
}
