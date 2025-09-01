import { useState, useEffect } from "react";
import PostGrid from "@/components/organisms/post/post-page/PostGrid";
import { useCurrentUser } from "@/utils";
import { ROLE } from "@/constants";
import CreatePostDialog from "@/components/molecules/post/customer-upload-post-dialog/CreateUpdatePostDialog";
import { Search, FileText, Clock, AlertCircle, RefreshCw } from "lucide-react";
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
  const activePosts = posts.filter(post => new Date(post.finishDate) > new Date()).length;
  const expiredPosts = posts.filter(post => new Date(post.finishDate) <= new Date()).length;

  return (
    <div className="">
      {/* Enhanced Header */}
      <div className="">
        <div className="container mx-auto px-10 pb-6 py-2 min-h-[calc(90vh)]">
          {/* Top Navigation */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Bài đăng
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Khám phá và tìm kiếm các dự án thú vị
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Tổng bài đăng</p>
                    <p className="text-lg font-bold text-primary">{totalPosts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Đang hoạt động</p>
                    <p className="text-lg font-bold text-green-500">{activePosts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Đã hết hạn</p>
                    <p className="text-lg font-bold text-orange-500">{expiredPosts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm bài đăng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${isRefreshing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  title="Làm mới danh sách bài đăng (có thể nhấn bất kì lúc nào)"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span className="text-sm font-medium">
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
              <div className="mt-6">
                <Badge variant="secondary" className="text-xs">
                  Kết quả tìm kiếm: "{searchTerm}"
                </Badge>
              </div>
            )}

            {/* Post Grid */}
            <div className="mt-6">
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
