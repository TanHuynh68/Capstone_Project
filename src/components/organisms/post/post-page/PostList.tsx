"use client"

import { Heart, Eye, Calendar, ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PostListProps {
  posts: Post[]
  loading?: boolean
  onView?: (postId: string) => void
  className?: string
}

export default function PostList({ posts, loading = false, onView, className = "" }: PostListProps) {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Đang hoạt động</Badge>
      case 2:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Đang xử lý</Badge>
      case 3:
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">Đã kết thúc</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getMainImage = (post: Post) => {
    if (post.originalImages && post.originalImages.length > 0) {
      return post.originalImages[0].imageUrl
    }
    if (post.requestedImages && post.requestedImages.length > 0) {
      return post.requestedImages[0].imageUrl
    }
    return "/placeholder.svg?height=96&width=128"
  }
  
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy bài đăng nào</h3>
        <p className="text-gray-500">Không có bài đăng nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {posts.map((post) => {
        return (
          <div
            key={post.projectPostID}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onView?.(post.projectPostID)}
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0 relative">
                <img
                  src={getMainImage(post) || "/placeholder.svg"}
                  alt={post.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                {/* Image count overlay */}
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    <span>{post.originalImages.length + post.requestedImages.length}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(post.postStatus)}
                    {post.isActive && (
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                        Live
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.description}</p>

                {/* Author and Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.fullName || "User"} />
                      <AvatarFallback className="text-xs">{post.fullName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">{post.fullName || "Người dùng ẩn danh"}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Date Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Giá đề xuất</span>
                    <p className="font-semibold text-green-600">{post.suggestedPrice.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Giá trị</span>
                    <p className="font-medium text-gray-700">{post.itemValue.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kết thúc</span>
                    <p className="font-medium text-gray-700">{new Date(post.endAt).toLocaleDateString("vi-VN")}</p>
                    {/* {daysRemaining > 0 && daysRemaining <= 7 && (
                      <p className="text-xs text-orange-600">{daysRemaining} ngày còn lại</p>
                    )} */}
                  </div>
                  <div>
                    <span className="text-gray-500">Hoàn thành</span>
                    <p className="font-medium text-gray-700">{new Date(post.finishDate).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
