"use client"

import { useState, useEffect } from "react"
import ProductFilters from "@/components/organisms/home/ProductFilters"
import ProductGrid from "@/components/organisms/home/ProductGrid"
import Pagination from "@/components/molecules/home/Pagination"
import type { Product } from "@/components/molecules/home/ProductCard"
import { mockProducts } from "./data"

export default function HomeTemplate() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [priceRange, setPriceRange] = useState("all")
  const [seller, setSeller] = useState("all")
  const [shipsFromVietnam, setShipsFromVietnam] = useState(false)
  const [sortBy, setSortBy] = useState("relevancy")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10 // 2 rows of 5 products

  // Load products
  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProducts(mockProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Filter by price range
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)

      if (max) {
        result = result.filter((product) => product.currentPrice >= min && product.currentPrice < max)
      } else {
        // For "5000000+" case
        result = result.filter((product) => product.currentPrice >= min)
      }
    }

    // Filter by seller
    if (seller !== "all") {
      // This would be more complex in a real app
      if (seller === "local") {
        result = result.filter((product) => product.location === "VN")
      } else if (seller === "international") {
        result = result.filter((product) => product.location !== "VN")
      }
    }

    // Filter by ships from Vietnam
    if (shipsFromVietnam) {
      result = result.filter((product) => product.location === "VN")
    }

    // Apply sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.currentPrice - b.currentPrice)
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.currentPrice - a.currentPrice)
    } else if (sortBy === "newest") {
      // In a real app, you would sort by date
      result.sort((a, b) => b.id.localeCompare(a.id))
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, priceRange, seller, shipsFromVietnam, sortBy])

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Khám phá các thiết kế búp bê</h2>

          <ProductFilters
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            seller={seller}
            onSellerChange={setSeller}
            shipsFromVietnam={shipsFromVietnam}
            onShipsFromVietnamChange={() => setShipsFromVietnam(!shipsFromVietnam)}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            className="mb-6"
          />

          <ProductGrid products={currentProducts} loading={loading} className="mb-8" />

          {!loading && filteredProducts.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
    </div>
  )
}
