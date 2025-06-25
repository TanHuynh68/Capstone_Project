"use client";

import type React from "react";

import { SearchBar } from "@/components/molecules/getdelivery/search-bar";
import { StatusFilter } from "@/components/molecules/getdelivery/status-filter";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, RefreshCw } from "lucide-react";

interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Tìm kiếm theo mã, tên, ghi chú..."
        />
        <StatusFilter value={statusFilter} onChange={onStatusFilterChange} />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>

        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
