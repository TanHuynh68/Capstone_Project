import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import OrderFilters from "@/components/molecules/customer/order/OrderFilters";
import OrderGrid from "@/components/organisms/customer/order/OrderGrid";
import OrderList from "@/components/organisms/customer/order/OrderList";

interface OrderHistoryTemplateProps {
  initialOrders?: Order[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onOrderCreated?: () => void;
}

export default function OrderHistoryTemplate({
  initialOrders = [],
  isLoading = false,
  onRefresh,
  onOrderCreated,
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
    inProgress: orders.filter((o) => o.orderStatus != "Done" && o.orderStatus != "Rejected").length,
    pending: orders.filter((o) => o.orderStatus === "Pending").length,
    totalValue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    rejected: orders.filter((o) => o.orderStatus === "Rejected").length,
    done: orders.filter((o) => o.orderStatus === "Done").length,
  };

  return (
    <div className="bg-background">
      {/* Header */}

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.done}
            </div>
            <div className="text-sm text-muted-foreground">Hoàn thành</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.inProgress}
            </div>
            <div className="text-sm text-muted-foreground">Đang thực hiện</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.rejected}
            </div>
            <div className="text-sm text-muted-foreground">Bị hủy</div>
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
