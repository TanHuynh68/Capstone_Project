import OrderCard from "@/components/molecules/order/OrderCard"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderGridProps {
  orders: Order[]
  loading?: boolean
  onView?: (orderID: string) => void
  onMessage?: (orderID: string) => void
}

function OrderCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <Skeleton className="h-2 w-full" />

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      <Skeleton className="h-16 w-full" />

      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-12" />
      </div>
    </div>
  )
}

export default function OrderGrid({ orders, loading, onView, onMessage }: OrderGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
        <p className="text-gray-500">Chưa có đơn hàng nào phù hợp với bộ lọc của bạn.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard key={order.orderID} order={order} onView={onView} onMessage={onMessage} />
      ))}
    </div>
  )
}
