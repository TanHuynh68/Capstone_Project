// components/posts/atoms/status-badge.tsx
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusDetails = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { label: 'Đang hoạt động', variant: 'success' as const };
      case 'inactive':
        return { label: 'Không hoạt động', variant: 'secondary' as const };
      case 'pending':
        return { label: 'Đang chờ', variant: 'warning' as const };
      case 'completed':
        return { label: 'Hoàn thành', variant: 'default' as const };
      case 'rejected':
        return { label: 'Từ chối', variant: 'destructive' as const };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  const { label, variant } = getStatusDetails(status);

  return <Badge variant={variant}>{label}</Badge>;
}