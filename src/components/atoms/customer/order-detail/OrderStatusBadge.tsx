"use client";

import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  console.log('OrderStatusBadge: ', status)
  const getStatusConfig = (status: string) => {
    switch (status) {
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
