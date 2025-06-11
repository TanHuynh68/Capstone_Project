import { Badge } from "@/components/ui/badge";
import { ORDER_STATUSES } from "@/constants";


interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "InProgress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Refunded":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export default function OrderStatusBadge({
  status,
  className = "",
}: OrderStatusBadgeProps) {
  const displayStatus = ORDER_STATUSES[status as OrderStatus] || status;
  const colorClass = getStatusColor(status);

  return (
    <Badge variant="secondary" className={`${colorClass} ${className}`}>
      {displayStatus}
    </Badge>
  );
}
