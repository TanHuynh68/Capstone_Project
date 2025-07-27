import type { OrderDetail } from "@/types/orderManagement";
import OrderInfoCard from "@/components/molecules/customer/order-detail/OrderInfoCard";
import OfferInfoCard from "@/components/molecules/customer/order-detail/OfferInfoCard";

interface LeftPanelProps {
  orderDetail: OrderDetail;
  onViewPhases: () => void;
  onViewDepositHistory: () => void;
  onViewActivityLog: () => void;
  depositHistory?: DepositHistoryItem[];
  depositHistoryLoading?: boolean;
  fetchDepositTransaction: any;
}

export default function LeftPanel({
  orderDetail,
  onViewPhases,
  onViewDepositHistory,
  onViewActivityLog,
  depositHistory = [],
  depositHistoryLoading = false,
  fetchDepositTransaction,
}: LeftPanelProps) {
  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <OrderInfoCard
        fetchDepositTransaction={fetchDepositTransaction}
        order={orderDetail.order}
        onViewPhases={onViewPhases}
        onViewDepositHistory={onViewDepositHistory}
        onViewActivityLog={onViewActivityLog}
        depositHistory={depositHistory}
        depositHistoryLoading={depositHistoryLoading}
      />
      <OfferInfoCard offer={orderDetail.offer} />
    </div>
  );
}
