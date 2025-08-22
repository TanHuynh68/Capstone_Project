import { useState, useEffect } from "react";
import PostGrid from "@/components/organisms/post/post-page/PostGrid";
import { useCurrentUser } from "@/utils";
import { ROLE } from "@/constants";
import CreatePostDialog from "@/components/molecules/post/customer-upload-post-dialog/CreateUpdatePostDialog";
interface PostManagementTemplateProps {
  initialPosts: Post[];
  isLoading?: boolean;
  fetchPosts: any;
}

export default function PostManagementTemplate({
  initialPosts,
  isLoading = false,
  fetchPosts,
}: PostManagementTemplateProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const currentUser = useCurrentUser();

  // Update posts when initialPosts changes
  useEffect(() => {
    setPosts(initialPosts || []);
  }, [initialPosts]);

  const handleLike = (postId: string) => {
    // In a real app, this would call an API
    console.log("Like post:", postId);
  };

  const handleView = (postId: string) => {
    // Navigate to post detail page
    console.log("Navigate to post:", postId);
  };

  const handlePostCreated = () => {
    // Refresh posts list after creating new post
    // In a real app, you would refetch the posts
    console.log("Post created, refreshing list...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Bài đăng</h1>
            </div>

            {currentUser?.role === ROLE.CUSTOMER && (
              <div className="flex items-center gap-4">
                <CreatePostDialog
                  fetchPosts={fetchPosts}
                  onPostCreated={handlePostCreated}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Danh sách bài đăng
            </h2>
            <p className="text-muted-foreground mt-1">
              Hiển thị {initialPosts?.length || 0} bài đăng
            </p>
          </div>
        </div>

        <PostGrid
          posts={posts}
          loading={isLoading}
          onLike={handleLike}
          onView={handleView}
        />
      </div>
    </div>
  );
}
