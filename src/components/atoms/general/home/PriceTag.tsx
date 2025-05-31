interface PriceTagProps {
  currentPrice: number
  originalPrice?: number
  discount?: number
  currency?: string
  className?: string
}

export default function PriceTag({
  currentPrice,
  originalPrice,
  discount,
  currency = "đ",
  className = "",
}: PriceTagProps) {
  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-medium text-gray-900">
        {formatPrice(currentPrice)}
        {currency}
      </span>

      {originalPrice && (
        <span className="ml-2 text-sm text-gray-500 line-through">
          {formatPrice(originalPrice)}
          {currency}
        </span>
      )}

      {discount && <span className="ml-2 text-xs text-green-600">({discount}% giảm)</span>}
    </div>
  )
}
