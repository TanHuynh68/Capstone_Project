"use client";

import { Avatar } from "@/components/atoms/avatar/avatar";
import { Badge } from "@/components/atoms/badge/badge";
import { Clock } from "lucide-react";


interface PostCardProps {
  post: Post;
  onViewOffers?: (postId: string) => void;
}

export function PostCard2({ post, onViewOffers }: PostCardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  // const getStatusText = (status: number) => {
  //   switch (status) {
  //     case 0:
  //       return "Đang chờ";
  //     case 1:
  //       return "Đang hoạt động";
  //     case 2:
  //       return "Hoàn thành";
  //     case 3:
  //       return "Đã hủy";
  //     default:
  //       return "Không xác định";
  //   }
  // };

  // const getStatusVariant = (status: number) => {
  //   switch (status) {
  //     case 1:
  //       return "success";
  //     case 2:
  //       return "default";
  //     case 3:
  //       return "danger";
  //     default:
  //       return "warning";
  //   }
  // };

  return (
    <div
      onClick={() => onViewOffers?.(post.projectPostID)}
      className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Header: Avatar + Name + Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.avatar || "/unknown-user.png"}
            alt={post.fullName || ""}
            size="sm"
          />
          <div className="text-sm font-medium">
            {post.fullName}
            <p className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        {/* Badge với chấm và dòng chữ hiện khi hover */}
        {post.postStatus === 1 && (
          <div className="relative group w-fit h-fit pl-2">
            {/* Chấm nhấp nháy */}
            <span
              className="w-3 h-3 bg-green-500 rounded-full transition-opacity duration-300 group-hover:opacity-0 animate-blink2 block"
              title="Đang hoạt động"
            />

            {/* Badge hiển thị khi hover */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
              <Badge
                variant="success"
                className="text-green-800 bg-green-100 dark:bg-green-300/20 dark:text-green-300 whitespace-nowrap"
              >
                Đang hoạt động
              </Badge>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-3">
        <div className="flex flex-col gap-1 text-sm font-medium mb-3">
          <div className="flex items-center gap-1 text-green-600">
            <span className="text-muted-foreground">Giá trị sản phẩm:</span>
            <span>{formatCurrency(post.itemValue)}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <span className="text-muted-foreground">Giá đề xuất:</span>
            <span>{formatCurrency(post.suggestedPrice)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Kết thúc: {formatDate(post.endAt)}</span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-2">
        <h2 className="text-base font-semibold line-clamp-2">{post.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.description}
        </p>
      </div>

      {/* Giá trị + đề xuất + kết thúc */}

      {/* Hình ảnh */}
      {(post.originalImages?.length > 0 ||
        post.requestedImages?.length > 0) && (
        <div className="w-full max-h-[240px] rounded-md overflow-hidden border border-border bg-popover mb-3 flex justify-center items-center">
          <img
            src={
              post.requestedImages?.[0]?.imageUrl ||
              post.originalImages?.[0]?.imageUrl ||
              "/placeholder.svg"
            }
            alt="sample"
            className="w-full h-auto max-h-[240px] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Ngày tạo */}
      <div className="text-xs text-muted-foreground italic">
        Đã đăng: {formatDate(post.createdAt)}
      </div>
    </div>
  );
}
