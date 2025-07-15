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
  const typeNumber = Number.parseInt(type);
  switch (typeNumber) {
    case 0:
      return <Badge variant="outline">Người dùng</Badge>;
    case 1:
      return <Badge variant="outline">Bài đăng</Badge>;
    case 2:
      return <Badge variant="outline">Bình luận</Badge>;
    case 3:
      return <Badge variant="outline">Nhóm</Badge>;
    case 4:
      return <Badge variant="outline">Sự kiện</Badge>;
    case 5:
      return <Badge variant="outline">Trang</Badge>;
    case 6:
      return <Badge variant="outline">Story</Badge>;
    case 7:
      return <Badge variant="outline">Tin nhắn</Badge>;
    case 8:
      return <Badge variant="outline">Bài đăng nhóm</Badge>;
    case 9:
      return <Badge variant="outline">Khác</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};
