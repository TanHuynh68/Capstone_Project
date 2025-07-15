import { Badge } from "@/components/ui/badge";

export const getReportStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <Badge variant="secondary">Đang chờ</Badge>;
    case "inprogress":
      return <Badge variant="default">Đang xử lý</Badge>;
    case "approved":
      return (
        <Badge variant="default" className="bg-green-500">
          Đã duyệt
        </Badge>
      );
    case "rejected":
      return <Badge variant="destructive">Đã từ chối</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getReportTypeBadge = (type: string) => {
  switch (type) {
    case "GeneralReport":
      return <Badge variant="default">Chung</Badge>;
    case "AccountReport":
      return <Badge variant="default">Người dùng</Badge>;
    case "PostReport":
      return <Badge variant="secondary">Bài đăng</Badge>;
    case "OrderReport":
      return <Badge variant="outline">Đơn hàng</Badge>;
    case "ShippingReport":
      return <Badge variant="default">Vận chuyển</Badge>;
    case "OrderWalletReport":
      return <Badge variant="secondary">Giao dịch ví</Badge>;
    case "PaymentReport":
      return <Badge variant="outline">Thanh toán</Badge>;
    case "CommunityFeedback":
      return <Badge variant="default">Góp ý cộng đồng</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};;
