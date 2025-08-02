"use client";

import type React from "react";
import {
  DataTable,
  type Column,
} from "@/components/organisms/manager-withdrawal-by-staff";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyVND } from "@/utils";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { Eye, Power, PowerOff } from "lucide-react";

const PAGE_SIZE = 10;

interface PostsTableProps {
  posts: Post[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  actions: PostsTableActions;
  totalItems?: number; // Thêm tổng số items để tính toán chính xác hơn
}

const PostsTable: React.FC<PostsTableProps> = ({
  posts,
  loading,
  totalPages,
  currentPage,
  searchTerm,
  actions,
  totalItems,
}) => {
  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Đang hoạt động
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        Đã hết hạn
      </Badge>
    );
  };

  const getPostStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-red-100 text-red-800">Đã khóa</Badge>; // staff locked
      case 1:
        return <Badge className="bg-blue-100 text-blue-800">Chưa có đơn</Badge>;
      case 2:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Đã nhận đơn</Badge>
        );
      case 3:
        return (
          <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>
        );
    }
  };

  // Tính toán STT chính xác cho phân trang
  const getRowNumber = (index: number) => {
    return (currentPage - 1) * PAGE_SIZE + index + 1;
  };

  const columns: Column<Post>[] = [
    {
      header: "STT",
      className: "text-center w-12",
      cell: (_row: Post, index?: number) => (
        <span>{index !== undefined ? getRowNumber(index) : ""}</span>
      ),
    },
    {
      header: "Tiêu đề",
      accessorKey: "title",
      sortable: true,
      className: "text-left max-w-xs",
      cell: (row) => (
        <div className="truncate" title={row.title}>
          {highlightMatch(row.title, searchTerm)}
        </div>
      ),
    },
    {
      header: "Người đăng",
      accessorKey: "fullName",
      sortable: true,
      className: "text-center",
      cell: (row) => (
        <div className="flex items-center gap-2 justify-center">
          {row.avatar && (
            <img
              src={row.avatar || "/placeholder.svg"}
              alt={row.fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{highlightMatch(row.fullName, searchTerm)}</span>
        </div>
      ),
    },
    {
      header: "Giá trị",
      accessorKey: "itemValue",
      className: "text-center",
      cell: (row) => (
        <div className="text-center">
          <div className="font-semibold text-green-600">
            {formatCurrencyVND(row.itemValue)}
          </div>
          <div className="text-xs text-gray-500">
            Đề xuất: {formatCurrencyVND(row.suggestedPrice)}
          </div>
        </div>
      ),
    },
    {
      header: "Trạng thái bài đăng",
      accessorKey: "postStatus",
      className: "text-center",
      cell: (row) => getPostStatusBadge(row.postStatus),
    },
    {
      header: "Trạng thái hoạt động",
      accessorKey: "isActive",
      className: "text-center",
      cell: (row) => getStatusBadge(row.isActive),
    },
    {
      header: "Ngày tạo",
      accessorKey: "createdAt",
      sortable: true,
      className: "text-center",
      cell: (row) => formatFullDateWithDistance2(row.createdAt),
    },
    {
      header: "Thao tác",
      accessorKey: "projectPostID",
      className: "text-center",
      cell: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => actions.onViewDetail(row)}
            className="px-3 py-1 bg-white border border-blue-500 text-blue-500 rounded hover:bg-blue-50 text-sm flex items-center gap-1 transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="h-3 w-3" />
            Chi tiết
          </button>
          {/* Chỉ hiển thị nút toggle khi postStatus là 0 hoặc 1 */}
          {(row.postStatus === 0 || row.postStatus === 1) && (
            <button
              onClick={() => actions.onToggleStatus(row)}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                row.postStatus === 1
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              title={row.postStatus === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
            >
              {row.postStatus === 1 ? (
                <>
                  <PowerOff className="h-3 w-3" />
                  Vô hiệu hóa
                </>
              ) : (
                <>
                  <Power className="h-3 w-3" />
                  Kích hoạt
                </>
              )}
            </button>
          )}
        </div>
      ),
    },
  ];
  console.log('currentPage: ', currentPage)
  console.log('totalPages: ', totalPages)
  return (
    <div className="space-y-4">
      {/* Thông tin tổng quan */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Hiển thị {posts.length > 0 ? getRowNumber(0) : 0} -{" "}
          {posts.length > 0 ? getRowNumber(posts.length - 1) : 0} của{" "}
          {totalItems || posts.length} bài đăng
        </div>
        <div>
          Trang {currentPage} / {totalPages}
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        emptyMessage="Không có bài đăng nào."
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page: number) => {
            console.log("Changing to page:", page);
            actions.onPageChange(page);
          },
        }}
        getRowId={(row) => row.projectPostID}
      />
    </div>
  );
};

export default PostsTable;
