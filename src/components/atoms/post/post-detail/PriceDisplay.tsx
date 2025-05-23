import { formatCurrencyVND } from "@/components/utils"

interface PriceDisplayProps {
  value: number
  label: string
  currency?: string
  className?: string
}

export default function PriceDisplay({ value, label, currency = "đ", className = "" }: PriceDisplayProps) {
  
  return (
    <div className={`text-center ${className}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {formatCurrencyVND(value)}
        <span className="text-lg font-normal text-gray-600 ml-1">{currency}</span>
      </p>
    </div>
  )
}
