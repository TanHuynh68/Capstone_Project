import ProductCard, { type Product } from "@/components/molecules/home/ProductCard"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  className?: string
}

export default function ProductGrid({ products, loading = false, className = "" }: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="relative pt-[100%]">
              <div className="absolute inset-0 p-2">
                <div className="h-full w-full animate-pulse rounded-md bg-gray-200"></div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-4 h-4 w-1/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-white">
        <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
