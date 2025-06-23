"use client"

import type { OrderDetail } from "@/types/orderManagement"
import OrderInfoCard from "@/components/molecules/customer/order-detail/OrderInfoCard"
import OfferInfoCard from "@/components/molecules/customer/order-detail/OfferInfoCard"

interface LeftPanelProps {
  orderDetail: OrderDetail
  onViewPhases: () => void
  onViewDelivery: () => void
  onViewActivityLog: () => void
}

export default function LeftPanel({ orderDetail, onViewPhases, onViewDelivery, onViewActivityLog }: LeftPanelProps) {
  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <OrderInfoCard
        order={orderDetail.order}
        onViewPhases={onViewPhases}
        onViewDelivery={onViewDelivery}
        onViewActivityLog={onViewActivityLog}
      />
      <OfferInfoCard offer={orderDetail.offer} />
    </div>
  )
}
