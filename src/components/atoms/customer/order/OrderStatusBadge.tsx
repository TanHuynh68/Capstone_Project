import { Badge } from "@/components/ui/badge";
import { ORDER_STATUSES } from "@/constants";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusColor = (status: string): string => {
  console.log("getStatusColor: ", status);
  switch (status) {
    case "Pending":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30";
    case "InProgress":
      return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30";
    case "Completed":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30";
    case "Cancelled":
      return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30";
    case "Refunded":
      return "bg-muted text-muted-foreground hover:bg-muted/80";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
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
