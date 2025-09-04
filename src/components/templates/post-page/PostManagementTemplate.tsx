import { useState, useEffect } from "react";
import PostGrid from "@/components/organisms/post/post-page/PostGrid";
import { useCurrentUser } from "@/utils";
import { ROLE } from "@/constants";
import CreatePostDialog from "@/components/molecules/post/customer-upload-post-dialog/CreateUpdatePostDialog";
import { Search, FileText, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PostManagementTemplateProps {
  initialPosts: Post[];
  isLoading?: boolean;
  fetchPosts: () => Promise<void>;
}

export default function PostManagementTemplate({
  initialPosts,
  isLoading = false,
  fetchPosts,
}: PostManagementTemplateProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentUser = useCurrentUser();

  // Update posts when initialPosts changes
  useEffect(() => {
    setPosts(initialPosts || []);
  }, [initialPosts]);

  const handleView = (postId: string) => {
    // Navigate to post detail page
    console.log("Navigate to post:", postId);
  };

  const handlePostCreated = () => {
    // Refresh posts list after creating new post
    // In a real app, you would refetch the posts
    console.log("Post created, refreshing list...");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchPosts();
      // Clear search term when refreshing
      setSearchTerm("");
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalPosts = posts.length;

  return (
    <div className="">
      {/* Enhanced Header */}
      <div className="">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 pb-6 py-2 min-h-[calc(90vh)]">
          {/* Top Navigation */}
          <div className="">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Bài đăng
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Khám phá và tìm kiếm các dự án thú vị
                  </p>
                </div>
              </div>

              {/* Tổng bài đăng on the right side */}
              <div className="bg-primary/5 rounded-lg p-2 sm:p-3 border border-primary/20 w-fit">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-md flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-medium text-foreground">Tổng bài đăng</p>
                    <p className="text-base sm:text-lg font-bold text-primary">{totalPosts}</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              <div className="relative sm:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm bài đăng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-primary focus:ring-primary w-full"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${isRefreshing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  title="Làm mới danh sách bài đăng (có thể nhấn bất kì lúc nào)"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span className="text-xs sm:text-sm font-medium">
                    {isRefreshing ? "Đang tải..." : "Làm mới"}
                  </span>
                </button>

                {currentUser?.role === ROLE.CUSTOMER && (
                  <CreatePostDialog
                    fetchPosts={fetchPosts}
                    onPostCreated={handlePostCreated}
                  />
                )}
              </div>
            </div>

            {/* Search Results Badge */}
            {searchTerm && (
              <div className="mt-4 sm:mt-6">
                <Badge variant="secondary" className="text-[11px] sm:text-xs">
                  Kết quả tìm kiếm: "{searchTerm}"
                </Badge>
              </div>
            )}

            {/* Post Grid */}
            <div className="mt-4 sm:mt-6">
              <PostGrid
                posts={filteredPosts}
                loading={isLoading}
                onView={handleView}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
