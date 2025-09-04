
import DeliveryCard from "@/components/molecules/staff/manage-users/manage-deliveries/DeliveryCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { Delivery } from "@/types/delivery"

interface DeliveryGridProps {
  deliveries: Delivery[]
  loading?: boolean
  onView?: (deliveryID: string) => void
}

function DeliveryCardSkeleton() {
  return (
    <div className="p-6 border border-gray-200 rounded-lg space-y-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default function DeliveryGrid({ deliveries, loading, onView }: DeliveryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <DeliveryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có giao hàng nào</h3>
        <p className="text-gray-500">Người dùng này chưa có giao hàng nào.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deliveries.map((delivery: any) => (
        <DeliveryCard key={delivery.deliveryID} delivery={delivery} onView={onView} />
      ))}
    </div>
  )
}
