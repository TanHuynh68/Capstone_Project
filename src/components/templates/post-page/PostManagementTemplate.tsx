"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PostFilters from "@/components/molecules/post/post-page/PostFilters";
import PostGrid from "@/components/organisms/post/post-page/PostGrid";
import PostList from "@/components/organisms/post/post-page/PostList";
import { Link } from "react-router-dom";
import { PATH, USER_ROUTES } from "@/routes/path";

interface PostManagementTemplateProps {
  initialPosts: Post[];
  isLoading?: boolean;
}

export default function PostManagementTemplate({
  initialPosts,
  isLoading = false,
}: PostManagementTemplateProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(
    initialPosts || []
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    dateRange: { from: null, to: null },
    endDateRange: { from: null, to: null },
    isActive: undefined,
  });

  const [sort, setSort] = useState<SortState>({
    column: "createdAt",
    direction: "desc",
  });

  // Apply filters and sorting
  useEffect(() => {
    // Safety check - ensure posts is an array
    if (!Array.isArray(posts) || posts.length === 0) {
      setFilteredPosts([]);
      return;
    }

    let result = [...posts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (post: Post) =>
          post.title?.toLowerCase().includes(searchLower) ||
          post.description?.toLowerCase().includes(searchLower) ||
          (post.fullName &&
            post.fullName.toLowerCase().includes(searchLower)) ||
          post.accountID?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter(
        (post) => post.postStatus.toString() === filters.status
      );
    }

    // Active status filter
    if (filters.isActive !== undefined) {
      result = result.filter((post) => post.isActive === filters.isActive);
    }

    // Date range filter for createdAt
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter((post) => {
        const createdDate = new Date(post.createdAt);

        if (filters.dateRange.from && filters.dateRange.to) {
          return (
            createdDate >= filters.dateRange.from &&
            createdDate <= filters.dateRange.to
          );
        }

        if (filters.dateRange.from) {
          return createdDate >= filters.dateRange.from;
        }

        if (filters.dateRange.to) {
          return createdDate <= filters.dateRange.to;
        }

        return true;
      });
    }

    // Date range filter for endAt
    if (filters.endDateRange.from || filters.endDateRange.to) {
      result = result.filter((post) => {
        const endDate = new Date(post.endAt);

        if (filters.endDateRange.from && filters.endDateRange.to) {
          return (
            endDate >= filters.endDateRange.from &&
            endDate <= filters.endDateRange.to
          );
        }

        if (filters.endDateRange.from) {
          return endDate >= filters.endDateRange.from;
        }

        if (filters.endDateRange.to) {
          return endDate <= filters.endDateRange.to;
        }

        return true;
      });
    }

    // Apply sorting
    if (sort.column) {
      result.sort((a, b) => {
        let aValue: any = a[sort.column as keyof Post];
        let bValue: any = b[sort.column as keyof Post];

        // Handle date sorting
        if (
          sort.column === "createdAt" ||
          sort.column === "endAt" ||
          sort.column === "finishDate"
        ) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        // Handle numeric sorting
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Handle string sorting
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sort.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle boolean sorting
        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          if (sort.direction === "asc") {
            return aValue === bValue ? 0 : aValue ? 1 : -1;
          } else {
            return aValue === bValue ? 0 : aValue ? -1 : 1;
          }
        }

        return 0;
      });
    }

    setFilteredPosts(result);
  }, [posts, filters, sort]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link to={PATH.CUSTOMER_UPLOAD_PAGE}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bài đăng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách dự án
            </h2>
            <p className="text-gray-600 mt-1">
              Hiển thị {filteredPosts?.length || 0} trên {posts?.length || 0}{" "}
              bài đăng
            </p>
          </div>
        </div>

        {/* Filters */}
        <PostFilters
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          className="mb-8"
        />

        {/* Posts Grid/List */}
        {viewMode === "grid" ? (
          <PostGrid
            posts={filteredPosts}
            loading={isLoading}
            onLike={handleLike}
            onView={handleView}
          />
        ) : (
          <PostList
            posts={filteredPosts}
            loading={isLoading}
            onView={handleView}
          />
        )}

        {/* Load More */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
             Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
