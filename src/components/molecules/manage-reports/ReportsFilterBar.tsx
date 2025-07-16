"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { REPORT_STATUSES, REPORT_TYPES } from "@/constants/reports.constants";

interface ReportsFilterBarProps {
  filters: TableFilters;
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: Partial<TableFilters>) => void;
}

const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  filters,
  onSearch,
  onFilterChange,
}) => {
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  const handleSearchSubmit = () => {
    onSearch(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative w-full max-w-xs">
          <Input
            placeholder="Tìm theo reporter, title, ID..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
            size={18}
            onClick={handleSearchSubmit}
          />
        </div>

        <Select
          value={filters.reportType}
          onValueChange={(val) => onFilterChange({ reportType: val })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn loại tố cáo" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.reportStatus}
          onValueChange={(val) => onFilterChange({ reportStatus: val })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ReportsFilterBar;
