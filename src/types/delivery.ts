export interface Delivery {
  deliveryID: string
  orderID: string
  accountID: string
  customerName?: string
  designerName?: string
  deliveryStatus: any
  deliveryStatusText?: string
  trackingNumber?: string
  shippingAddress: string
  recipientName: string
  recipientPhone: string
  deliveryFee: number
  estimatedDeliveryDate?: string
  actualDeliveryDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DeliveryFilterState {
  search: string
  status: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

export interface DeliverySortState {
  column: keyof Delivery | ""
  direction: "asc" | "desc"
}

export const DELIVERY_STATUSES = {
  0: "Sẵn sàng lấy hàng",
  1: "Đang lấy hàng",
  2: "Thu tiền khi lấy hàng",
  3: "Đã lấy hàng",
  4: "Đang lưu kho",
  5: "Đang vận chuyển",
  6: "Đang phân loại",
  7: "Đang giao hàng",
  8: "Thu tiền khi giao hàng",
  9: "Đã giao hàng",
  10: "Giao hàng thất bại",
  11: "Chờ hoàn trả",
  12: "Đang hoàn trả",
  13: "Đã hoàn trả",
  14: "Đã hủy",
  15: "Ngoại lệ",
  16: "Hư hỏng",
  17: "Thất lạc",
  18: "Hủy bỏ",
  19: "Vận chuyển hoàn trả",
  20: "Phân loại hoàn trả",
  21: "Lưu kho hoàn trả",
  22: "Thu tiền giao hàng thất bại",
  23: "Khác",
} as const

export type DeliveryStatus = keyof typeof DELIVERY_STATUSES

export interface DeliveryListResponse {
  items: Delivery[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export interface GetDeliveriesParams {
  page?: number
  size?: number
  accountID?: string
  orderID?: string
  deliveryStatus?: number
}
