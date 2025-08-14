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
  createdAt: string;
  oldStatus: string | null;
  designerName: string;
  customerName: string;
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
  Created: "Đã tạo mới", // 1
  ShippingToDesigner: "Đang giao cho NTK", // 2
  DesignerRejected: "NTK từ chối", // 2.1
  InProgress: "Đang thực hiện", // 3
  Completed: "Đã hoàn thành", // 4
  ShippingToCustomer: "Đang giao cho khách", // 5
  CustomerRejected: "Khách từ chối", // 5.1
  Done: "Hoàn tất", // 6
  PendingConflict: "Đang xử lý tranh chấp", // 7
  Rejected: "Bị từ chối",
} as const;

interface OrderSortState {
  column: keyof Order | "";
  direction: "asc" | "desc";
}

type OrderStatus = keyof typeof ORDER_STATUSES;

interface DepositHistoryItem {
  orderDepositID: string;
  fullname: string;
  title: string;
  amount: number;
  type: "Deposit" | "Withdraw";
  depositAt: string;
}

interface DepositHistoryProps {
  orderID: string;
  deposits: DepositHistoryItem[];
}

interface OrderDepositTransaction {
  depositTransactionID: string;
  type: "Withdraw" | "Deposit"; // nếu bạn có thêm loại, bổ sung vào đây
  amount: number;
  description: string;
  transactionAt: string; // ISO date string
}
