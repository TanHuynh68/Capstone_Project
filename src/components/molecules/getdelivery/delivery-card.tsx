"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/atoms/delivery/status-badge";
import {
  DeliveryDetailModal,
  DeliveryDetailData,
} from "./delivery-detail-modal";
import { HighlightText } from "@/utils/highlight-text";
import type { DeliveryItem } from "@/components/organisms/delivery/delivery-by-token";
import { formatVietnamDateHours } from "@/utils/date";
import { Flag, Upload } from "lucide-react";
import CustomerReportService from "@/services/CustomerReportService";
import { ReportFormData } from "@/schemas/report/reportSchema";
import ReportDialog from "../customer-and-designer/report/ReportDialog";
import UploadDeliveryImageDialog from "@/components/molecules/getdelivery/UploadDeliveryImageDialog";
import DeliveryService from "@/services/DeliveryService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface DeliveryCardProps {
  delivery: DeliveryItem;
  onViewDetails?: (delivery: DeliveryItem) => void;
  searchTerm?: string;
  // onOpenUploadDialog?: (deliveryDetail: DeliveryDetailData) => void; // Remove this prop
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  onViewDetails,
  searchTerm = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDeliveryDetail, setSelectedDeliveryDetail] =
    useState<DeliveryDetailData | null>(null);
  const { createReport } = CustomerReportService();
  const { uploadDeliveryImage } = DeliveryService();
  const user = useSelector((state: RootState) => state.user);

  const handleViewDetails = () => {
    setIsModalOpen(true);
    onViewDetails?.(delivery);
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const buildDeliveryDetail = (): DeliveryDetailData => ({
    deliveryID: delivery.deliveryID,
    orderID: delivery.orderID,
    senderID: "",
    senderName: delivery.senderName,
    receiverID: "",
    receiverName: delivery.receiverName,
    orderCode: delivery.orderCode,
    senderAddress: "",
    senderPhoneNumber: "",
    receiverAddress: "",
    receiverPhoneNumber: "",
    deliveryPrice: delivery.deliveryPrice,
    length: "",
    width: "",
    height: "",
    weight: "",
    note: delivery.note,
    deliveryStatus: delivery.deliveryStatus,
    createdAt: delivery.createdAt,
    deliveredAt: delivery.deliveredAt,
    images: [],
  });

  const handleOpenUploadDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDeliveryDetail(buildDeliveryDetail());
    setShowUploadDialog(true);
  };

  const handleUploadDeliveryImage = async (
    files: File[],
    descriptions: string[],
    isConfirm: boolean
  ) => {
    if (!selectedDeliveryDetail) return;
    const formData = new FormData();
    formData.append("deliveryID", selectedDeliveryDetail.deliveryID);
    formData.append("isConfirm", String(isConfirm));
    files.forEach((file) => formData.append("files", file));
    descriptions.forEach((desc) => formData.append("fileDescriptions", desc));
    const result = await uploadDeliveryImage(formData);
    return result;
    setShowUploadDialog(false);
    setSelectedDeliveryDetail(null);
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
            </div>
            <StatusBadge status={delivery.deliveryStatus} />
          </div>

          <div className="space-y-3" onClick={handleViewDetails}>
            {/* Ngày tạo & Ngày giao */}
            <div className="flex items-center justify-center gap-8 mb-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  Ngày tạo
                </div>
                <div className="text-sm text-blue-600">
                  {formatVietnamDateHours(delivery.createdAt)}
                </div>
              </div>
              {delivery.deliveredAt && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Ngày giao
                  </div>
                  <div className="text-sm text-purple-600">
                    {formatVietnamDateHours(delivery.deliveredAt)}
                  </div>
                </div>
              )}
            </div>

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
                style={{ animation: "moveLeftRight 2s ease-in-out infinite" }}
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

            {/* Price */}
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
              <div className="mt-3 pt-1  border-border flex items-center justify-center gap-1">
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

            {/* Action Button & Dialog */}
            <div
              className="mt-3 pt-3 border-t border-border"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {delivery.isConfirm ? (
                // Show report button only if isConfirm is true
                <button
                  className="w-full p-2.5 cursor-pointer rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-red-500/20 shadow-md"
                  onClick={handleReportClick}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseUp={(e) => e.preventDefault()}
                  onPointerDown={(e) => e.preventDefault()}
                >
                  <Flag className="h-4 w-4" />
                  <span>Báo cáo vi phạm</span>
                </button>
              ) : delivery.deliveredAt === null ? (
                // Show upload button if delivery date exists and isConfirm is not true
                // delivery.deliveryStatus === "Delivered" &&
                delivery.receiverName === user.name ? (
                  <>
                    <button
                      className="w-full p-2.5 cursor-pointer rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-semibold text-sm transition-all duration-300 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-primary/20 shadow-md"
                      onClick={handleOpenUploadDialog}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseUp={(e) => e.preventDefault()}
                      onPointerDown={(e) => e.preventDefault()}
                    >
                      <Upload className="h-4 w-4" />
                      <span>Tải lên minh chứng</span>
                    </button>
                    <UploadDeliveryImageDialog
                      open={showUploadDialog}
                      onClose={() => {
                        setShowUploadDialog(false);
                        setSelectedDeliveryDetail(null);
                      }}
                      onSubmit={handleUploadDeliveryImage}
                    />
                  </>
                ) : null
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <DeliveryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deliveryID={delivery.deliveryID}
      />

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        targetID={delivery.deliveryID}
        defaultReportType={5}
        onSubmit={handleReportSubmit}
      />
    </>
  );
};
