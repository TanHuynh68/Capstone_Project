"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ImageIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { getCustomerReportStatusBadge } from "@/components/atoms/customer-reports/CustomerReportBadges";
import { formatFullDateWithDistance2 } from "@/utils";
import { useState } from "react";
import ImageGalleryModal from "../customer/order-detail/ImageGalleryModal";

interface CustomerReportDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportDetail: ReportDetail | null;
  loading: boolean;
}

const mapBenefitType = (type: number) => {
  switch (type) {
    case 0:
      return "Chung";
    case 1:
      return "Đặt cọc";
    case 2:
      return "Giao hàng";
    case 3:
      return "Phạt";
    case 4:
      return "Bảo hành";
    default:
      return "Không xác định";
  }
};

export default function CustomerReportDetailDialog({
  isOpen,
  onClose,
  reportDetail,
  loading,
}: CustomerReportDetailDialogProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!reportDetail && !loading) return null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const isReportResolved =
    reportDetail?.reportStatus === "Approved" ||
    reportDetail?.reportStatus === "Rejected";
  const hasBenefitData = reportDetail?.benefit;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-[1000px] overflow-hidden">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Chi tiết tố cáo
              </DialogTitle>
              {reportDetail &&
                getCustomerReportStatusBadge(reportDetail.reportStatus)}
            </div>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : reportDetail ? (
            <div className="grid grid-cols-12 gap-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Left Column - Main Content (8/12) */}
              <div
                className={
                  reportDetail.benefit
                    ? `col-span-8 space-y-4`
                    : "col-span-12 space-y-4"
                }
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <Card className="shadow-sm border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg py-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Thông tin cơ bản
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 pb-3">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs font-semibold text-gray-700">
                            Tiêu đề
                          </Label>
                          <p className="text-sm bg-gray-100 p-2 rounded mt-1">
                            {reportDetail.title}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-700">
                            Ngày tạo
                          </Label>
                          <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            {formatFullDateWithDistance2(
                              reportDetail?.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Resolution Information */}
                  {(reportDetail.resolver ||
                    reportDetail.processNote ||
                    reportDetail.resolvedAt) && (
                    <Card className="shadow-sm border-gray-200">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg py-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {reportDetail.reportStatus === "Approved" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : reportDetail.reportStatus === "Rejected" ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-600" />
                          )}
                          Thông tin xử lý
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4 pb-3">
                        {reportDetail.resolver && (
                          <div>
                            <Label className="text-xs font-semibold text-gray-700">
                              Người xử lý
                            </Label>
                            <p className="text-sm bg-gray-100 p-2 rounded mt-1">
                              {reportDetail.resolver}
                            </p>
                          </div>
                        )}
                        {reportDetail.resolvedAt && (
                          <div>
                            <Label className="text-xs font-semibold text-gray-700">
                              Ngày xử lý
                            </Label>
                            <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              {formatFullDateWithDistance2(
                                reportDetail?.resolvedAt
                              )}
                            </p>
                          </div>
                        )}
                        {reportDetail.processNote && (
                          <div>
                            <Label className="text-xs font-semibold text-gray-700">
                              Ghi chú xử lý
                            </Label>
                            <div className="bg-gray-50 p-3 rounded-lg mt-1">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {reportDetail.processNote}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
                {/* Content */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      Nội dung tố cáo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 pb-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {reportDetail.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Report Images */}
                {reportDetail.reportImages &&
                  reportDetail.reportImages.length > 0 && (
                    <Card className="shadow-sm border-gray-200">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg py-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-purple-600" />
                          Hình ảnh đính kèm ({reportDetail.reportImages.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 pb-3">
                        <div className="grid grid-cols-4 gap-2">
                          {reportDetail.reportImages
                            .slice(0, 8)
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
                                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                                {image.imageNote &&
                                  image.imageNote !== "string" && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                      {image.imageNote}
                                    </div>
                                  )}
                              </div>
                            ))}
                          {reportDetail.reportImages.length > 8 && (
                            <div className="aspect-square rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                +{reportDetail.reportImages.length - 8}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>

              {/* Right Column - Resolution & Benefit (4/12) */}
              <div className="col-span-4 space-y-4">
                {/* Benefit Information */}
                {isReportResolved && hasBenefitData && (
                  <Card className="shadow-sm border-gray-200">
                    <CardHeader
                      className={`rounded-t-lg py-3 ${
                        reportDetail.reportStatus === "Approved"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50"
                          : "bg-gradient-to-r from-red-50 to-rose-50"
                      }`}
                    >
                      <CardTitle className="text-base flex items-center gap-2">
                        {reportDetail.reportStatus === "Approved" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={
                            reportDetail.reportStatus === "Approved"
                              ? "text-green-700"
                              : "text-red-700"
                          }
                        >
                          Quyền lợi áp dụng
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 pb-3">
                      {/* Benefit Overview */}
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-sm text-purple-700 mb-2">
                          {reportDetail.benefit?.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {reportDetail.benefit &&
                              mapBenefitType(
                                reportDetail?.benefit?.benefitType
                              )}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            v{reportDetail.benefit?.version}
                          </Badge>
                        </div>
                        {reportDetail.benefit?.description && (
                          <p className="text-xs text-purple-600 bg-white p-2 rounded border">
                            {reportDetail?.benefit?.description}
                          </p>
                        )}
                      </div>

                      {/* Impact Details */}
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-gray-700">
                          Chi tiết tác động
                        </Label>

                        {/* Customer Impact */}
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <Label className="text-xs font-semibold text-blue-700">
                              Khách hàng
                            </Label>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white p-2 rounded border">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Điểm:
                                </span>
                                <div className="flex items-center gap-1">
                                  {reportDetail.benefit &&
                                  reportDetail.benefit.customerScoreChange >
                                    0 ? (
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                  ) : reportDetail.benefit &&
                                    reportDetail.benefit.customerScoreChange <
                                      0 ? (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                  ) : null}
                                  <span
                                    className={`text-xs font-medium ${
                                      reportDetail.benefit &&
                                      reportDetail.benefit.customerScoreChange >
                                        0
                                        ? "text-green-600"
                                        : reportDetail.benefit &&
                                          reportDetail.benefit
                                            .customerScoreChange < 0
                                        ? "text-red-600"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {reportDetail.benefit &&
                                    reportDetail.benefit.customerScoreChange > 0
                                      ? "+"
                                      : ""}
                                    {reportDetail.benefit &&
                                      reportDetail.benefit.customerScoreChange}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Bồi thường:
                                </span>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-blue-500" />
                                  <span className="text-xs font-medium text-blue-600">
                                    {reportDetail.benefit &&
                                      reportDetail.benefit
                                        .customerCompensationRate}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Designer Impact */}
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            <Label className="text-xs font-semibold text-purple-700">
                              Nhà thiết kế
                            </Label>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white p-2 rounded border">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Điểm:
                                </span>
                                <div className="flex items-center gap-1">
                                  {reportDetail.benefit &&
                                  reportDetail.benefit.designerScoreChange >
                                    0 ? (
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                  ) : reportDetail.benefit &&
                                    reportDetail.benefit.designerScoreChange <
                                      0 ? (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                  ) : null}
                                  <span
                                    className={`text-xs font-medium ${
                                      reportDetail.benefit &&
                                      reportDetail.benefit.designerScoreChange >
                                        0
                                        ? "text-green-600"
                                        : reportDetail.benefit &&
                                          reportDetail.benefit
                                            .designerScoreChange < 0
                                        ? "text-red-600"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {reportDetail.benefit &&
                                    reportDetail.benefit.designerScoreChange > 0
                                      ? "+"
                                      : ""}
                                    {reportDetail.benefit?.designerScoreChange}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Bồi thường:
                                </span>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-purple-500" />
                                  <span className="text-xs font-medium text-purple-600">
                                    {
                                      reportDetail.benefit
                                        ?.designerCompensationRate
                                    }
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>
                            ID:{" "}
                            {reportDetail.benefit &&
                              reportDetail.benefit.benefitID}
                          </div>
                          <div>
                            Ngày tạo:{" "}
                            {reportDetail.benefit &&
                              new Date(
                                reportDetail.benefit.createdAt
                              ).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
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
