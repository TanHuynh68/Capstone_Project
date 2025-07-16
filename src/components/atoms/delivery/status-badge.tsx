import type React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig = {
  ReadyToPick: {
    label: "Sẵn sàng lấy hàng",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  Picking: {
    label: "Đang lấy hàng",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  MoneyCollectPicking: {
    label: "Đang thu tiền khi lấy hàng",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  Picked: {
    label: "Đã lấy hàng",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  Storing: {
    label: "Đang lưu kho",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  Transporting: {
    label: "Đang vận chuyển",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  Sorting: {
    label: "Đang phân loại",
    variant: "secondary" as const,
    className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  },
  Delivering: {
    label: "Đang giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  MoneyCollectDelivering: {
    label: "Đang thu tiền khi giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  Delivered: {
    label: "Đã giao hàng",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  DeliveryFail: {
    label: "Giao hàng thất bại",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  WaitingToReturn: {
    label: "Chờ trả hàng",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  Returning: {
    label: "Đang trả hàng",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  Returned: {
    label: "Đã trả hàng",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Cancel: {
    label: "Đã hủy",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Exception: {
    label: "Ngoại lệ",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Damaged: {
    label: "Hư hỏng",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Lost: {
    label: "Thất lạc",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Destroy: {
    label: "Đã tiêu hủy",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  ReturnTransporting: {
    label: "Đang vận chuyển trả hàng",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  ReturnSorting: {
    label: "Đang phân loại trả hàng",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  ReturnStoring: {
    label: "Đang lưu kho trả hàng",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  OutForDeliveryFail: {
    label: "Giao hàng thu tiền thất bại",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Other: {
    label: "Trạng thái khác",
    variant: "outline" as const,
    className: "",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "outline" as const,
    className: "",
  };

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
