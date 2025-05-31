"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function FilterDropdown({ label, options, value, onChange, className = "" }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (newValue: string) => {
    onChange(newValue)
    setOpen(false)
  }

  // Find the selected option label
  const selectedOption = options.find((option) => option.value === value)
  const displayLabel = selectedOption ? `${label}: ${selectedOption.label}` : label

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger >
        <Button
          variant="outline"
          className={`flex items-center justify-between border-gray-300 bg-white hover:bg-gray-50 ${className}`}
        >
          <span className="mr-1 truncate">{displayLabel}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={handleSelect}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
