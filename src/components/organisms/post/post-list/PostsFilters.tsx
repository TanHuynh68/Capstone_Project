"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchInput from "@/components/atoms/post/post-list/SearchInput";
import FilterDropdown from "@/components/molecules/home/FilterDropdown";
import { USER_ROUTES } from "@/routes/path";
import {  useCurrentUser } from "@/components/utils";
import { ROLE } from "@/constants";

interface PostsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: number | undefined;
  onStatusChange: (value: number | undefined) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onSearch: () => void;
  className?: string;
}

export default function PostsFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSearch,
  className = "",
}: PostsFiltersProps) {
  const [activeTab, setActiveTab] = useState<string>(
    status === undefined ? "all" : status.toString()
  );
  const [activeSortOption, setActiveSortOption] = useState<string>(
    `${sortBy}-${sortOrder}`
  );

  useEffect(() => {
    setActiveTab(status === undefined ? "all" : status.toString());
  }, [status]);

  useEffect(() => {
    setActiveSortOption(`${sortBy}-${sortOrder}`);
  }, [sortBy, sortOrder]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onStatusChange(value === "all" ? undefined : Number.parseInt(value));
  };

  const handleSortChange = (value: string) => {
    setActiveSortOption(value);
    const [newSortBy, newSortOrder] = value.split("-") as [
      string,
      "asc" | "desc"
    ];
    onSortChange(newSortBy, newSortOrder);
  };

  const sortOptions = [
    { value: "createdAt-desc", label: "Mới nhất" },
    { value: "createdAt-asc", label: "Cũ nhất" },
    { value: "suggestedPrice-desc", label: "Giá cao nhất" },
    { value: "suggestedPrice-asc", label: "Giá thấp nhất" },
    { value: "title-asc", label: "Tên A-Z" },
    { value: "title-desc", label: "Tên Z-A" },
  ];
  const RedirectToCreatePostPage = ()=>{
    window.location.href = USER_ROUTES.CUSTOMER_UPLOAD_PAGE
  }
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Tài nguyên và Bài đăng
        </h1>
        {
         useCurrentUser().role === ROLE.CUSTOMER && <Button
          onClick={RedirectToCreatePostPage}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Tạo bài đăng mới
        </Button>
        }
      </div>

      <p className="text-gray-500">
        Khám phá các bài đăng, tài nguyên, công nghệ và hướng dẫn.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          onSearch={onSearch}
          placeholder="Tìm kiếm bài đăng..."
          className="w-full sm:max-w-md"
        />

        <div className="flex-1 flex justify-end">
          <FilterDropdown
            label="Sắp xếp theo"
            options={sortOptions}
            value={activeSortOption}
            onChange={handleSortChange}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="1"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            Đang hoạt động
          </TabsTrigger>
          <TabsTrigger
            value="2"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            Đang xử lý
          </TabsTrigger>
          <TabsTrigger
            value="3"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            Đã kết thúc
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
