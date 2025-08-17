"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Offer } from "@/types/orderManagement";
import { formatCurrencyVND } from "@/utils";
import { DollarSign, Calendar, Image } from "lucide-react";
import SingleImageGallery from "@/components/atoms/custom/image/SingleImageGallery";

interface OfferInfoCardProps {
  offer: Offer;
}

export default function OfferInfoCard({ offer }: OfferInfoCardProps) {
  console.log("Offer: ", offer);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOfferStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" };
      case "Accepted":
        return { label: "Đã chấp nhận", color: "bg-green-100 text-green-800" };
      case "Rejected":
        return { label: "Đã từ chối", color: "bg-red-100 text-red-800" };
      case "InProgress":
        return { label: "Đang thực hiện", color: "bg-blue-100 text-blue-800" };
      case "Completed":
        return { label: "Hoàn thành", color: "bg-green-100 text-green-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusConfig = getOfferStatusConfig(offer.offerStatus);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg font-semibold">
            Thông tin đề xuất
          </CardTitle>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Giá trị đơn hàng:</span>
          <span className="text-sm font-semibold text-green-600">
            {formatCurrencyVND(offer.finalPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Tiền cọc:</span>
          <span className="text-sm font-medium text-blue-600">
            {formatCurrencyVND(offer.designerDepositPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Ngày tạo:</span>
          <span className="text-sm">{formatDate(offer.createdAt)}</span>
        </div>

        {offer.sampleImage && (
          <SingleImageGallery
            imageUrl={offer.sampleImage}
            title={<div className="flex items-center gap-2">
               <Image className="h-4 w-4 text-gray-500" />
              <div className="text-sm text-gray-600">Hình ảnh mẫu:</div>
            </div>}
          />
        )}
      </CardContent>
    </Card>
  );
}
