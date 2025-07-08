import { Calendar, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/path";

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  onView?: (postId: string) => void;
  className?: string;
}

export default function PostList({
  posts,
  loading = false,
  onView,
  className = "",
}: PostListProps) {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Đang hoạt động
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Đang xử lý
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Đã kết thúc
          </Badge>
        );
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getMainImage = (post: Post) => {
    if (post.originalImages && post.originalImages.length > 0) {
      return post.originalImages[0].imageUrl;
    }
    if (post.requestedImages && post.requestedImages.length > 0) {
      return post.requestedImages[0].imageUrl;
    }
    return "/placeholder.svg?height=96&width=128";
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-6 shadow-sm border border-border"
          >
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-muted rounded-lg animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium text-foreground mb-1">
          Không tìm thấy bài đăng nào
        </h3>
        <p className="text-muted-foreground">
          Không có bài đăng nào phù hợp với tiêu chí tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {posts.map((post) => {
        return (
          <Link
            key={post.projectPostID}
            to={`${PATH.POST_DETAIL}/${post.projectPostID}`}
            onClick={() => onView?.(post.projectPostID)}
            className="block no-underline"
          >
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={getMainImage(post) || "/placeholder.svg"}
                    alt={post.title}
                    className="w-32 h-24 object-contain rounded-lg"
                  />
                  {/* Image count overlay */}
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      <span>
                        {post.originalImages.length +
                          post.requestedImages.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(post.postStatus)}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {post.description}
                  </p>

                  {/* Author and Stats */}
                  <div className="flex items-center justify-between mb-3">
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
                      <span className="text-sm text-foreground">
                        {post.fullName || "Người dùng ẩn danh"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Date Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Giá đề xuất</span>
                      <p className="font-semibold text-purple-600 dark:text-purple-400">
                        {post.suggestedPrice.toLocaleString()}đ
                      </p>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Kết thúc</span>
                      <p className="font-medium text-foreground">
                        {new Date(post.endAt).toLocaleDateString("vi-VN")}
                      </p>
                      {/* {daysRemaining > 0 && daysRemaining <= 7 && (
                        <p className="text-xs text-orange-600">{daysRemaining} ngày còn lại</p>
                      )} */}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hoàn thành</span>
                      <p className="font-medium text-foreground">
                        {new Date(post.finishDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
