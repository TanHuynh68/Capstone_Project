// components/posts/organisms/post-filters.tsx

import { FilterDropdown } from "@/components/molecules/post/post-of-customer/FilterDropdown";
import { DateRangePicker } from "@/components/molecules/post/post-of-customer/DateRangePicker";
import { SearchBar } from "@/components/molecules/post/post-of-customer/SearchBar";

interface PostFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "pending", label: "Đang chờ" },
  { value: "completed", label: "Hoàn thành" },
  { value: "rejected", label: "Từ chối" },
];

export function PostFilters({ filters, onFiltersChange }: PostFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleStatusChange = (status: string) => {
   if(status && status!=''){
     onFiltersChange({ ...filters, status });
   }
  };

  const handleDateRangeChange = (dateRange: {
    from: Date | null;
    to: Date | null;
  }) => {
    onFiltersChange({ ...filters, dateRange });
  };

  const handleEndDateRangeChange = (endDateRange: {
    from: Date | null;
    to: Date | null;
  }) => {
    onFiltersChange({ ...filters, endDateRange });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tiêu đề, mô tả, tên..."
        />
        <FilterDropdown
          value={filters.status}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          placeholder="Trạng thái"
        />
        <DateRangePicker
          dateRange={filters.dateRange}
          onChange={handleDateRangeChange}
          placeholder="Ngày tạo"
        />
        <DateRangePicker
          dateRange={filters.endDateRange}
          onChange={handleEndDateRangeChange}
          placeholder="Ngày kết thúc"
        />
      </div>
    </div>
  );
}
