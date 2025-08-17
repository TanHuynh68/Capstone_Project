"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  User,
  Phone,
  MapPin,
  DollarSign,
  Ruler,
  Weight,
  StickyNote,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { useState } from "react";
import ImageGalleryModal from "../../customer/order-detail/ImageGalleryModal";

interface DeliveryImage {
  deliveryImageID: string;
  imageUrl: string;
  uploadType: string;
}

interface ShippingTargetDetail {
  deliveryID: string;
  orderID: string;
  senderID: string;
  senderName: string;
  receiverID: string;
  receiverName: string;
  orderCode: string;
  senderAddress: string;
  senderPhoneNumber: string;
  receiverAddress: string;
  receiverPhoneNumber: string;
  deliveryPrice: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  note: string;
  deliveryStatus: string;
  createdAt: string;
  deliveredAt?: string;
  isConfirm: boolean;
  images: DeliveryImage[];
}

interface ShippingReportDetailProps {
  targetDetail: ShippingTargetDetail;
}

const mapDeliveryStatus = (status: string) => {
  switch (status) {
    case "Pending":
      return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" };
    case "InTransit":
      return { label: "Đang vận chuyển", color: "bg-blue-100 text-blue-800" };
    case "Delivered":
      return { label: "Đã giao", color: "bg-green-100 text-green-800" };
    case "Failed":
      return { label: "Giao thất bại", color: "bg-red-100 text-red-800" };
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

export default function ShippingReportDetail({
  targetDetail,
}: ShippingReportDetailProps) {
  const [isDeliveryImageModalOpen, setIsDeliveryImageModalOpen] =
    useState(false);
  const [selectedDeliveryImageIndex, setSelectedDeliveryImageIndex] =
    useState(0);

  const handleDeliveryImageClick = (index: number) => {
    setSelectedDeliveryImageIndex(index);
    setIsDeliveryImageModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            Chi tiết đơn giao hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Mã đơn hàng
              </Label>
              <p className="text-sm bg-blue-50 p-2 rounded mt-1 flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <span className="font-mono font-semibold">
                  {targetDetail.orderCode}
                </span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Trạng thái giao hàng
              </Label>
              <div className="mt-1">
                <Badge
                  className={
                    mapDeliveryStatus(targetDetail.deliveryStatus).color
                  }
                >
                  {mapDeliveryStatus(targetDetail.deliveryStatus).label}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Phí giao hàng
              </Label>
              <p className="text-sm bg-green-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-700">
                  {formatCurrency(targetDetail.deliveryPrice)}
                </span>
              </p>
            </div>
          </div>

          {/* Sender & Receiver Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin người gửi
              </h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Tên người gửi
                  </Label>
                  <p className="text-sm bg-blue-50 p-2 rounded">
                    {targetDetail.senderName}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Số điện thoại
                  </Label>
                  <p className="text-sm bg-blue-50 p-2 rounded flex items-center gap-2">
                    <Phone className="h-3 w-3 text-blue-500" />
                    {targetDetail.senderPhoneNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Địa chỉ
                  </Label>
                  <p className="text-sm bg-blue-50 p-2 rounded flex items-start gap-2">
                    <MapPin className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{targetDetail.senderAddress}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin người nhận
              </h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Tên người nhận
                  </Label>
                  <p className="text-sm bg-purple-50 p-2 rounded">
                    {targetDetail.receiverName}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Số điện thoại
                  </Label>
                  <p className="text-sm bg-purple-50 p-2 rounded flex items-center gap-2">
                    <Phone className="h-3 w-3 text-purple-500" />
                    {targetDetail.receiverPhoneNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Địa chỉ
                  </Label>
                  <p className="text-sm bg-purple-50 p-2 rounded flex items-start gap-2">
                    <MapPin className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{targetDetail.receiverAddress}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div>
            <h4 className="font-semibold text-orange-700 flex items-center gap-2 mb-3">
              <Package className="h-4 w-4" />
              Thông tin kiện hàng
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Chiều dài
                </Label>
                <p className="text-sm bg-orange-50 p-2 rounded flex items-center gap-2">
                  <Ruler className="h-3 w-3 text-orange-500" />
                  {targetDetail.length} cm
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Chiều rộng
                </Label>
                <p className="text-sm bg-orange-50 p-2 rounded flex items-center gap-2">
                  <Ruler className="h-3 w-3 text-orange-500" />
                  {targetDetail.width} cm
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Chiều cao
                </Label>
                <p className="text-sm bg-orange-50 p-2 rounded flex items-center gap-2">
                  <Ruler className="h-3 w-3 text-orange-500" />
                  {targetDetail.height} cm
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Cân nặng
                </Label>
                <p className="text-sm bg-orange-50 p-2 rounded flex items-center gap-2">
                  <Weight className="h-3 w-3 text-orange-500" />
                  {targetDetail.weight} gram
                </p>
              </div>
            </div>
            {targetDetail.note && (
              <div className="mt-4">
                <Label className="text-xs font-medium text-gray-600">
                  Ghi chú
                </Label>
                <p className="text-sm bg-orange-50 p-2 rounded flex items-start gap-2">
                  <StickyNote className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{targetDetail.note}</span>
                </p>
              </div>
            )}
          </div>

          {/* Delivery Timeline */}
          <div>
            <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4" />
              Thời gian giao hàng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Ngày tạo
                </Label>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {formatFullDateWithDistance2(targetDetail.createdAt)}
                </p>
              </div>
              {targetDetail.deliveredAt && (
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Ngày giao
                  </Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    {formatFullDateWithDistance2(targetDetail.deliveredAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Images */}
          {targetDetail.images && targetDetail.images.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4" />
                Hình ảnh giao hàng ({targetDetail.images.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {targetDetail.images.map((image, index) => (
                  <div
                    key={image.deliveryImageID}
                    className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => handleDeliveryImageClick(index)}
                  >
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={`Delivery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          image.uploadType === "Sender"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {image.uploadType === "Sender"
                          ? "Người gửi"
                          : "Người nhận"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Images Gallery Modal */}
      {targetDetail.images && targetDetail.images.length > 0 && (
        <ImageGalleryModal
          isOpen={isDeliveryImageModalOpen}
          onClose={() => setIsDeliveryImageModalOpen(false)}
          images={targetDetail.images.map((img) => ({
            url: img.imageUrl || "/placeholder.svg",
            alt: `Delivery image`,
            description: `Ảnh từ ${
              img.uploadType === "Sender" ? "người gửi" : "người nhận"
            }`,
          }))}
          initialIndex={selectedDeliveryImageIndex}
        />
      )}
    </>
  );
}
