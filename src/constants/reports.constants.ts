export const REPORT_TYPES = [
  { value: "all", label: "Tất cả loại báo cáo" },
  { value: "0", label: "Báo cáo người dùng" },
  { value: "1", label: "Báo cáo bài đăng" },
  { value: "2", label: "Báo cáo bình luận" },
  { value: "3", label: "Báo cáo nhóm" },
  { value: "4", label: "Báo cáo sự kiện" },
  { value: "5", label: "Báo cáo trang" },
  { value: "6", label: "Báo cáo story" },
  { value: "7", label: "Báo cáo tin nhắn" },
  { value: "8", label: "Báo cáo bài đăng nhóm" },
  { value: "9", label: "Khác" },
];

export const REPORT_STATUSES = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "0", label: "Đang chờ" },
  { value: "1", label: "Đang xử lý" },
  { value: "2", label: "Đã duyệt" },
  { value: "3", label: "Đã từ chối" },
];

export const PAGE_SIZE = 10;

export const STATUS_MAPPING = {
  pending: 0,
  inprogress: 1,
  approved: 2,
  rejected: 3,
} as const;