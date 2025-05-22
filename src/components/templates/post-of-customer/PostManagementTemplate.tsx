// components/posts/templates/post-management-template.tsx
import { useState, useEffect } from "react";
import { PostsTable } from "@/components/organisms/post/post-of-customer/PostsTable";
import { PostsTablePagination } from "@/components/organisms/post/post-of-customer/PostsTablePagination";
import { PostFilters } from "@/components/organisms/post/post-of-customer/PostFilters";

interface PostManagementTemplateProps {
  initialPosts: Post[];
  isLoading?: boolean;
}

export function PostManagementTemplate({
  initialPosts,
  isLoading = false,
}: PostManagementTemplateProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: '',
    dateRange: { from: null, to: null },
    endDateRange: { from: null, to: null },
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const [sort, setSort] = useState<SortState>({
  //   column: null,
  //   direction: "asc",
  // });

  // Apply filters
  useEffect(() => {
    let result = [...initialPosts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          (post.fullName && post.fullName.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter((post) => post.postStatus === filters.status);
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

    setFilteredPosts(result);
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filters change
  }, [initialPosts, filters]);

  // Get paginated data
  const getPaginatedData = () => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredPosts.slice(start, end);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý bài đăng</h1>
      </div>

      <PostFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      ) : (
        <>
          <PostsTable data={getPaginatedData()} />

          <PostsTablePagination
            pagination={pagination}
            onPaginationChange={setPagination}
            totalItems={filteredPosts.length}
          />
        </>
      )}
    </div>
  );
}
