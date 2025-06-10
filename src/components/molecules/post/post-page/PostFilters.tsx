"use client"

import { Search, Filter, SlidersHorizontal, Grid, List, ToggleLeft, ToggleRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  className?: string
}

export default function PostFilters({
  filters,
  onFiltersChange,
  onSortChange,
  viewMode,
  onViewModeChange,
  className = "",
}: PostFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handleActiveToggle = () => {
    onFiltersChange({
      ...filters,
      isActive: filters.isActive === undefined ? true : filters.isActive ? false : undefined,
    })
  }

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    onSortChange({ column, direction })
  }

  const getActiveFilterText = () => {
    if (filters.isActive === true) return "Chỉ bài đang hoạt động"
    if (filters.isActive === false) return "Chỉ bài không hoạt động"
    return "Tất cả bài đăng"
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${className}`}>
      {/* Left side - Search and Filters */}
      <div className="flex flex-1 gap-3 items-center">
        {/* Filter Button */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange("")}>Tất cả</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("1")}>Đang hoạt động</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("2")}>Đang xử lý</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("3")}>Đã kết thúc</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Trạng thái hoạt động</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleActiveToggle} className="flex items-center justify-between">
              <span>{getActiveFilterText()}</span>
              {filters.isActive === true ? (
                <ToggleRight className="h-4 w-4 text-green-500" />
              ) : filters.isActive === false ? (
                <ToggleLeft className="h-4 w-4 text-red-500" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-gray-400" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm dự án..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Right side - Sort and View Options */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSortChange("createdAt", "desc")}>Mới nhất</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("createdAt", "asc")}>Cũ nhất</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("suggestedPrice", "desc")}>Giá cao nhất</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("suggestedPrice", "asc")}>Giá thấp nhất</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("itemValue", "desc")}>Giá trị cao nhất</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("itemValue", "asc")}>Giá trị thấp nhất</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("endAt", "asc")}>Sắp hết hạn</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("finishDate", "asc")}>
              Hoàn thành sớm nhất
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("title", "asc")}>Tên A-Z</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("title", "desc")}>Tên Z-A</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
