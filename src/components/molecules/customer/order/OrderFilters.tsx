"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, CalendarIcon, LayoutGrid, List } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ORDER_STATUSES } from "@/constants";

interface OrderFiltersProps {
  filters: OrderFilterState;
  onFiltersChange: (filters: OrderFilterState) => void;
  sort: OrderSortState;
  onSortChange: (sort: OrderSortState) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}

export default function OrderFilters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  className = "",
}: OrderFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value === "all" ? "" : value });
  };

  const handleDateRangeChange = (
    type: "from" | "to",
    date: Date | undefined
  ) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: date || null,
      },
    });
  };

  const handleDeadlineRangeChange = (
    type: "from" | "to",
    date: Date | undefined
  ) => {
    onFiltersChange({
      ...filters,
      deadlineRange: {
        ...filters.deadlineRange,
        [type]: date || null,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "",
      dateRange: { from: null, to: null },
      deadlineRange: { from: null, to: null },
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo ID đơn hàng hoặc ghi chú..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 w-8 p-0"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {Object.entries(ORDER_STATUSES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "dd MMM", { locale: vi })}{" "}
                      - {format(filters.dateRange.to, "dd MMM", { locale: vi })}
                    </>
                  ) : (
                    format(filters.dateRange.from, "dd MMM yyyy", {
                      locale: vi,
                    })
                  )
                ) : (
                  "Ngày tạo"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from || undefined}
                selected={{
                  from: filters.dateRange.from || undefined,
                  to: filters.dateRange.to || undefined,
                }}
                onSelect={(range) => {
                  handleDateRangeChange("from", range?.from);
                  handleDateRangeChange("to", range?.to);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.deadlineRange.from ? (
                  filters.deadlineRange.to ? (
                    <>
                      {format(filters.deadlineRange.from, "dd MMM", {
                        locale: vi,
                      })}{" "}
                      -{" "}
                      {format(filters.deadlineRange.to, "dd MMM", {
                        locale: vi,
                      })}
                    </>
                  ) : (
                    format(filters.deadlineRange.from, "dd MMM yyyy", {
                      locale: vi,
                    })
                  )
                ) : (
                  "Deadline"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.deadlineRange.from || undefined}
                selected={{
                  from: filters.deadlineRange.from || undefined,
                  to: filters.deadlineRange.to || undefined,
                }}
                onSelect={(range) => {
                  handleDeadlineRangeChange("from", range?.from);
                  handleDeadlineRangeChange("to", range?.to);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort */}
        <Select
          value={sort.column ? `${sort.column}-${sort.direction}` : ""}
          onValueChange={(value) => {
            if (value) {
              const [column, direction] = value.split("-");
              onSortChange({
                column: column as any,
                direction: direction as "asc" | "desc",
              });
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
            <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
            <SelectItem value="deadlineAt-asc">Deadline gần nhất</SelectItem>
            <SelectItem value="deadlineAt-desc">Deadline xa nhất</SelectItem>
            <SelectItem value="totalPrice-desc">Giá cao nhất</SelectItem>
            <SelectItem value="totalPrice-asc">Giá thấp nhất</SelectItem>
            <SelectItem value="updatedAt-desc">Cập nhật gần nhất</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button variant="outline" onClick={clearFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
}
