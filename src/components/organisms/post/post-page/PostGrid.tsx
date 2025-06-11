import PostCard from "@/components/atoms/post/post-page/PostCard";

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
  onLike?: (postId: string) => void;
  onView?: (postId: string) => void;
  className?: string;
}

export default function PostGrid({
  posts,
  loading = false,
  onLike,
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
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
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
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-gray-400"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Không tìm thấy bài đăng nào
        </h3>
        <p className="text-gray-500 max-w-md">
          Không có bài đăng nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng
          thử lại với các bộ lọc khác.
        </p>
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
          onLike={onLike}
          onView={onView}
        />
      ))}
    </div>
  );
}
