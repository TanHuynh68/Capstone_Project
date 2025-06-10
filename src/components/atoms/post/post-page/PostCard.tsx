"use client"  

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onView?: (postId: string) => void
  className?: string
}

export default function PostCard({ post, onView, className = "" }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleView = () => {
    onView?.(post.projectPostID)
  }


  // Get the main image to display (prefer original, fallback to first requested)
  const getMainImage = () => {
    if (post.originalImages && post.originalImages.length > 0) {
      return post.originalImages[0].imageUrl
    }
    if (post.requestedImages && post.requestedImages.length > 0) {
      return post.requestedImages[0].imageUrl
    }
    return "/placeholder.svg?height=300&width=400"
  }

  // // Calculate days remaining
  // const getDaysRemaining = () => {
  //   const endDate = new Date(post.endAt)
  //   const now = new Date()
  //   const diffTime = endDate.getTime() - now.getTime()
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  //   return diffDays
  // }

  return (
    <div
      className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={getMainImage() || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Days Remaining */}
        {/* {daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
              {daysRemaining} ngày còn lại
            </Badge>
          </div>
        )} */}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-white/80 text-sm line-clamp-2 mb-3">{post.description}</p>

            {/* Image Count */}
            <div className="flex items-center gap-4 text-white/80 text-xs">
              {post.originalImages.length > 0 && <span>{post.originalImages.length} ảnh gốc</span>}
              {post.requestedImages.length > 0 && <span>{post.requestedImages.length} ảnh yêu cầu</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.fullName || "User"} />
              <AvatarFallback className="text-xs">{post.fullName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 truncate">{post.fullName || "Người dùng ẩn danh"}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
         
        </div>

        {/* Price Info */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className=" text-gray-500">Giá đề xuất: </span>
              <p className="font-semibold text-green-600">{post.suggestedPrice.toLocaleString()}đ</p>
            </div>
            {/* <div className="text-right">
              <span className="text-xs text-gray-500">Giá trị</span>
              <p className="font-medium text-gray-700">{post.itemValue.toLocaleString()}đ</p>
            </div> */}
          </div>
        </div>

        {/* Finish Date */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Hoàn thành: {new Date(post.finishDate).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
