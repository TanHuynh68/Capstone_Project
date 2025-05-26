"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/atoms/avatar/avatar";
import { Badge } from "@/components/atoms/badge/badge";
import { Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/path";

interface ProjectImage {
  projectImageID: string;
  imageUrl: string;
}

interface PostCardProps {
  post: Post;
  onViewOffers?: (postId: string) => void;
}

export function PostCard2({ post, onViewOffers }: PostCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Đang chờ";
      case 1:
        return "Đang hoạt động";
      case 2:
        return "Hoàn thành";
      case 3:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusVariant = (status: number) => {
    switch (status) {
      case 1:
        return "success";
      case 2:
        return "default";
      case 3:
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <Link to={`${PATH.POST_DETAIL}/${post.projectPostID}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar
              src={post.avatar || "/placeholder.svg?height=40&width=40"}
              alt={post.fullName || ""}
              size="md"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{post.fullName}</h3>
              <p className="text-xs text-gray-500">
                {formatDate(post.createdAt)}
              </p>
            </div>
            <Badge variant={getStatusVariant(post.postStatus)}>
              {getStatusText(post.postStatus)}
            </Badge>
          </div>
        </CardHeader>
      </Link>

      {/* Bọc CardContent trong div để bắt sự kiện click */}
      <div
        onClick={() => onViewOffers?.(post.projectPostID)}
        className="cursor-pointer"
      >
        <CardContent className="pt-0">
          <h2 className="font-bold text-lg mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>

          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Giá trị: {formatCurrency(post.itemValue)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Đề xuất: {formatCurrency(post.suggestedPrice)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Kết thúc: {formatDate(post.endAt)}</span>
            </div>
          </div>

          {(post.originalImages?.length > 0 ||
            post.requestedImages?.length > 0) && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {post.originalImages?.slice(0, 2).map((img: ProjectImage) => (
                  <img
                    key={img.projectImageID}
                    src={img.imageUrl || "/placeholder.svg"}
                    alt="Original"
                    className="w-16 h-16 object-cover rounded border"
                    onClick={(e) => e.stopPropagation()} // ⛔ Ngăn click ảnh lan lên
                  />
                ))}
                {post.requestedImages?.slice(0, 2).map((img: ProjectImage) => (
                  <img
                    key={img.projectImageID}
                    src={img.imageUrl || "/placeholder.svg"}
                    alt="Requested"
                    className="w-16 h-16 object-cover rounded border"
                    onClick={(e) => e.stopPropagation()} // ⛔ Ngăn click ảnh lan lên
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
