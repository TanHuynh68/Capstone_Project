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
        label: "Đã tạo",
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      };
    case "ShippingToDesigner":
      return {
        variant: "default" as const,
        label: "Gửi đến NTK",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      };
    case "DesignerRejected":
      return {
        variant: "destructive" as const,
        label: "NTK từ chối",
        color: "bg-red-100 text-red-800 hover:bg-red-200",
      };
    case "ShippingToCustomer":
      return {
        variant: "default" as const,
        label: "NTK trả hàng",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      };
    case "CustomerRejected":
      return {
        variant: "destructive" as const,
        label: "Khách hàng đã từ chối",
        color: "bg-red-100 text-red-800 hover:bg-red-200",
      };
    case "Rejected":
      return {
        variant: "destructive" as const,
        label: "Bị từ chối",
        color: "bg-red-100 text-red-800 hover:bg-red-200",
      };
    case "InProgress":
      return {
        variant: "default" as const,
        label: "Đang thực hiện",
        color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      };
    case "Completed":
      return {
        variant: "default" as const,
        label: "Hoàn thành",
        color: "bg-green-100 text-green-800 hover:bg-green-200",
      };
    case "Done":
      return {
        variant: "default" as const,
        label: "Hoàn tất",
        color: "bg-green-100 text-green-800 hover:bg-green-200",
      };
    case "PendingConflict":
      return {
        variant: "secondary" as const,
        label: "Chờ xử lý tranh chấp",
        color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      };
    default:
      return {
        variant: "secondary" as const,
        label: status,
        color: "bg-muted text-muted-foreground hover:bg-muted/80",
      };
  }
}

  const config = getStatusConfig(status);

  return <Badge className={config.color}>{config.label}</Badge>;
}
