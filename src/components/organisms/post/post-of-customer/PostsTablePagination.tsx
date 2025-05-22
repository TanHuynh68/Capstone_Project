// components/posts/organisms/posts-table-pagination.tsx
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PostsTablePaginationProps {
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  totalItems: number;
}

export function PostsTablePagination({
  pagination,
  onPaginationChange,
  totalItems,
}: PostsTablePaginationProps) {
  const { pageIndex, pageSize } = pagination;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const handlePageChange = (newPageIndex: number) => {
    onPaginationChange({
      ...pagination,
      pageIndex: newPageIndex,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPaginationChange({
      pageIndex: 0, // Reset to first page when changing page size
      pageSize: newPageSize,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Hiển thị {pageIndex * pageSize + 1} đến{" "}
        {Math.min((pageIndex + 1) * pageSize, totalItems)} trong {totalItems} bài đăng
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Số hàng mỗi trang</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value: any) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(0)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Trang {pageIndex + 1} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}