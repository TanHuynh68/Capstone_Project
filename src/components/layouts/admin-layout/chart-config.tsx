import { Users, ShoppingCart, Flag, FileText } from "lucide-react";

export const chartConfigs = {
  account: {
    title: "Thống kê tài khoản",
    description: "Tổng quan về người dùng trong hệ thống",
    icon: <Users className="w-4 h-4" />,
    fields: {
      totalNewAccountInFilter: { label: "Tài khoản mới", color: "#ef4444" },
      newCustomerInFilter: { label: "Khách hàng mới", color: "#06b6d4" },
      newDesignerInFilter: { label: "Nhà thiết kế mới", color: "#f97316" },
    },
    defaultFields: [
      "totalNewAccountInFilter",
      "newCustomerInFilter",
    ] as string[],
  },
  post: {
    title: "Thống kê bài đăng",
    description: "Tình trạng các bài đăng trong hệ thống",
    icon: <FileText className="w-4 h-4" />,
    fields: {
      totalNewPostInFilter: { label: "Bài đăng mới", color: "#f59e0b" },
      totalNewActivePost: { label: "Bài đăng hoạt động mới", color: "#8b5cf6" },
    },
    defaultFields: ["totalNewPostInFilter", "totalNewActivePost"] as string[],
  },
  order: {
    title: "Thống kê đơn hàng",
    description: "Tình trạng các đơn hàng trong hệ thống",
    icon: <ShoppingCart className="w-4 h-4" />,
    fields: {
      totalOrderInFilter: { label: "Đơn hàng trong kỳ", color: "#8b5cf6" },
      totalRevenueInFilter: { label: "Doanh thu trong kỳ", color: "#3b82f6" },
      orderDoneInFilter: { label: "Đơn hoàn thành trong kỳ", color: "#06b6d4" },
      orderInProgressInFilter: {
        label: "Đơn đang thực hiện trong kỳ",
        color: "#f97316",
      },
      orderPendingConflictInFilter: {
        label: "Đơn tranh chấp trong kỳ",
        color: "#ec4899",
      },
      orderCancelledInFilter: {
        label: "Đơn đã hủy trong kỳ",
        color: "#64748b",
      },
    },
    defaultFields: ["totalOrderInFilter", "orderDoneInFilter"] as string[],
  },
  report: {
    title: "Thống kê báo cáo",
    description: "Tình trạng các báo cáo trong hệ thống",
    icon: <Flag className="w-4 h-4" />,
    fields: {
      totalReportInFilter: { label: "Báo cáo trong kỳ", color: "#8b5cf6" },
      reportPendingInFilter: {
        label: "Báo cáo chờ xử lý trong kỳ",
        color: "#06b6d4",
      },
      reportResolvedInFilter: {
        label: "Báo cáo đã giải quyết trong kỳ",
        color: "#f97316",
      },
      reportRejectedInFilter: {
        label: "Báo cáo bị từ chối trong kỳ",
        color: "#ec4899",
      },
    },
    defaultFields: ["totalReportInFilter", "reportPendingInFilter"] as string[],
  },
} as const;
