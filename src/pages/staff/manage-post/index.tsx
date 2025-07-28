import { usePostsLogic } from "@/hooks/usePostsLogic"
import PostsFilterBar from "@/components/molecules/staff/manage-posts/PostsFilterBar"
import PostsTable from "@/components/organisms/staff/manage-posts/PostsTable"
import PostDetailDialog from "@/components/molecules/staff/manage-posts/PostDetailDialog"
import PostActionDialog from "@/components/molecules/staff/manage-posts/PostActionDialog"

export default function ManagePostsByStaff() {
  const {
    posts,
    loading,
    totalPages,
    filters,
    selectedPost,
    isDetailDialogOpen,
    isActionDialogOpen,
    actionType,
    detailLoading,
    handleViewDetail,
    handleToggleStatus,
    handleActionSubmit,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleCloseDetailDialog,
    handleCloseActionDialog,
  } = usePostsLogic()

  const tableActions = {
    onViewDetail: handleViewDetail,
    onToggleStatus: handleToggleStatus,
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
    onPageChange: handlePageChange,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <PostsFilterBar filters={filters} onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Posts Table */}
      <PostsTable
        posts={posts}
        loading={loading}
        totalPages={totalPages}
        currentPage={filters.page}
        searchTerm={filters.searchTerm}
        actions={tableActions}
      />

      {/* Post Detail Dialog */}
      <PostDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        post={selectedPost}
        loading={detailLoading}
      />

      {/* Post Action Dialog */}
      <PostActionDialog
        isOpen={isActionDialogOpen}
        onClose={handleCloseActionDialog}
        post={selectedPost}
        actionType={actionType}
        onSubmit={handleActionSubmit}
      />
    </div>
  )
}
