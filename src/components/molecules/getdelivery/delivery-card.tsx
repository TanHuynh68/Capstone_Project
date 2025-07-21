"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/atoms/delivery/status-badge";
import { DeliveryDetailModal } from "./delivery-detail-modal";
import { HighlightText } from "@/utils/highlight-text";
import type { DeliveryItem } from "@/components/organisms/delivery/delivery-by-token";
import { formatVietnamDateHours } from "@/utils/date";
import { Flag } from "lucide-react";
import CustomerReportService from "@/services/CustomerReportService";
import { ReportFormData } from "@/schemas/report/reportSchema";
import ReportDialog from "../customer-and-designer/report/ReportDialog";

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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { createReport } = CustomerReportService();

  const handleViewDetails = () => {
    setIsModalOpen(true);
    onViewDetails?.(delivery);
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsReportDialogOpen(true);
  };

  const handleReportSubmit = async (data: ReportFormData) => {
    const response = await createReport({
      ...data,
      targetID: delivery.deliveryID,
      reportType: 4, // Delivery report type (assuming 5 is for deliveries)
    });
    return response;
  };

  return (
    <>
      <Card className="hover:shadow-md hover:bg-primary/5 border hover:border-primary transition-all duration-200 cursor-pointer">
        <CardContent className="px-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <h3
                className="font-semibold text-foreground mb-1"
                onClick={handleViewDetails}
              >
                Mã đơn hàng: {delivery.orderCode}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReportClick}
                className="hover:bg-red-50 hover:text-red-600 h-6 w-6 ml-2"
              >
                <Flag className="h-3 w-3" />
              </Button>
            </div>
            <StatusBadge status={delivery.deliveryStatus} />
          </div>

          <div className="space-y-3" onClick={handleViewDetails}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 flex-col">
              <span>
                Ngày tạo: {formatVietnamDateHours(delivery.createdAt)}
              </span>
              {delivery.deliveredAt && (
                <span>
                  Ngày giao: {formatVietnamDateHours(delivery.deliveredAt)}
                </span>
              )}
            </div>

            {/* Delivery Info */}
            {/* Sender to Receiver */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  Người gửi
                </div>
                <div className="font-medium text-foreground">
                  <HighlightText
                    text={delivery.senderName}
                    searchTerm={searchTerm}
                    className="font-medium text-foreground"
                  />
                </div>
              </div>
              <div
                className="text-primary text-2xl animate-pulse scale-110"
                style={{
                  animation: "moveLeftRight 2s ease-in-out infinite",
                }}
              >
                →
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  Người nhận
                </div>
                <div className="font-medium text-foreground">
                  <HighlightText
                    text={delivery.receiverName}
                    searchTerm={searchTerm}
                    className="font-medium text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Price and Date */}
            <div className="flex justify-center items-center">
              <div className="text-sm">
                <span className="text-muted-foreground">Phí giao hàng: </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  <HighlightText
                    text={new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(delivery.deliveryPrice)}
                    searchTerm={searchTerm}
                    className="font-semibold text-green-600 dark:text-green-400"
                  />
                </span>
              </div>
            </div>

            {/* Note */}
            {delivery.note && (
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-center gap-1">
                <div className="text-sm text-muted-foreground">Ghi chú: </div>
                <p className="text-sm text-muted-foreground">
                  <HighlightText
                    text={delivery.note}
                    searchTerm={searchTerm}
                    className="text-sm text-muted-foreground"
                  />
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Detail Modal */}
      <DeliveryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deliveryID={delivery.deliveryID}
      />

      {/* Report Dialog */}
      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        targetID={delivery.deliveryID}
        defaultReportType={5} // Delivery report type
        onSubmit={handleReportSubmit}
      />
    </>
  );
};
