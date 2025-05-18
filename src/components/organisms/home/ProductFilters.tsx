"use client"

import FilterDropdown from "@/components/molecules/home/FilterDropdown"
import FilterButton from "@/components/molecules/home/FilterButton"

interface ProductFiltersProps {
  priceRange: string
  onPriceRangeChange: (value: string) => void
  seller: string
  onSellerChange: (value: string) => void
  shipsFromVietnam: boolean
  onShipsFromVietnamChange: () => void
  sortBy: string
  onSortByChange: (value: string) => void
  className?: string
}

export default function ProductFilters({
  priceRange,
  onPriceRangeChange,
  seller,
  onSellerChange,
  shipsFromVietnam,
  onShipsFromVietnamChange,
  sortBy,
  onSortByChange,
  className = "",
}: ProductFiltersProps) {
    
  const priceOptions = [
    { value: "all", label: "Tất cả" },
    { value: "0-100000", label: "Dưới 100,000đ" },
    { value: "100000-500000", label: "100,000đ - 500,000đ" },
    { value: "500000-1000000", label: "500,000đ - 1,000,000đ" },
    { value: "1000000-5000000", label: "1,000,000đ - 5,000,000đ" },
    { value: "5000000+", label: "Trên 5,000,000đ" },
  ]

  const sellerOptions = [
    { value: "all", label: "Tất cả" },
    { value: "verified", label: "Đã xác minh" },
    { value: "top_rated", label: "Đánh giá cao" },
    { value: "local", label: "Trong nước" },
    { value: "international", label: "Quốc tế" },
  ]

  const sortOptions = [
    { value: "relevancy", label: "Liên quan" },
    { value: "price_asc", label: "Giá tăng dần" },
    { value: "price_desc", label: "Giá giảm dần" },
    { value: "newest", label: "Mới nhất" },
    { value: "rating", label: "Đánh giá cao" },
  ]

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown label="Giá" options={priceOptions} value={priceRange} onChange={onPriceRangeChange} />

        <FilterDropdown label="Người bán" options={sellerOptions} value={seller} onChange={onSellerChange} />

        <FilterButton label="Giao từ Việt Nam" active={shipsFromVietnam} onToggle={onShipsFromVietnamChange} />
      </div>

      <div className="ml-auto">
        <FilterDropdown label="Sắp xếp theo" options={sortOptions} value={sortBy} onChange={onSortByChange} />
      </div>
    </div>
  )
}
