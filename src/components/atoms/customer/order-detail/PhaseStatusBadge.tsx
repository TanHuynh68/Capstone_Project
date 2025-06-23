"use client"

import { Badge } from "@/components/ui/badge"

interface PhaseStatusBadgeProps {
  status: string
}

export default function PhaseStatusBadge({ status }: PhaseStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "NotStarted":
        return { variant: "secondary" as const, label: "Chưa bắt đầu", color: "bg-gray-100 text-gray-800" }
      case "InProgress":
        return { variant: "default" as const, label: "Đang thực hiện", color: "bg-blue-100 text-blue-800" }
      case "Completed":
        return { variant: "default" as const, label: "Hoàn thành", color: "bg-green-100 text-green-800" }
      case "Cancelled":
        return { variant: "destructive" as const, label: "Đã hủy", color: "bg-red-100 text-red-800" }
      default:
        return { variant: "secondary" as const, label: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  const config = getStatusConfig(status)

  return <Badge className={config.color}>{config.label}</Badge>
}
