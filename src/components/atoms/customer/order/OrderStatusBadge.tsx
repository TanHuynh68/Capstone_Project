import { Badge } from "@/components/ui/badge";
import { ORDER_STATUSES } from "@/constants";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Created":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "ShippingToDesigner":
    case "ShippingToCustomer":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "DesignerRejected":
    case "CustomerRejected":
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "InProgress":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Done":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "PendingConflict":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
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
