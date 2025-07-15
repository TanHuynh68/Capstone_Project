import { Badge } from "@/components/ui/badge";

export const getCustomerReportTypeBadge = (type: string) => {
  const typeConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    GeneralReport: { label: "Chung", variant: "default" },
    AccountReport: { label: "Người dùng", variant: "default" },
    PostReport: { label: "Bài đăng", variant: "secondary" },
    OrderReport: { label: "Đơn hàng", variant: "outline" },
    ShippingReport: { label: "Vận chuyển", variant: "default" },
    OrderWalletReport: { label: "Giao dịch ví", variant: "secondary" },
    PaymentReport: { label: "Thanh toán", variant: "outline" },
    CommunityFeedback: { label: "Góp ý cộng đồng", variant: "default" },
  };

  const config = typeConfig[type] || {
    label: type,
    variant: "outline" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const getCustomerReportStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      className?: string;
    }
  > = {
    Pending: {
      label: "Đang chờ",
      variant: "outline",
      className: "text-yellow-600 border-yellow-600",
    },
    InProgress: {
      label: "Đang xử lý",
      variant: "default",
      className: "bg-blue-500 text-white",
    },
    Approved: {
      label: "Đã duyệt",
      variant: "default",
      className: "bg-green-500 text-white",
    },
    Rejected: { label: "Đã từ chối", variant: "destructive" },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: "outline" as const,
  };
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
