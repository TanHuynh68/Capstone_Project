"use client";

import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataTable,
  type Column,
} from "@/components/organisms/manager-withdrawal-by-staff";
import {
  getReportStatusBadge,
  getReportTypeBadge,
} from "@/components/atoms/manage-reports/BadgeUtils";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { PAGE_SIZE } from "@/constants/reports.constants";
import { getStatusNumber, highlightMatch } from "@/utils/reports.utils";

interface ReportsTableProps {
  reports: Report[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  actions: TableActions;
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  reports,
  loading,
  totalPages,
  currentPage,
  searchTerm,
  actions,
}) => {
  // Định nghĩa columns
  const columns: Column<Report>[] = [
    {
      header: "STT",
      className: "text-center w-12",
      cell: (_row: Report, index?: number) => (
        <span>
          {index !== undefined ? index + 1 + (currentPage - 1) * PAGE_SIZE : ""}
        </span>
      ),
    },
    {
      header: "ID Báo cáo",
      accessorKey: "reportID",
      sortable: true,
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-sm">
          {highlightMatch(row.reportID.slice(0, 8) + "...", searchTerm)}
        </span>
      ),
    },
    {
      header: "Người báo cáo",
      accessorKey: "reporter",
      sortable: true,
      className: "text-center",
      cell: (row) => highlightMatch(row.reporter, searchTerm),
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
      header: "Loại báo cáo",
      accessorKey: "reportType",
      className: "text-center",
      cell: (row) => getReportTypeBadge(row.reportType),
    },
    {
      header: "Target ID",
      accessorKey: "targetID",
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-sm">
          {row.targetID ? row.targetID.slice(0, 8) + "..." : "N/A"}
        </span>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "reportStatus",
      className: "text-center",
      cell: (row) => getReportStatusBadge(row.reportStatus),
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
      accessorKey: "reportID",
      className: "text-center",
      cell: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => actions.onProcessReport(row)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Giải quyết
          </button>
          <Select
            value={getStatusNumber(row.reportStatus).toString()}
            onValueChange={(value) =>
              actions.onUpdateStatus(row.reportID, Number(value))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Đang chờ</SelectItem>
              <SelectItem value="1">Đang xử lý</SelectItem>
              <SelectItem value="2">Duyệt</SelectItem>
              <SelectItem value="3">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={reports}
      loading={loading}
      emptyMessage="Không có báo cáo nào."
      pagination={{
        currentPage,
        totalPages,
        onPageChange: actions.onPageChange,
      }}
      getRowId={(row) => row.reportID}
    />
  );
};

export default ReportsTable;
