"use client";

import type React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đã lấy hàng", value: "Picked" },
  { label: "Đang giao", value: "Delivering" },
  { label: "Đã giao", value: "Delivered" },
  { label: "Đã hủy", value: "Cancelled" },
];

export const StatusFilter: React.FC<StatusFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chọn trạng thái" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
