"use client";

import { Badge } from "@/components/ui/badge";

interface DeliveryStatusBadgeProps {
  status: string;
  className?: string;
}

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  ReadyToPick: "Sẵn sàng lấy hàng",
  Picking: "Đang lấy hàng",
  MoneyCollectPicking: "Lấy hàng thu tiền",
  Picked: "Đã lấy hàng",
  Storing: "Đang lưu kho",
  Transporting: "Đang vận chuyển",
  Sorting: "Đang phân loại",
  Delivering: "Đang giao hàng",
  MoneyCollectDelivering: "Giao hàng thu tiền",
  Delivered: "Đã giao hàng",
  DeliveryFail: "Giao hàng thất bại",
  WaitingToReturn: "Chờ hoàn trả",
  Returning: "Đang hoàn trả",
  Returned: "Đã hoàn trả",
  Cancel: "Đã hủy",
  Exception: "Ngoại lệ",
  Damaged: "Hư hỏng",
  Lost: "Thất lạc",
  Destroy: "Hủy bỏ",
  ReturnTransporting: "Vận chuyển hoàn trả",
  ReturnSorting: "Phân loại hoàn trả",
  ReturnStoring: "Lưu kho hoàn trả",
  MoneyCollectDeliveryFail: "Giao hàng thu tiền thất bại",
  Other: "Khác",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "Delivering":
    case "MoneyCollectDelivering":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ReadyToPick":
    case "Picking":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "DeliveryFail":
    case "MoneyCollectDeliveryFail":
      return "bg-red-100 text-red-800 border-red-200";
    case "Cancel":
    case "Destroy":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Exception":
    case "Damaged":
    case "Lost":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "WaitingToReturn":
    case "Returning":
    case "Returned":
    case "ReturnTransporting":
    case "ReturnSorting":
    case "ReturnStoring":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Picked":
    case "Storing":
    case "Transporting":
    case "Sorting":
    case "MoneyCollectPicking":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function DeliveryStatusBadge({
  status,
  className = "",
}: DeliveryStatusBadgeProps) {
  const statusText = DELIVERY_STATUS_LABELS[status] || "Không xác định";
  const colorClass = getStatusColor(status);

  return (
    <Badge className={`${colorClass} ${className}`} variant="outline">
      {statusText}
    </Badge>
  );
}
