"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, CalendarIcon, LayoutGrid, List, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ORDER_STATUSES } from "@/constants"
import { CalendarCustom } from "./CalendarCustom"

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

interface OrderFiltersProps {
  filters: OrderFilterState
  onFiltersChange: (filters: OrderFilterState) => void
  sort: OrderSortState
  onSortChange: (sort: OrderSortState) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  className?: string
  isLoading: boolean
  onRefresh: any
}

export default function OrderFilters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  className = "",
  isLoading,
  onRefresh,
}: OrderFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value === "all" ? "" : value })
  }

  const handleDateRangeChange = (type: "from" | "to", date: Date | undefined) => {
    console.log(`Date range ${type} changed:`, date)
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: date || null,
      },
    })
  }

  const handleDeadlineRangeChange = (type: "from" | "to", date: Date | undefined) => {
    console.log(`Deadline range ${type} changed:`, date)
    onFiltersChange({
      ...filters,
      deadlineRange: {
        ...filters.deadlineRange,
        [type]: date || null,
      },
    })
  }

  const handleStartDateRangeChange = (type: "from" | "to", date: Date | undefined) => {
    console.log(`Start date range ${type} changed:`, date)
    onFiltersChange({
      ...filters,
      startDateRange: {
        ...filters.startDateRange,
        [type]: date || null,
      },
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "",
      dateRange: { from: null, to: null },
      deadlineRange: { from: null, to: null },
      startDateRange: { from: null, to: null },
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Debug Panel - Development Only */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs">
          <h4 className="font-semibold mb-2">Debug - Current Filters:</h4>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <strong>Created Date:</strong>
              <br />
              {filters.dateRange.from ? format(filters.dateRange.from, "dd/MM/yyyy") : "null"} -
              {filters.dateRange.to ? format(filters.dateRange.to, "dd/MM/yyyy") : "null"}
            </div>
            <div>
              <strong>Deadline:</strong>
              <br />
              {filters.deadlineRange.from ? format(filters.deadlineRange.from, "dd/MM/yyyy") : "null"} -
              {filters.deadlineRange.to ? format(filters.deadlineRange.to, "dd/MM/yyyy") : "null"}
            </div>
            <div>
              <strong>Start Date:</strong>
              <br />
              {filters.startDateRange.from ? format(filters.startDateRange.from, "dd/MM/yyyy") : "null"} -
              {filters.startDateRange.to ? format(filters.startDateRange.to, "dd/MM/yyyy") : "null"}
            </div>
          </div>
        </div>
      )}

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
        <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
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

        {/* Date Range Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* Created Date Range */}
          <Popover>
            <PopoverTrigger >
              <Button variant="outline" className="w-full sm:w-auto justify-start text-left bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "dd MMM", { locale: vi })} -{" "}
                      {format(filters.dateRange.to, "dd MMM", { locale: vi })}
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
              <CalendarCustom
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from || undefined}
                selected={{
                  from: filters.dateRange.from || undefined,
                  to: filters.dateRange.to || undefined,
                }}
                onSelect={(range) => {
                  console.log("Date range selected:", range)
                  if (range) {
                    handleDateRangeChange("from", range.from)
                    handleDateRangeChange("to", range.to)
                  } else {
                    handleDateRangeChange("from", undefined)
                    handleDateRangeChange("to", undefined)
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Start Date Range */}
          <Popover>
            <PopoverTrigger >
              <Button variant="outline" className="w-full sm:w-auto justify-start text-left bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDateRange.from ? (
                  filters.startDateRange.to ? (
                    <>
                      {format(filters.startDateRange.from, "dd MMM", { locale: vi })} -{" "}
                      {format(filters.startDateRange.to, "dd MMM", { locale: vi })}
                    </>
                  ) : (
                    format(filters.startDateRange.from, "dd MMM yyyy", {
                      locale: vi,
                    })
                  )
                ) : (
                  "Ngày bắt đầu"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarCustom
                initialFocus
                mode="range"
                defaultMonth={filters.startDateRange.from || undefined}
                selected={{
                  from: filters.startDateRange.from || undefined,
                  to: filters.startDateRange.to || undefined,
                }}
                onSelect={(range) => {
                  console.log("Start date range selected:", range)
                  if (range) {
                    handleStartDateRangeChange("from", range.from)
                    handleStartDateRangeChange("to", range.to)
                  } else {
                    handleStartDateRangeChange("from", undefined)
                    handleStartDateRangeChange("to", undefined)
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Deadline Range */}
          <Popover>
            <PopoverTrigger >
              <Button variant="outline" className="w-full sm:w-auto justify-start text-left bg-transparent">
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
              <CalendarCustom
                initialFocus
                mode="range"
                defaultMonth={filters.deadlineRange.from || undefined}
                selected={{
                  from: filters.deadlineRange.from || undefined,
                  to: filters.deadlineRange.to || undefined,
                }}
                onSelect={(range) => {
                  console.log("Deadline range selected:", range)
                  if (range) {
                    handleDeadlineRangeChange("from", range.from)
                    handleDeadlineRangeChange("to", range.to)
                  } else {
                    handleDeadlineRangeChange("from", undefined)
                    handleDeadlineRangeChange("to", undefined)
                  }
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
              const [column, direction] = value.split("-")
              onSortChange({
                column: column as any,
                direction: direction as "asc" | "desc",
              })
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
            <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
            <SelectItem value="startDate-asc">Bắt đầu sớm nhất</SelectItem>
            <SelectItem value="startDate-desc">Bắt đầu muộn nhất</SelectItem>
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

        <Button onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>
    </div>
  )
}
