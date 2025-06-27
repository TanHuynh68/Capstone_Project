import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import OrderFilters from "@/components/molecules/customer/order/OrderFilters";
import OrderGrid from "@/components/organisms/customer/order/OrderGrid";
import OrderList from "@/components/organisms/customer/order/OrderList";

interface OrderHistoryTemplateProps {
  initialOrders?: Order[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function OrderHistoryTemplate({
  initialOrders = [],
  isLoading = false,
  onRefresh,
}: OrderHistoryTemplateProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<OrderFilterState>({
    search: "",
    status: "",
    dateRange: { from: null, to: null },
    deadlineRange: { from: null, to: null },
  });

  const [sort, setSort] = useState<OrderSortState>({
    column: "createdAt",
    direction: "desc",
  });

  // Apply filters and sorting
  useEffect(() => {
    if (!Array.isArray(orders)) return;

    let result = [...orders];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (order: Order) =>
          order.orderID.toLowerCase().includes(searchLower) ||
          order.note.toLowerCase().includes(searchLower) ||
          order.customerID.toLowerCase().includes(searchLower) ||
          order.designerID.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter((order) => order.orderStatus === filters.status);
    }

    // Date range filter for createdAt
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter((order) => {
        const createdDate = new Date(order.createdAt);

        if (filters.dateRange.from && filters.dateRange.to) {
          return (
            createdDate >= filters.dateRange.from &&
            createdDate <= filters.dateRange.to
          );
        }

        if (filters.dateRange.from) {
          return createdDate >= filters.dateRange.from;
        }

        if (filters.dateRange.to) {
          return createdDate <= filters.dateRange.to;
        }

        return true;
      });
    }

    // Date range filter for deadline
    if (filters.deadlineRange.from || filters.deadlineRange.to) {
      result = result.filter((order) => {
        const deadlineDate = new Date(order.deadlineAt);

        if (filters.deadlineRange.from && filters.deadlineRange.to) {
          return (
            deadlineDate >= filters.deadlineRange.from &&
            deadlineDate <= filters.deadlineRange.to
          );
        }

        if (filters.deadlineRange.from) {
          return deadlineDate >= filters.deadlineRange.from;
        }

        if (filters.deadlineRange.to) {
          return deadlineDate <= filters.deadlineRange.to;
        }

        return true;
      });
    }

    // Apply sorting
    if (sort.column) {
      result.sort((a, b) => {
        let aValue: any = a[sort.column as keyof Order];
        let bValue: any = b[sort.column as keyof Order];

        // Handle date sorting
        if (
          sort.column === "createdAt" ||
          sort.column === "updatedAt" ||
          sort.column === "startDate" ||
          sort.column === "deadlineAt" ||
          sort.column === "endDate"
        ) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        // Handle numeric sorting
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Handle string sorting
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sort.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    setFilteredOrders(result);
  }, [orders, filters, sort]);

  // Update orders when initialOrders changes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleView = (orderID: string) => {
    // Navigate to order detail page
    console.log("Navigate to order:", orderID);
  };

  const handleMessage = (orderID: string) => {
    // Open chat with designer/customer
    console.log("Open chat for order:", orderID);
  };

  // Statistics
  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.orderStatus === "Completed").length,
    inProgress: orders.filter((o) => o.orderStatus === "InProgress").length,
    pending: orders.filter((o) => o.orderStatus === "Pending").length,
    totalValue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6"></div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Tổng đơn hàng</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
            <div className="text-sm text-gray-600">Đang thực hiện</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Đang chờ</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
              }).format(stats.totalValue)}
            </div>
            <div className="text-sm text-gray-600">Tổng giá trị</div>
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
          <p className="text-gray-600">
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
          />
        ) : (
          <OrderList
            orders={filteredOrders}
            loading={isLoading}
            onView={handleView}
            onMessage={handleMessage}
          />
        )}

        {/* Load More */}
        {!isLoading &&
          filteredOrders.length > 0 &&
          filteredOrders.length >= 20 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Xem thêm đơn hàng
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
