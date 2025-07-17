export const CUSTOMER_REPORT_TYPES = [
  { value: "all", label: "Tất cả loại tố cáo" },
  { value: "0", label: "Báo cáo chung" }, //
  { value: "1", label: "Báo cáo người dùng" },
  { value: "2", label: "Báo cáo bài đăng" },
  { value: "3", label: "Báo cáo đơn hàng" },
  { value: "4", label: "Báo cáo vận chuyển" },
  { value: "5", label: "Báo cáo giao dịch ví" },
  { value: "6", label: "Báo cáo thanh toán" },
  { value: "7", label: "Góp ý cộng đồng" },
];

export const CUSTOMER_REPORT_STATUSES = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "0", label: "Đang chờ" },
  { value: "1", label: "Đang xử lý" },
  { value: "2", label: "Đã duyệt" },
  { value: "3", label: "Đã từ chối" },
]

export const CUSTOMER_PAGE_SIZE = 10

export const CUSTOMER_STATUS_MAPPING = {
  pending: 0,
  inprogress: 1,
  approved: 2,
  rejected: 3,
} as const
