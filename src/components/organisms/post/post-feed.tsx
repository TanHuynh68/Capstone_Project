"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PostCard2 } from "@/components/molecules/post/post-list/PostCard2";

interface PostFeedProps {
  posts: Post[];
  loading?: boolean;
  onViewOffers?: (postId: string) => void;
  onRefresh?: () => void;
}

export function PostFeed({
  posts,
  loading,
  onViewOffers,
  onRefresh,
}: PostFeedProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Bài đăng dự án</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <p>Đang tải...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard2
              key={post.projectPostID}
              post={post}
              onViewOffers={onViewOffers}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Không có bài đăng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
