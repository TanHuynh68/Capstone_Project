import { Badge } from "@/components/ui/badge";
import { ORDER_STATUSES } from "@/constants";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Created":
      return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/30";
    case "ShippingToDesigner":
    case "ShippingToCustomer":
      return "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/30";
    case "DesignerRejected":
    case "CustomerRejected":
    case "Rejected":
      return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30";
    case "InProgress":
      return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30";
    case "Completed":
      return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/30";
    case "Done":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30";
    case "PendingConflict":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30";
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
