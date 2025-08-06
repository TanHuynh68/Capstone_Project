import { Badge } from "@/components/ui/badge";

// Status badge variants for consistent styling
export const getStatusBadge = (
  status: string,
  type: "order" | "user" | "transaction" = "order"
) => {
  switch (type) {
    case "order":
      return getOrderStatusBadge(status);
    case "user":
      return getUserStatusBadge(status);
    case "transaction":
      return getTransactionTypeBadge(status);
    default:
      return getOrderStatusBadge(status);
  }
};

// Order status badges
export const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return (
        <Badge
          variant="warning"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          Chờ duyệt
        </Badge>
      );
    case "Completed":
      return (
        <Badge
          variant="success"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Hoàn tất
        </Badge>
      );
    case "Canceled":
      return (
        <Badge
          className="bg-red-100 text-red-800 border-red-200"
        >
          Đã hủy
        </Badge>
      );
    case "InProcess":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Đang xử lý
        </Badge>
      );
    case "Failed":
      return (
        <Badge
          className="bg-red-100 text-red-800 border-red-200"
        >
          Thất bại
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {status}
        </Badge>
      );
  }
};

// User status badges
export const getUserStatusBadge = (status: string | boolean) => {
  if (typeof status === "boolean") {
    return status ? (
      <Badge
        variant="success"
        className="bg-green-100 text-green-800 border-green-200"
      >
        Hoạt động
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Tạm khóa</Badge>
    );
  }

  switch (status) {
    case "Active":
    case "true":
      return (
        <Badge
          variant="success"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Hoạt động
        </Badge>
      );
    case "Inactive":
    case "false":
      return <Badge className="bg-red-100 text-red-800">Tạm khóa</Badge>;
    case "Verified":
      return (
        <Badge
          variant="success"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Đã xác minh
        </Badge>
      );
    case "Unverified":
      return <Badge className="bg-red-100 text-red-800 ">Chưa xác minh</Badge>;
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {status}
        </Badge>
      );
  }
};

// Transaction type badges
export const getTransactionTypeBadge = (type: string) => {
  switch (type) {
    case "Deposit":
      return (
        <Badge
          variant="success"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Nạp tiền
        </Badge>
      );
    case "Withdraw":
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 border-red-200"
        >
          Rút tiền
        </Badge>
      );
    case "Transfer":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Chuyển tiền
        </Badge>
      );
    case "Receive":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Nhận tiền
        </Badge>
      );
    case "PlaceDeposit":
      return (
        <Badge
          variant="warning"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          Đặt cọc
        </Badge>
      );
    case "RefundDeposit":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          Hoàn cọc
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Không xác định
        </Badge>
      );
  }
};

// Role badges
export const getRoleBadge = (role: string) => {
  switch (role) {
    case "Customer":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Khách hàng
        </Badge>
      );
    case "Designer":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Nhà thiết kế
        </Badge>
      );
    case "Staff":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          Nhân viên
        </Badge>
      );
    case "Admin":
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 border-red-200"
        >
          Quản trị viên
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {role || "Không rõ"}
        </Badge>
      );
  }
};

// Gender badges
export const getGenderBadge = (gender: string) => {
  switch (gender) {
    case "Male":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Nam</Badge>
      );
    case "Female":
      return (
        <Badge className="bg-pink-100 text-pink-800 border-pink-200">Nữ</Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Khác
        </Badge>
      );
  }
};
