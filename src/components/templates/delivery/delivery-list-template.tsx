import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterSection } from "@/components/organisms/getdelivery/filter-section";
import { DeliveryGrid } from "@/components/organisms/getdelivery/delivery-grid";
import { DeliveryTable } from "@/components/organisms/getdelivery/delivery-table";
import { Package } from "lucide-react";
import type { DeliveryItem } from "@/components/organisms/delivery/delivery-by-token";
import { DataTablePagination } from "@/components/organisms/customer/transaction-history/data-table-pagination";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

interface DeliveryListTemplateProps {
  title: string;
  deliveries: DeliveryItem[];
  loading: boolean;
  error: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onRefresh: () => void;
  onViewDetails?: (delivery: DeliveryItem) => void;
  totalCount?: number;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const DeliveryListTemplate: React.FC<DeliveryListTemplateProps> = ({
  title,
  deliveries,
  loading,
  error,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  onViewDetails,
  totalCount,
  pageIndex,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}) => {
  // Tạo table object cho DataTablePagination
  const table = useReactTable({
    data: deliveries,
    columns: [],
    pageCount,
    state: {
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({ pageIndex, pageSize });
        if (next.pageIndex !== pageIndex) onPageChange(next.pageIndex);
        if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize);
      } else {
        if (updater.pageIndex !== pageIndex) onPageChange(updater.pageIndex);
        if (updater.pageSize !== pageSize) onPageSizeChange(updater.pageSize);
      }
    },
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">
              Đang tải dữ liệu giao hàng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              {title}
              {totalCount !== undefined && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalCount} đơn hàng)
                </span>
              )}
            </CardTitle>
            {/* <ShippingFormDialog onSuccess={onRefresh} /> */}
          </div>
        </CardHeader>
        <CardContent>
          <FilterSection
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            onRefresh={onRefresh}
            isLoading={loading}
          />
        </CardContent>
      </Card>

      {viewMode === "grid" ? (
        <>
          <DeliveryGrid
            deliveries={deliveries}
            onViewDetails={onViewDetails}
            searchTerm={searchValue}
          />
          <div className="py-4">
            <DataTablePagination table={table} />
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-0">
            <DeliveryTable
              deliveries={deliveries}
              onViewDetails={onViewDetails}
              searchTerm={searchValue}
            />
            <div className="py-4">
              <DataTablePagination table={table} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
