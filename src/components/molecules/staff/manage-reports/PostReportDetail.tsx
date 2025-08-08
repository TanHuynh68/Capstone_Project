"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Clock,
  ImageIcon,
} from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { useState } from "react";
import ImageGalleryModal from "../../customer/order-detail/ImageGalleryModal";

interface ProjectImage {
  projectImageID: string;
  imageUrl: string;
  imageType: string;
  createdBy: string;
}

interface PostTargetDetail {
  projectPostID: string;
  accountID: string;
  accountName: string;
  title: string;
  description: string;
  postStatus: string;
  itemValue: number;
  suggestedPrice: number;
  createdAt: string;
  endAt: string;
  finishDate: string;
  isActive: boolean;
  originalImages: ProjectImage[];
  requestedImages: ProjectImage[];
}

interface PostReportDetailProps {
  targetDetail: PostTargetDetail;
}

const mapPostStatus = (status: string) => {
  switch (status) {
    case "Pending":
      return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" };
    case "Received":
      return { label: "Đã nhận", color: "bg-blue-100 text-blue-800" };
    case "InProgress":
      return {
        label: "Đang thực hiện",
        color: "bg-purple-100 text-purple-800",
      };
    case "Completed":
      return { label: "Hoàn thành", color: "bg-green-100 text-green-800" };
    case "Cancelled":
      return { label: "Đã hủy", color: "bg-red-100 text-red-800" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800" };
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function PostReportDetail({
  targetDetail,
}: PostReportDetailProps) {
  const [isOriginalImageModalOpen, setIsOriginalImageModalOpen] =
    useState(false);
  const [isRequestedImageModalOpen, setIsRequestedImageModalOpen] =
    useState(false);
  const [selectedOriginalImageIndex, setSelectedOriginalImageIndex] =
    useState(0);
  const [selectedRequestedImageIndex, setSelectedRequestedImageIndex] =
    useState(0);

  const handleOriginalImageClick = (index: number) => {
    setSelectedOriginalImageIndex(index);
    setIsOriginalImageModalOpen(true);
  };

  const handleRequestedImageClick = (index: number) => {
    setSelectedRequestedImageIndex(index);
    setIsRequestedImageModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Chi tiết bài đăng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Post Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Tác giả
              </Label>
              <p className="text-sm bg-purple-50 p-2 rounded mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-purple-500" />
                {targetDetail.accountName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Trạng thái
              </Label>
              <div className="mt-1">
                <Badge className={mapPostStatus(targetDetail.postStatus).color}>
                  {mapPostStatus(targetDetail.postStatus).label}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Tiêu đề bài đăng
            </Label>
            <p className="text-sm bg-gray-100 p-2 rounded mt-1">
              {targetDetail.title}
            </p>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700">Mô tả</Label>
            <p className="text-sm bg-gray-100 p-3 rounded mt-1 min-h-[80px]">
              {targetDetail.description}
            </p>
          </div>

          {/* Price Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Giá trị sản phẩm
              </Label>
              <p className="text-sm bg-green-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-700">
                  {formatCurrency(targetDetail.itemValue)}
                </span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Giá đề xuất
              </Label>
              <p className="text-sm bg-blue-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-700">
                  {formatCurrency(targetDetail.suggestedPrice)}
                </span>
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4" />
              Thời gian
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Ngày tạo
                </Label>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {formatFullDateWithDistance2(targetDetail.createdAt)}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Ngày kết thúc
                </Label>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {formatFullDateWithDistance2(targetDetail.endAt)}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Ngày hoàn thành
                </Label>
                <p className="text-sm bg-gray-50 p-2 rounded flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  {formatFullDateWithDistance2(targetDetail.finishDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Original Images */}
          {targetDetail.originalImages &&
            targetDetail.originalImages.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4" />
                  Hình ảnh gốc ({targetDetail.originalImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {targetDetail.originalImages.map((image, index) => (
                    <div
                      key={image.projectImageID}
                      className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => handleOriginalImageClick(index)}
                    >
                      <img
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={`Original image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-800"
                        >
                          Gốc
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Requested Images */}
          {targetDetail.requestedImages &&
            targetDetail.requestedImages.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4" />
                  Hình ảnh yêu cầu ({targetDetail.requestedImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {targetDetail.requestedImages.map((image, index) => (
                    <div
                      key={image.projectImageID}
                      className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => handleRequestedImageClick(index)}
                    >
                      <img
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={`Requested image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-800"
                        >
                          Yêu cầu
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Original Images Gallery Modal */}
      {targetDetail.originalImages &&
        targetDetail.originalImages.length > 0 && (
          <ImageGalleryModal
            isOpen={isOriginalImageModalOpen}
            onClose={() => setIsOriginalImageModalOpen(false)}
            images={targetDetail.originalImages.map((img) => ({
              url: img.imageUrl || "/placeholder.svg",
              alt: `Original image`,
              description: "Hình ảnh gốc",
            }))}
            initialIndex={selectedOriginalImageIndex}
          />
        )}

      {/* Requested Images Gallery Modal */}
      {targetDetail.requestedImages &&
        targetDetail.requestedImages.length > 0 && (
          <ImageGalleryModal
            isOpen={isRequestedImageModalOpen}
            onClose={() => setIsRequestedImageModalOpen(false)}
            images={targetDetail.requestedImages.map((img) => ({
              url: img.imageUrl || "/placeholder.svg",
              alt: `Requested image`,
              description: "Hình ảnh yêu cầu",
            }))}
            initialIndex={selectedRequestedImageIndex}
          />
        )}
    </>
  );
}
