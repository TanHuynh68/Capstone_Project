"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/path";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onView?: (postId: string) => void;
  className?: string;
}

export default function PostCard({
  post,
  onView,
  className = "",
}: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleView = () => {
    onView?.(post.projectPostID);
  };

  // Get the main image to display (prefer original, fallback to first requested)
  const getMainImage = () => {
    if (post.originalImages && post.originalImages.length > 0) {
      return post.originalImages[0].imageUrl;
    }
    if (post.requestedImages && post.requestedImages.length > 0) {
      return post.requestedImages[0].imageUrl;
    }
    return "/placeholder.svg?height=300&width=400";
  };

  return (
    <Link to={`${PATH.POST_DETAIL}/${post?.projectPostID}`}>
      <div
        className={`group relative bg-card text-card-foreground rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-border ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleView}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={getMainImage() || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                {post.title}
              </h3>
              {/* <p className="text-white/80 text-sm line-clamp-2 mb-3">
              {post.description}
            </p> */}

              {/* Image Count */}
              <div className="flex items-center gap-4 text-white/80 text-xs">
                {post.originalImages.length > 0 && (
                  <span>{post.originalImages.length} ảnh gốc</span>
                )}
                {post.requestedImages.length > 0 && (
                  <span>{post.requestedImages.length} ảnh yêu cầu</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={post.avatar || "/placeholder.svg"}
                  alt={post.fullName || "User"}
                />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {post.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground truncate">
                {post.fullName || "Người dùng ẩn danh"}
              </span>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="flex items-center justify-between mb-3"></div> */}

          {/* Price Info */}
          <div className="pt-0">
            {/* <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Giá sản phẩm:
              </span>
              <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                {post.itemValue.toLocaleString()}đ
              </p>
            </div> */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Ngân sách:
              </span>
              <p className="font-semibold text-purple-600 dark:text-purple-400 text-sm">
                {post.suggestedPrice.toLocaleString()}đ
              </p>
            </div>
          </div>

          {/* Finish Date */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Hoàn thành:{" "}
                {new Date(post.finishDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
