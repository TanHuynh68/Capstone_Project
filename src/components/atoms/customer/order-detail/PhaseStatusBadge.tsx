"use client";

import { Badge } from "@/components/ui/badge";

interface PhaseStatusBadgeProps {
  status: string;
}

export default function PhaseStatusBadge({ status }: PhaseStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "NotStarted":
        return {
          variant: "secondary" as const,
          label: "Chưa bắt đầu",
          color: "bg-gray-100 text-gray-800",
        };
      case "Dealed":
        return {
          variant: "default" as const,
          label: "Đã thương lượng",
          color: "bg-indigo-100 text-indigo-800",
        };
      case "Deposited":
        return {
          variant: "default" as const,
          label: "Đã đặt cọc",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "Withdrawed":
        return {
          variant: "secondary" as const,
          label: "Đã rút cọc",
          color: "bg-orange-100 text-orange-800",
        };
      case "InProgress":
        return {
          variant: "default" as const,
          label: "Đang thực hiện",
          color: "bg-blue-100 text-blue-800",
        };
      case "Rework":
        return {
          variant: "default" as const,
          label: "Làm lại",
          color: "bg-purple-100 text-purple-800",
        };
      case "Done":
        return {
          variant: "default" as const,
          label: "Hoàn thành",
          color: "bg-green-100 text-green-800",
        };
      case "Refund":
        return {
          variant: "default" as const,
          label: "Hoàn tiền",
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
