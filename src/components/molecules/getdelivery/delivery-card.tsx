"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeliveryDetailModal } from "./delivery-detail-modal";
import { HighlightText } from "@/components/utils/highlight-text";
import type { DeliveryItem } from "@/components/organisms/delivery/delivery-by-token";
import { formatVietnamDateHours } from "@/components/utils/date";

interface DeliveryCardProps {
  delivery: DeliveryItem;
  onViewDetails?: (delivery: DeliveryItem) => void;
  searchTerm?: string;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  onViewDetails,
  searchTerm = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Picked":
        return {
          text: "Đã lấy",
          className: "bg-blue-500 text-white",
        };
      case "Delivering":
        return {
          text: "Đang giao",
          className: "bg-orange-500 text-white",
        };
      case "Delivered":
        return {
          text: "Hoàn thành",
          className: "bg-green-500 text-white",
        };
      case "Cancelled":
        return {
          text: "Đã hủy",
          className: "bg-gray-500 text-white",
        };
      default:
        return {
          text: status,
          className: "bg-gray-400 text-white",
        };
    }
  };

  const statusBadge = getStatusBadge(delivery.deliveryStatus);

  // // Shorten delivery ID for display
  // const shortId =
  //   delivery.deliveryID.length > 12
  //     ? `${delivery.deliveryID.substring(
  //         0,
  //         8
  //       )}...${delivery.deliveryID.substring(delivery.deliveryID.length - 4)}`
  //     : delivery.deliveryID;

  const handleViewDetails = () => {
    setIsModalOpen(true);
    onViewDetails?.(delivery);
  };

  return (
    <>
      <Card
        className="hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
        onClick={handleViewDetails}
      >
        <CardContent className="px-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Mã đơn hàng: {delivery.orderCode}
              </h3>
            </div>
            <Badge className={`text-xs ${statusBadge.className}`}>
              {statusBadge.text}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 flex-col ">
            {/* <span>ID: {shortId}</span> */}
            <span>Ngày tạo: {formatVietnamDateHours(delivery.createdAt)}</span>

            {delivery.deliveredAt && (
              <span>
                Ngày giao: {formatVietnamDateHours(delivery.deliveredAt)}
              </span>
            )}
          </div>

          {/* Delivery Info */}
          <div className="space-y-3">
            {/* Sender to Receiver */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Người gửi</div>
                <div className="font-medium text-gray-800">
                  <HighlightText
                    text={delivery.senderName}
                    searchTerm={searchTerm}
                    className="font-medium text-gray-800"
                  />
                </div>
              </div>

              <div className="text-blue-500 text-xl">→</div>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Người nhận</div>
                <div className="font-medium text-gray-800">
                  <HighlightText
                    text={delivery.receiverName}
                    searchTerm={searchTerm}
                    className="font-medium text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Price and Date */}
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-500">Phí: </span>
                <span className="font-semibold text-green-600">
                  <HighlightText
                    text={new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(delivery.deliveryPrice)}
                    searchTerm={searchTerm}
                    className="font-semibold text-green-600"
                  />
                </span>
              </div>

              {/* {delivery.deliveredAt && (
                <div className="text-sm text-gray-600">
                  Ngày giao: {formatVietnamDateHours(delivery.deliveredAt)}
                </div>
              )} */}
            </div>
          </div>

          {/* Note */}
          {delivery.note && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-1">
              <div className="text-sm text-gray-700">Ghi chú: </div>
              <p className="text-sm text-gray-700">
                <HighlightText
                  text={delivery.note}
                  searchTerm={searchTerm}
                  className="text-sm text-gray-700"
                />
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Detail Modal */}
      <DeliveryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderCode={delivery.orderCode}
      />
    </>
  );
};
