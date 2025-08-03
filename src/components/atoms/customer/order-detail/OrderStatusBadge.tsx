"use client";

import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  console.log("OrderStatusBadge: ", status);
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Created":
        return {
          variant: "secondary" as const,
          label: "Mới tạo",
          color: "bg-gray-100 text-gray-800",
        };
      case "ShippingToDesigner":
        return {
          variant: "default" as const,
          label: "Đang giao đến designer",
          color: "bg-indigo-100 text-indigo-800",
        };
      case "DesignerRejected":
        return {
          variant: "destructive" as const,
          label: "NTK từ chối",
          color: "bg-red-100 text-red-800",
        };
      case "ShippingToCustomer":
        return {
          variant: "default" as const,
          label: "Đang giao đến khách hàng",
          color: "bg-blue-100 text-blue-800",
        };
      case "CustomerRejected":
        return {
          variant: "destructive" as const,
          label: "Khách từ chối",
          color: "bg-red-100 text-red-800",
        };
      case "Done":
        return {
          variant: "default" as const,
          label: "Hoàn thành",
          color: "bg-green-100 text-green-800",
        };
      case "PendingConflict":
        return {
          variant: "secondary" as const,
          label: "Chờ xử lý tranh chấp",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "Rejected":
        return {
          variant: "destructive" as const,
          label: "Bị từ chối",
          color: "bg-red-100 text-red-800",
        };
      // Các trạng thái đã có
      case "Pending":
        return {
          variant: "secondary" as const,
          label: "Chờ xử lý",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "InProgress":
        return {
          variant: "default" as const,
          label: "Đang thực hiện",
          color: "bg-blue-100 text-blue-800",
        };
      case "Completed":
        return {
          variant: "default" as const,
          label: "Hoàn thành",
          color: "bg-green-100 text-green-800",
        };
      case "Cancelled":
        return {
          variant: "destructive" as const,
          label: "Đã hủy",
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          variant: "secondary" as const,
          label: status,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const config = getStatusConfig(status);

  return <Badge className={config.color}>{config.label}</Badge>;
}
