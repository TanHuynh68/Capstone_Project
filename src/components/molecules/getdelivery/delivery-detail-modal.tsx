"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/atoms/delivery/status-badge";
import {
  Loader2,
  Phone,
  Package,
  Calendar,
  // DollarSign,
  FileText,
  User,
} from "lucide-react";
import DeliveryService from "@/services/DeliveryService";
import { formatVietnamDateHours } from "@/utils/date";
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery";

interface DeliveryImage {
  deliveryImageID: string;
  imageUrl: string;
  uploadType: string;
}

interface DeliveryDetailData {
  deliveryID: string;
  orderID: string;
  senderID: string;
  senderName: string;
  receiverID: string;
  receiverName: string | null;
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
  deliveredAt: string | null;
  images: DeliveryImage[];
}

interface DeliveryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryID: string;
  // onOpenUploadDialog?: (deliveryDetail: DeliveryDetailData) => void; // Removed, not used
}

export type { DeliveryDetailData };

export const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({
  isOpen,
  onClose,
  deliveryID,
  // onOpenUploadDialog, // Removed, not used
}) => {
  const [deliveryDetail, setDeliveryDetail] =
    useState<DeliveryDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const { getDeliveryDetail } = DeliveryService();
  // const user = useCurrentUser(); // Removed, not used

  const fetchDeliveryDetail = async () => {
    if (!deliveryID) return;

    setLoading(true);
    try {
      const response = await getDeliveryDetail({ deliveryID });
      if (response?.isSuccess) {
        setDeliveryDetail(response.responseRequestModel);
      }
    } catch (error) {
      console.error("Error fetching delivery detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && deliveryID) {
      fetchDeliveryDetail();
    }
  }, [isOpen, deliveryID]);

  // Transform DeliveryImage to ProjectImage format for ImageGallery
  const transformImages = (deliveryImages: DeliveryImage[]) => {
    return deliveryImages.map((image) => ({
      projectImageID: image.deliveryImageID,
      imageUrl: image.imageUrl,
      imageType: image.uploadType as "Original" | "Requested",
      createdBy: image.uploadType,
    }));
  };

  // Group images by uploadType
  const groupImagesByType = (deliveryImages: DeliveryImage[]) => {
    const senderImages = deliveryImages.filter(
      (img) => img.uploadType === "Sender"
    );
    const receiverImages = deliveryImages.filter(
      (img) => img.uploadType === "Receiver"
    );

    return {
      senderImages: transformImages(senderImages),
      receiverImages: transformImages(receiverImages),
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl min-w-[600px] max-h-[90vh] overflow-y-auto bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1 justify-between text-foreground">
            <div className="flex items-center gap-1">
              <Package className="h-5 w-5" />
              Chi tiết đơn giao hàng
            </div>
            {deliveryDetail && (
              <div className="mr-5">
                <StatusBadge status={deliveryDetail.deliveryStatus} />
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Đang tải thông tin...
            </span>
          </div>
        ) : deliveryDetail ? (
          <div className="space-y-6">
            {/* Order Code */}
            <div className="bg-muted p-4 rounded-lg flex justify-between">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">Mã đơn hàng:</span>
                <span className="font-semibold text-foreground">
                  {deliveryDetail.orderCode}
                </span>
              </div>

              {/* Delivery Price */}
              <div className="bg-muted rounded-lg">
                {/* <div className="flex items-center gap-1 mb-3">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-foreground">
                    Phí giao hàng
                  </span>
                </div> */}
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(deliveryDetail.deliveryPrice)}
                </p>
              </div>
            </div>

            {/* Time Information */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-1 mb-3">
                <Calendar className="h-4 w-4 text-pink-600" />
                <span className="font-semibold text-foreground">
                  Thông tin thời gian
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                  <div className="text-sm text-foreground">
                    {formatVietnamDateHours(deliveryDetail.createdAt)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Ngày giao hàng
                  </p>
                  {deliveryDetail.deliveredAt ? (
                    <div className="text-sm text-foreground">
                      {formatVietnamDateHours(deliveryDetail.deliveredAt)}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Chưa có</div>
                  )}
                </div>
              </div>
            </div>

            {/* Sender and Receiver Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Người gửi */}
              <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-destructive" />
                  <h3 className="text-base font-bold text-foreground">
                    Người gửi
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Họ và tên</p>
                    <p className="text-sm font-medium text-foreground">
                      {deliveryDetail.senderName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Địa chỉ</p>
                    <p className="text-sm text-foreground">
                      {deliveryDetail.senderAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {deliveryDetail.senderPhoneNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Người nhận */}
              <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-base font-bold text-foreground">
                    Người nhận
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Họ và tên</p>
                    <p className="text-sm font-medium text-foreground">
                      {deliveryDetail.receiverName || "Chưa cập nhật"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Địa chỉ</p>
                    <p className="text-sm text-foreground">
                      {deliveryDetail.receiverAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {deliveryDetail.receiverPhoneNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-1 mb-3">
                <Package className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="font-semibold text-foreground">
                  Thông tin gói hàng
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Chiều dài</p>
                  <p className="font-semibold text-foreground">
                    {deliveryDetail.length} cm
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Chiều rộng</p>
                  <p className="font-semibold text-foreground">
                    {deliveryDetail.width} cm
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Chiều cao</p>
                  <p className="font-semibold text-foreground">
                    {deliveryDetail.height} cm
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Cân nặng</p>
                  <p className="font-semibold text-foreground">
                    {deliveryDetail.weight} g
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            {deliveryDetail.images && deliveryDetail.images.length > 0 && (
              <div className="space-y-4">
                {/* Sender Images */}
                {(() => {
                  const { senderImages } = groupImagesByType(
                    deliveryDetail.images
                  );
                  return senderImages.length > 0 ? (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-1 mb-3">
                        <User className="h-4 w-4 text-destructive" />
                        <span className="font-semibold text-foreground">
                          Hình ảnh từ người gửi
                        </span>
                      </div>
                      <ImageGallery images={senderImages} title="" />
                    </div>
                  ) : null;
                })()}

                {/* Receiver Images */}
                {(() => {
                  const { receiverImages } = groupImagesByType(
                    deliveryDetail.images
                  );
                  return receiverImages.length > 0 ? (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-1 mb-3">
                        <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-foreground">
                          Hình ảnh từ người nhận
                        </span>
                      </div>
                      <ImageGallery images={receiverImages} title="" />
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Note */}
            {deliveryDetail.note && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-1 mb-3">
                  <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="font-semibold text-foreground">Ghi chú</span>
                </div>
                <p className="text-muted-foreground italic">
                  {deliveryDetail.note}
                </p>
              </div>
            )}
            {/* Upload Button removed: now only in DeliveryCard */}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Không tìm thấy thông tin chi tiết đơn giao hàng
          </div>
        )}
        {/* Cuối cùng của DialogContent, sau phần hiển thị chi tiết */}
        {/* Upload button moved inside main content */}
      </DialogContent>
      {/* Dialog upload ảnh giao hàng */}
      {/* UploadDeliveryImageDialog removed, now handled by parent */}
    </Dialog>
  );
};
