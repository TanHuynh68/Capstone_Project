import { Star, StarHalf } from "lucide-react"

interface RatingProps {
  value: number
  max?: number
  count?: number
  className?: string
}

export default function Rating({ value, max = 5, count, className = "" }: RatingProps) {
  // Calculate full and half stars
  const fullStars = Math.floor(value)
  const hasHalfStar = value % 1 >= 0.5

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex text-yellow-400">
        {Array.from({ length: max }).map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="h-4 w-4 fill-current" />
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className="h-4 w-4 fill-current" />
          } else {
            return <Star key={i} className="h-4 w-4 text-gray-300" />
          }
        })}
      </div>

      {count !== undefined && <span className="ml-1 text-xs text-gray-500">({count})</span>}
    </div>
  )
}
