import type React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig = {
  // PascalCase mappings
  ReadyToPick: {
    label: "Sẵn sàng lấy hàng",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  Picked: {
    label: "Đã lấy hàng",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  Delivering: {
    label: "Đang giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  Delivered: {
    label: "Đã giao hàng",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  Cancelled: {
    label: "Đã hủy",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  // Lowercase mappings
  readytopick: {
    label: "Sẵn sàng lấy hàng",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  picked: {
    label: "Đã lấy hàng",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  delivering: {
    label: "Đang giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  delivered: {
    label: "Đã giao hàng",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  cancelled: {
    label: "Đã hủy",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  // Additional variations that might come from API
  "ready-to-pick": {
    label: "Sẵn sàng lấy hàng",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  ready_to_pick: {
    label: "Sẵn sàng lấy hàng",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  "in-transit": {
    label: "Đang giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  in_transit: {
    label: "Đang giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  "out-for-delivery": {
    label: "Đang giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  out_for_delivery: {
    label: "Đang giao hàng",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  completed: {
    label: "Đã giao hàng",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  failed: {
    label: "Đã hủy",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  returned: {
    label: "Đã trả hàng",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
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
