"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  className?: string
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  className = "",
}: CategoryTabsProps) {
  return (
    <ScrollArea className={`w-full whitespace-nowrap ${className}`}>
      <div className="flex w-max space-x-2 p-1">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
