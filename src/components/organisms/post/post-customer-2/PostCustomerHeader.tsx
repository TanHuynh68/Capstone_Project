"use client";

import { Button } from "@/components/ui/button";
import { Flag, Eye } from "lucide-react";
import DateDisplay from "@/components/atoms/post/post-detail/DateDisplay";
import UserInfo from "@/components/molecules/post/post-detail/UserInfo";
import StatusBadge from "@/components/atoms/post/post-list/StatusBadge";
import { Breadcrumb } from "../../custom/breadcrumb/Breadcrumb";
import { useState, useCallback } from "react";

interface PostCustomerHeaderProps {
  post: Post;
  onBack?: () => void;
  className?: string;
  onViewOffers?: () => void;
  isSelected?: boolean;
}

export default function PostCustomerHeader({
  post,
  className = "",
  onViewOffers,
  isSelected = false,
}: PostCustomerHeaderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewOffers = useCallback(() => {
    if (onViewOffers && !isTransitioning) {
      setIsTransitioning(true);

      if (isSelected) {
        // Khi ẩn offers, đợi animation hoàn thành trước khi gọi callback
        setTimeout(() => {
          onViewOffers();
          // Đợi thêm một chút để đảm bảo animation hoàn thành
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 400); // Thời gian đủ để animation exit hoàn thành
      } else {
        // Khi hiện offers, gọi callback ngay lập tức
        onViewOffers();
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
    }
  }, [onViewOffers, isSelected, isTransitioning]);

  const items = [
    { href: "/", title: "Trang chủ" },
    { href: "/post", title: "Bài đăng" },
    { href: "", title: "Bài đăng chi tiết" },
  ];

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg shadow-sm border p-6 ${className}`}
    >
      {/* Navigation và Actions */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb items={items} />
        <div className="flex items-center gap-2">
          {onViewOffers && (
            <Button
              variant={isSelected ? "default" : "outline"}
              onClick={handleViewOffers}
              disabled={isTransitioning}
              className={`flex items-center gap-2 transition-all duration-300 ${
                isTransitioning ? "opacity-50" : ""
              }`}
            >
              <Eye
                className={`h-4 w-4 transition-transform duration-300 ${
                  isSelected ? "rotate-180" : ""
                }`}
              />
              {isSelected ? "Ẩn offers" : "Xem offers"}
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thông tin chính */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {post.title}
            </h1>
            <StatusBadge status={post.postStatus} />
          </div>
        </div>

        {/* Thông tin người đăng */}
        <UserInfo
          fullName={post.fullName}
          avatar={post.avatar}
          accountID={post.accountID}
        />

        {/* Thông tin thời gian */}
        <div className="flex flex-wrap gap-6">
          <DateDisplay date={post.createdAt} label="Ngày tạo" icon="calendar" />
          <DateDisplay date={post.endAt} label="Ngày kết thúc" icon="clock" />
        </div>
      </div>
    </div>
  );
}
