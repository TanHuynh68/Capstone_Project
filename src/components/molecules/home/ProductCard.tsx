import { Link } from "react-router-dom"
import ProductImage from "@/components/atoms/home/ProductImage"
import Rating from "@/components/atoms/home/Rating"
import PriceTag from "@/components/atoms/home/PriceTag"
// import Badge from "@/components/atoms/Badge"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface Product {
  id: string
  title: string
  image: string
  rating: number
  reviewCount: number
  currentPrice: number
  originalPrice?: number
  discount?: number
  freeShipping?: boolean
  location?: string
  seller?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    title,
    image,
    rating,
    reviewCount,
    currentPrice,
    originalPrice,
    discount,
    freeShipping,
    location,
    // seller,
  } = product

  // Truncate title if it's too long
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 60)}...` : title

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md">
      <Link to={`/product/${id}`} className="relative pt-[100%]">
        <div className="absolute inset-0 p-2">
          <ProductImage src={image} alt={title} className="h-full w-full" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${id}`} className="mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{truncatedTitle}</h3>
        </Link>

        <div className="mb-2">
          <Rating value={rating} count={reviewCount} />
        </div>

        <div className="mt-auto">
          <PriceTag currentPrice={currentPrice} originalPrice={originalPrice} discount={discount} className="mb-2" />

          <div className="flex flex-wrap items-center gap-2">
            {freeShipping && (
              <Badge variant="success" className="text-[10px]">
                MIỄN PHÍ VẬN CHUYỂN
              </Badge>
            )}

            {location && (
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="mr-1 h-3 w-3" />
                <span>Giao từ {location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
