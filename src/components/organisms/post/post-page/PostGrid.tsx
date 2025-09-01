import PostCard from "@/components/atoms/post/post-page/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
  onView?: (postId: string) => void;
  className?: string;
}

export default function PostGrid({
  posts,
  loading = false,
  onView,
  className = "",
}: PostGridProps) {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-card rounded-xl overflow-hidden shadow-sm border border-border"
          >
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-muted relative overflow-hidden">
              <div className="absolute top-3 left-3">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="absolute top-3 right-3">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
              {/* Author Skeleton */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              {/* Budget Skeleton */}
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>

              {/* Time Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">0</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-3">
          Không tìm thấy bài đăng nào
        </h3>
        <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
          Hiện tại chưa có bài đăng nào phù hợp với tiêu chí tìm kiếm của bạn.
          Hãy thử lại với các bộ lọc khác hoặc quay lại sau.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {posts.map((post) => (
        <PostCard
          key={post.projectPostID}
          post={post}
          onView={onView}
        />
      ))}
    </div>
  );
}
