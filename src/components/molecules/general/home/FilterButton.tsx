"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterButtonProps {
  label: string
  active?: boolean
  onToggle: () => void
  className?: string
}

export default function FilterButton({ label, active = false, onToggle, className = "" }: FilterButtonProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      className={`flex items-center justify-between border-gray-300 ${
        active ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white hover:bg-gray-50"
      } ${className}`}
      onClick={onToggle}
    >
      <span className="mr-1">{label}</span>
      {active && <X className="ml-1 h-3 w-3" />}
    </Button>
  )
}
