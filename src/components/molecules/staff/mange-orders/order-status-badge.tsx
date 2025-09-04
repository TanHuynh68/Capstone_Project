import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  Created: "Đã tạo",
  InProgress: "Đang thực hiện",
  Done: "Hoàn thành",
  Completed: "Đã hoàn tất",
  Rejected: "Đã từ chối",
  DesignerRejected: "Designer từ chối",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Created":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "InProgress":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Done":
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Rejected":
    case "DesignerRejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={getStatusColor(status)}>
      {ORDER_STATUS_LABELS[status] || status}
    </Badge>
  );
}
