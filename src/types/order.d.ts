interface Order {
  orderID: string;
  customerID: string;
  designerID: string;
  totalPrice: number;
  orderStatus: string;
  requiredDepositAmount: number;
  designerDepositAmount: number;
  note: string;
  deadlineAt: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderFilterState {
  search: string;
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  deadlineRange: {
    from: Date | null;
    to: Date | null;
  };
}
const ORDER_STATUSES = {
  InProgress: "Đang thực hiện",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
} as const;

interface OrderSortState {
  column: keyof Order | "";
  direction: "asc" | "desc";
}

type OrderStatus = keyof typeof ORDER_STATUSES;
