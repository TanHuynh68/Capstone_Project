"use client";

import { useState, useEffect } from "react";
import PostsFilters from "@/components/organisms/post/post-list/PostsFilters";
import PostsGrid from "@/components/organisms/post/post-list/PostsGrid";
import Pagination from "@/components/molecules/home/Pagination";
import PostService from "@/services/PostService";

export default function PostsTemplate() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { getPosts } = PostService();
  // Filters and sorting
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch posts when filters change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params: PostsParams = {
          page: currentPage,
          pageSize: 9, // 3x3 grid
          search: debouncedSearch,
          sortBy,
          sortOrder,
          status,
        };
        const response = await getPosts(params);
        console.log("response: ", response);
        if (response) {
          setPosts(response.data);
          setTotalPages(response.totalPages);
          setTotalCount(response.totalCount);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, debouncedSearch, sortBy, sortOrder, status]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort change
  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc"
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <PostsFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-500">
            {loading
              ? "Đang tải..."
              : `Hiển thị ${posts?.length} trên ${totalCount} bài đăng`}
          </p>
        </div>

        <PostsGrid posts={posts} loading={loading} className="mb-8" />

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="my-8"
          />
        )}
      </div>
    </div>
  );
}
