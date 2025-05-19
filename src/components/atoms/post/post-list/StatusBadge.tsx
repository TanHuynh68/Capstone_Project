import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: number
  className?: string
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  let color = ""
  let label = ""

  switch (status) {
    case 1:
      color = "bg-green-100 text-green-800 hover:bg-green-100"
      label = "Đang hoạt động"
      break
    case 2:
      color = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      label = "Đang xử lý"
      break
    case 3:
      color = "bg-red-100 text-red-800 hover:bg-red-100"
      label = "Đã kết thúc"
      break
    default:
      color = "bg-gray-100 text-gray-800 hover:bg-gray-100"
      label = "Không xác định"
  }

  return (
    <Badge variant="outline" className={`${color} ${className}`}>
      {label}
    </Badge>
  )
}
