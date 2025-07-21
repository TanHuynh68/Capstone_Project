"use client"

import type React from "react"
import { DataTable, type Column } from "@/components/organisms/manager-withdrawal-by-staff"
import { getReportStatusBadge, getReportTypeBadge } from "@/components/atoms/manage-reports/BadgeUtils"
import { formatFullDateWithDistance2 } from "@/utils/date"
import { PAGE_SIZE } from "@/constants/reports.constants"
import { highlightMatch } from "@/utils/reports.utils"
import { Eye, Settings } from "lucide-react"

interface ReportsTableProps {
  reports: Report[]
  loading: boolean
  totalPages: number
  currentPage: number
  searchTerm: string
  actions: TableActions
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
        <span>{index !== undefined ? index + 1 + (currentPage - 1) * PAGE_SIZE : ""}</span>
      ),
    },
    {
      header: "ID Báo cáo",
      accessorKey: "reportID",
      sortable: true,
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-sm">{highlightMatch(row.reportID.slice(0, 8) + "...", searchTerm)}</span>
      ),
    },
    {
      header: "Người tố cáo",
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
      header: "Loại tố cáo",
      accessorKey: "reportType",
      className: "text-center",
      cell: (row) => getReportTypeBadge(row.reportType),
    },
    {
      header: "Target ID",
      accessorKey: "targetID",
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-sm">{row.targetID ? row.targetID.slice(0, 8) + "..." : "N/A"}</span>
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
            onClick={() => actions.onViewDetail(row)}
            className="px-3 py-1 bg-white border border-blue-500 text-blue-500 rounded hover:bg-blue-50 text-sm flex items-center gap-1 transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="h-3 w-3" />
            Chi tiết
          </button>
          {
           row.reportStatus != "Approved" && <button
            onClick={() => actions.onProcessReport(row)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1 transition-colors"
            title="Giải quyết báo cáo"
          >
            <Settings className="h-3 w-3" />
            Giải quyết
          </button>
          }
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={reports}
      loading={loading}
      emptyMessage="Không có tố cáo nào."
      pagination={{
        currentPage,
        totalPages,
        onPageChange: actions.onPageChange,
      }}
      getRowId={(row) => row.reportID}
    />
  )
}

export default ReportsTable
