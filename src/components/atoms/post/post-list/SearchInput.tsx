"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm...",
  className = "",
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChange(inputValue)
      onSearch()
    }
  }

  const handleClear = () => {
    setInputValue("")
    onChange("")
    onSearch()
  }

  const handleSearchClick = () => {
    onChange(inputValue)
    onSearch()
  }

  return (
    <div className={`relative flex w-full items-center ${className}`}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pr-16 rounded-r-none border-r-0"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-[50px] text-gray-400 hover:text-gray-600"
          aria-label="Xóa tìm kiếm"
        >
          <X size={16} />
        </button>
      )}
      <Button type="button" onClick={handleSearchClick} className="rounded-l-none bg-blue-600 hover:bg-blue-700">
        <Search size={18} />
        <span className="sr-only">Tìm kiếm</span>
      </Button>
    </div>
  )
}
