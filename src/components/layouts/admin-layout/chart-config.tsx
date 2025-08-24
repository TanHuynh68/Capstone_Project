import { Users, ShoppingCart, Flag, FileText } from "lucide-react";

export const chartConfigs = {
  account: {
    title: "Thống kê tài khoản",
    description: "Tổng quan về người dùng trong hệ thống",
    icon: <Users className="w-4 h-4" />,
    fields: {
      totalAccount: { label: "Tổng tài khoản", color: "#3b82f6" },
      totalAccountActive: { label: "Tài khoản hoạt động", color: "#10b981" },
      numberOfCustomer: { label: "Khách hàng", color: "#f59e0b" },
      numberOfDesigner: { label: "Nhà thiết kế", color: "#8b5cf6" },
      totalNewAccountInFilter: { label: "Tài khoản mới", color: "#ef4444" },
      newCustomerInFilter: { label: "Khách hàng mới", color: "#06b6d4" },
      newDesignerInFilter: { label: "Nhà thiết kế mới", color: "#f97316" },
    },
    defaultFields: ["totalAccount", "totalAccountActive"] as string[],
  },
  post: {
    title: "Thống kê bài đăng",
    description: "Tình trạng các bài đăng trong hệ thống",
    icon: <FileText className="w-4 h-4" />,
    fields: {
      totalPost: { label: "Tổng bài đăng", color: "#3b82f6" },
      totalActivePost: { label: "Bài đăng hoạt động", color: "#10b981" },
      totalNewAccountInFilter: { label: "Bài đăng mới", color: "#f59e0b" },
      totalNewActivePost: { label: "Bài đăng hoạt động mới", color: "#8b5cf6" },
    },
    defaultFields: ["totalPost", "totalActivePost"] as string[],
  },
  order: {
    title: "Thống kê đơn hàng",
    description: "Tình trạng các đơn hàng trong hệ thống",
    icon: <ShoppingCart className="w-4 h-4" />,
    fields: {
      totalOrder: { label: "Tổng đơn hàng", color: "#3b82f6" },
      orderDone: { label: "Đơn hoàn thành", color: "#10b981" },
      orderInProgress: { label: "Đơn đang thực hiện", color: "#f59e0b" },
      orderPendingConflict: { label: "Đơn tranh chấp", color: "#ef4444" },
      orderCancelled: { label: "Đơn đã hủy", color: "#6b7280" },
      totalOrderInFilter: { label: "Đơn hàng trong kỳ", color: "#8b5cf6" },
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
    defaultFields: ["totalOrder", "orderDone"] as string[],
  },
  report: {
    title: "Thống kê báo cáo",
    description: "Tình trạng các báo cáo trong hệ thống",
    icon: <Flag className="w-4 h-4" />,
    fields: {
      totalReport: { label: "Tổng báo cáo", color: "#3b82f6" },
      reportPending: { label: "Báo cáo chờ xử lý", color: "#f59e0b" },
      reportResolved: { label: "Báo cáo đã giải quyết", color: "#10b981" },
      reportRejected: { label: "Báo cáo bị từ chối", color: "#ef4444" },
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
    defaultFields: ["totalReport", "reportPending"] as string[],
  },
} as const;
