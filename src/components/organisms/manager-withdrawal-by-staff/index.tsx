import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index?: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
  getRowId?: (row: T) => string | number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  pagination,
  className = "",
  getRowId = (row) => {
    const id = row.walletOrderID || "";
    const timestamp = row.createdAt || row.updatedAt || "";
    const status = row.status || "";
    return `${id}-${timestamp}-${status}`;
  },
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === bVal) return 0;
      if (sortDirection === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: keyof T) => {
    if (sortColumn !== column)
      return <ChevronsUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1 text-blue-500" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 text-blue-500" />
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="overflow-auto py-0">
        <Table>
          <TableHeader>
            <TableRow className="h-12">
              {columns.map((column) => (
                <TableHead
                  key={String(column.accessorKey)}
                  className="px-3 py-2 align-middle font-semibold whitespace-nowrap text-center"
                >
                  {column.sortable ? (
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() =>
                          column.accessorKey && handleSort(column.accessorKey)
                        }
                        className="flex items-center gap-1 bg-transparent border-0 outline-none p-0 m-0 font-inherit text-inherit cursor-pointer hover:bg-transparent focus:ring-0"
                      >
                        <span>{column.header}</span>
                        {column.accessorKey && getSortIcon(column.accessorKey)}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center">
                      {column.header}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="h-12">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center px-3"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow className="h-12">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center px-3"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => {
                const baseKey = getRowId(row);
                const uniqueKey = baseKey
                  ? `${baseKey}-${index}`
                  : `row-${index}`;
                return (
                  <TableRow key={uniqueKey} className="h-12">
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.accessorKey)}
                        className={`px-3 align-middle whitespace-nowrap ${
                          column.className || ""
                        }`}
                      >
                        {column.cell
                          ? column.cell(row, index)
                          : column.accessorKey
                          ? String(row[column.accessorKey])
                          : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
      {pagination && (
        <div className="flex justify-center items-center gap-1 flex-wrap mt-4">
          <Button
            variant="ghost"
            size="icon"
            disabled={pagination.currentPage === 1}
            onClick={() => pagination.onPageChange(1)}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={pagination.currentPage === 1}
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={
                  pagination.currentPage === page ? "default" : "outline"
                }
                size="icon"
                onClick={() => pagination.onPageChange(page)}
                className={
                  pagination.currentPage === page ? "font-bold shadow-sm" : ""
                }
              >
                <span className="text-sm">{page}</span>
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="icon"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.totalPages)}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
