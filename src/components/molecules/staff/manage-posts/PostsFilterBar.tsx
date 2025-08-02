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

interface PostsFilterBarProps {
  filters: PostsTableFilters;
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: Partial<PostsTableFilters>) => void;
}

const PostsFilterBar: React.FC<PostsFilterBarProps> = ({
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
            placeholder="Tìm theo tiêu đề, tên người đăng..."
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
          value={filters.isActive}
          onValueChange={(val) => onFilterChange({ isActive: val })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="true">Đang hoạt động</SelectItem>
            <SelectItem value="false">Đã vô hiệu hóa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(val) => {
            const [sortBy, sortOrder] = val.split("-");
            onFilterChange({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
            <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
            <SelectItem value="title-asc">Tiêu đề A-Z</SelectItem>
            <SelectItem value="title-desc">Tiêu đề Z-A</SelectItem>
            <SelectItem value="fullName-asc">Tên người đăng A-Z</SelectItem>
            <SelectItem value="fullName-desc">Tên người đăng Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PostsFilterBar;
