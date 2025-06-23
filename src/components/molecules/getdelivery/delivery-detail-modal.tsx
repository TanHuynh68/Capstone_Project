"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MapPin,
  Phone,
  Package,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import DeliveryService from "@/services/DeliveryService";
import { formatVietnamDateHours } from "@/components/utils/date";

interface DeliveryDetailData {
  from_address: string;
  from_phone: string;
  to_address: string;
  to_phone: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  note: string;
  status: string;
  created_date: string;
  finish_date: string | null;
  cod_amount: number;
  order_code: string;
}

interface DeliveryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
}

export const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({
  isOpen,
  onClose,
  orderCode,
}) => {
  const [deliveryDetail, setDeliveryDetail] =
    useState<DeliveryDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const { getDeliveryByOrderID } = DeliveryService();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "picked":
        return {
          text: "Đã lấy",
          className: "bg-blue-500 text-white hover:bg-blue-600",
        };
      case "delivering":
        return {
          text: "Đang giao",
          className: "bg-orange-500 text-white hover:bg-orange-600",
        };
      case "delivered":
        return {
          text: "Hoàn thành",
          className: "bg-green-500 text-white hover:bg-green-600",
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          className: "bg-gray-500 text-white hover:bg-gray-600",
        };
      default:
        return { text: status, className: "bg-gray-400 text-white" };
    }
  };

  const fetchDeliveryDetail = async () => {
    if (!orderCode) return;

    setLoading(true);
    try {
      const response = await getDeliveryByOrderID({ orderCode });
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
    if (isOpen && orderCode) {
      fetchDeliveryDetail();
    }
  }, [isOpen, orderCode]);

  const statusBadge = deliveryDetail
    ? getStatusBadge(deliveryDetail.status)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1 justify-between">
            <div className="flex items-center gap-1">
              <Package className="h-5 w-5" />
              Chi tiết đơn giao hàng
            </div>
            {deliveryDetail && (
              <Badge className={`text-xs mr-3 ${statusBadge?.className}`}>
                {statusBadge?.text}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
          </div>
        ) : deliveryDetail ? (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-1 mb-3">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-gray-800">
                  Thông tin thời gian
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="font-semibold text-gray-800">
                    <div className="text-sm text-gray-600">
                      {formatVietnamDateHours(deliveryDetail.created_date)}
                    </div>
                  </p>
                </div>
                {deliveryDetail.finish_date && (
                  <div>
                    <p className="text-xs text-gray-500">Ngày giao hàng</p>
                    <p className="font-semibold text-gray-800">
                      <div className="text-sm text-gray-600">
                        {formatVietnamDateHours(deliveryDetail.finish_date)}
                      </div>
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Order Code */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  Mã đơn hàng:
                </span>
                <span className="font-mono text-lg font-bold text-blue-900">
                  {deliveryDetail.order_code}
                </span>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-gray-800">
                    Địa chỉ gửi
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    {deliveryDetail.from_address}
                  </p>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {deliveryDetail.from_phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* To Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-gray-800">
                    Địa chỉ nhận
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    {deliveryDetail.to_address}
                  </p>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {deliveryDetail.to_phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-1 mb-3">
                <Package className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-gray-800">
                  Thông tin gói hàng
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Chiều dài</p>
                  <p className="font-semibold text-gray-800">
                    {deliveryDetail.length} cm
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Chiều rộng</p>
                  <p className="font-semibold text-gray-800">
                    {deliveryDetail.width} cm
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Chiều cao</p>
                  <p className="font-semibold text-gray-800">
                    {deliveryDetail.height} cm
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Cân nặng</p>
                  <p className="font-semibold text-gray-800">
                    {deliveryDetail.weight} g
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}

            {/* COD Amount */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-1 mb-3">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-gray-800">
                  Phí giao hàng
                </span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(deliveryDetail.cod_amount)}
              </p>
            </div>

            {/* Note */}
            {deliveryDetail.note && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-1 mb-3">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-gray-800">Ghi chú</span>
                </div>
                <p className="text-gray-700 italic">{deliveryDetail.note}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy thông tin chi tiết đơn giao hàng
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
