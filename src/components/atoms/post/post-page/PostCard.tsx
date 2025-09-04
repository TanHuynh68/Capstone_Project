"use client";

import { useState } from "react";
import { Eye, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/path";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: Post;
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

  const isExpired = new Date(post.finishDate) < new Date();

  return (
    <Link to={`${PATH.POST_DETAIL}/${post?.projectPostID}`}>
      <div
        className={`group relative bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-border hover:border-primary/50 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleView}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={getMainImage() || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={isExpired ? "destructive" : "default"}
              className={`font-medium text-xs px-3 py-1.5 ${isExpired
                ? "bg-destructive text-destructive-foreground"
                : "bg-green-500 text-white shadow-lg"
                }`}
            >
              {isExpired ? "Hết hạn" : "Đang hoạt động"}
            </Badge>
          </div>

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 leading-tight">
                {post.description}
              </h3>

              {/* Image Count */}
              <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                {post.originalImages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>{post.originalImages.length} ảnh gốc</span>
                  </div>
                )}
                {post.requestedImages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{post.requestedImages.length} ảnh yêu cầu</span>
                  </div>
                )}
              </div>


            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Author Info and Title */}
          <div className="flex items-center justify-between mb-4">
            {/* Left Column - Author Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage
                  src={post.avatar || "/placeholder.svg"}
                  alt={post.fullName || "User"}
                />
                <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                  {post.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {post.fullName || "Người dùng ẩn danh"}
                </p>
              </div>
            </div>

            {/* Right Column - Post Title */}
            <div className="flex items-center">
              <h3 className="text-sm font-semibold text-foreground truncate leading-tight text-right max-w-[70px]">
                {post.title}
              </h3>
            </div>
          </div>

          {/* Budget Info */}
          <div className="bg-primary/5 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Ngân sách
              </span>
              <p className="font-bold text-lg text-primary">
                {post.suggestedPrice.toLocaleString()}đ
              </p>
            </div>
          </div>

          {/* Time Info */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start text-muted-foreground">
              <span className="text-xs text-muted-foreground">Ngày tạo</span>
              <span className="text-sm font-medium">
                {new Date(post.createdAt || Date.now()).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex flex-col items-end text-muted-foreground">
              <span className="text-xs text-muted-foreground">Ngày hoàn thành</span>
              <span className="text-sm font-medium">
                {new Date(post.finishDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Border Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
      </div>
    </Link>
  );
}
