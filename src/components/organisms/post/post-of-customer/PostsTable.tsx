"use client";

import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getColumns } from "./PostsTableColumns";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import DeleteConfirmationModal from "@/components/molecules/delete/DeleteConfirmationModal";
import PostService from "@/services/PostService";

interface PostsTableProps {
  data: Post[];
  onDataChange?: (data: Post[]) => void;
}

export function PostsTable({ data, onDataChange }: PostsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [posts, setPosts] = useState<Post[]>(data);
  const { deletePost } = PostService();
  // Cập nhật state nội bộ khi prop data thay đổi

  useEffect(() => {
    setPosts(data);
  }, [data]);

  // Sử dụng hook useDeleteConfirmation
  const {
    isOpen,
    itemToDelete,
    status,
    errorMessage,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteConfirmation<Post>({
    onDelete: async (post) => {
      // Gọi API xóa bài đăng
      await deletePost(post.projectPostID);

      // Cập nhật state sau khi xóa thành công
      const updatedPosts = posts.filter(
        (p) => p.projectPostID !== post.projectPostID
      );
      setPosts(updatedPosts);

      // Thông báo cho component cha về sự thay đổi dữ liệu
      if (onDataChange) {
        onDataChange(updatedPosts);
      }
    },
  });

  // Tạo columns với hàm xử lý xóa
  const columns = getColumns({
    onDeletePost: openDeleteModal,
  });

  // Khởi tạo bảng
  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sau
        </Button>
      </div>

      {/* Modal xác nhận xóa */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Xác nhận xóa bài đăng"
        description="Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác."
        itemName={itemToDelete?.title}
        itemType="Bài đăng"
        status={status}
        errorMessage={errorMessage}
      />
    </div>
  );
}
