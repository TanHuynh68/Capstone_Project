"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import OrderFilters from "@/components/molecules/customer/order/OrderFilters"
import OrderGrid from "@/components/organisms/customer/order/OrderGrid"
import OrderList from "@/components/organisms/customer/order/OrderList"


interface OrderFilterState {
  search: string
  status: string
  dateRange: { from: Date | null; to: Date | null }
  deadlineRange: { from: Date | null; to: Date | null }
  startDateRange: { from: Date | null; to: Date | null }
}

interface OrderSortState {
  column: string
  direction: "asc" | "desc"
}

interface OrderHistoryTemplateProps {
  initialOrders?: Order[]
  isLoading?: boolean
  onRefresh?: () => void
  onOrderCreated?: () => void
}

// Utility function to parse ISO date with microseconds
const parseISODate = (dateString: string): Date => {
  try {
    // Handle the format: "2025-06-26T16:30:57.5444976"
    // JavaScript Date constructor can handle this format, but we might need to truncate microseconds
    const truncatedDate = dateString.replace(/(\.\d{3})\d*/, "$1") // Keep only 3 decimal places for milliseconds
    return new Date(truncatedDate)
  } catch (error) {
    console.error("Error parsing date:", dateString, error)
    return new Date(dateString) // Fallback to default parsing
  }
}

export default function OrderHistoryTemplate({
  initialOrders = [],
  isLoading = false,
  onRefresh,
  onOrderCreated,
}: OrderHistoryTemplateProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<OrderFilterState>({
    search: "",
    status: "",
    dateRange: { from: null, to: null },
    deadlineRange: { from: null, to: null },
    startDateRange: { from: null, to: null },
  })
  const [sort, setSort] = useState<OrderSortState>({
    column: "createdAt",
    direction: "desc",
  })

  // Apply filters and sorting
  useEffect(() => {
    if (!Array.isArray(orders)) return

    console.log("Applying filters:", filters)
    let result = [...orders]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (order: Order) =>
          order.orderID.toLowerCase().includes(searchLower) ||
          order.note.toLowerCase().includes(searchLower) ||
          order.customerID.toLowerCase().includes(searchLower) ||
          order.designerID.toLowerCase().includes(searchLower),
      )
    }

    // Status filter
    if (filters.status) {
      result = result.filter((order) => order.orderStatus === filters.status)
    }

    // Date range filter for createdAt
    if (filters.dateRange.from || filters.dateRange.to) {
      console.log("Applying created date range filter:", filters.dateRange)
      result = result.filter((order) => {
        const createdDate = parseISODate(order.createdAt)

        if (filters.dateRange.from && filters.dateRange.to) {
          const fromDate = new Date(filters.dateRange.from)
          const toDate = new Date(filters.dateRange.to)
          // Set time to start/end of day for proper comparison
          fromDate.setHours(0, 0, 0, 0)
          toDate.setHours(23, 59, 59, 999)

          return createdDate >= fromDate && createdDate <= toDate
        }

        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from)
          fromDate.setHours(0, 0, 0, 0)
          return createdDate >= fromDate
        }

        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          return createdDate <= toDate
        }

        return true
      })
    }

    // Date range filter for startDate
    if (filters.startDateRange.from || filters.startDateRange.to) {
      console.log("Applying start date range filter:", filters.startDateRange)
      result = result.filter((order) => {
        const startDate = parseISODate(order.startDate)

        if (filters.startDateRange.from && filters.startDateRange.to) {
          const fromDate = new Date(filters.startDateRange.from)
          const toDate = new Date(filters.startDateRange.to)
          // Set time to start/end of day for proper comparison
          fromDate.setHours(0, 0, 0, 0)
          toDate.setHours(23, 59, 59, 999)

          return startDate >= fromDate && startDate <= toDate
        }

        if (filters.startDateRange.from) {
          const fromDate = new Date(filters.startDateRange.from)
          fromDate.setHours(0, 0, 0, 0)
          return startDate >= fromDate
        }

        if (filters.startDateRange.to) {
          const toDate = new Date(filters.startDateRange.to)
          toDate.setHours(23, 59, 59, 999)
          return startDate <= toDate
        }

        return true
      })
    }

    // Date range filter for deadline
    if (filters.deadlineRange.from || filters.deadlineRange.to) {
      console.log("Applying deadline range filter:", filters.deadlineRange)
      result = result.filter((order) => {
        const deadlineDate = parseISODate(order.deadlineAt)

        if (filters.deadlineRange.from && filters.deadlineRange.to) {
          const fromDate = new Date(filters.deadlineRange.from)
          const toDate = new Date(filters.deadlineRange.to)
          // Set time to start/end of day for proper comparison
          fromDate.setHours(0, 0, 0, 0)
          toDate.setHours(23, 59, 59, 999)

          return deadlineDate >= fromDate && deadlineDate <= toDate
        }

        if (filters.deadlineRange.from) {
          const fromDate = new Date(filters.deadlineRange.from)
          fromDate.setHours(0, 0, 0, 0)
          return deadlineDate >= fromDate
        }

        if (filters.deadlineRange.to) {
          const toDate = new Date(filters.deadlineRange.to)
          toDate.setHours(23, 59, 59, 999)
          return deadlineDate <= toDate
        }

        return true
      })
    }

    // Apply sorting
    if (sort.column) {
      result.sort((a, b) => {
        let aValue: any = a[sort.column as keyof Order]
        let bValue: any = b[sort.column as keyof Order]

        // Handle date sorting with ISO format
        if (
          sort.column === "createdAt" ||
          sort.column === "updatedAt" ||
          sort.column === "startDate" ||
          sort.column === "deadlineAt" ||
          sort.column === "endDate"
        ) {
          aValue = parseISODate(aValue).getTime()
          bValue = parseISODate(bValue).getTime()
        }

        // Handle numeric sorting
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        // Handle string sorting
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sort.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        return 0
      })
    }

    console.log("Filtered result:", result.length, "orders")
    setFilteredOrders(result)
  }, [orders, filters, sort])

  // Update orders when initialOrders changes
  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  const handleView = (orderID: string) => {
    // Navigate to order detail page
    console.log("Navigate to order:", orderID)
  }

  const handleMessage = (orderID: string) => {
    // Open chat with designer/customer
    console.log("Open chat for order:", orderID)
  }

  // Statistics
  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.orderStatus === "Completed").length,
    inProgress: orders.filter((o) => o.orderStatus === "InProgress").length,
    pending: orders.filter((o) => o.orderStatus === "Pending").length,
    totalValue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Hoàn thành</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">Đang thực hiện</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Đang chờ</div>
          </div>
        </div>

        {/* Filters */}
        <OrderFilters
          isLoading={isLoading}
          onRefresh={onRefresh}
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          className="mb-8"
        />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Hiển thị {filteredOrders.length} trên {orders.length} đơn hàng
          </p>
        </div>

        {/* Orders Grid/List */}
        {viewMode === "grid" ? (
          <OrderGrid
            orders={filteredOrders}
            loading={isLoading}
            onView={handleView}
            onMessage={handleMessage}
            onOrderCreated={onOrderCreated}
          />
        ) : (
          <OrderList
            orders={filteredOrders}
            loading={isLoading}
            onView={handleView}
            onMessage={handleMessage}
            onOrderCreated={onOrderCreated}
          />
        )}

        {/* Load More */}
        {!isLoading && filteredOrders.length > 0 && filteredOrders.length >= 20 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Xem thêm đơn hàng
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
