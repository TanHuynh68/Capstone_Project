"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/organisms/manager-withdrawal-by-staff"
import {
  getCustomerReportStatusBadge,
  getCustomerReportTypeBadge,
} from "@/components/atoms/customer-reports/CustomerReportBadges"
import { formatFullDateWithDistance2 } from "@/utils/date"
import { CUSTOMER_PAGE_SIZE } from "@/constants/customerReports.constants"
import { Eye, Trash2 } from "lucide-react"

interface CustomerReportsTableProps {
  reports: CustomerReport[]
  loading: boolean
  totalPages: number
  currentPage: number
  actions: CustomerTableActions
}

const CustomerReportsTable: React.FC<CustomerReportsTableProps> = ({
  reports,
  loading,
  totalPages,
  currentPage,
  actions,
}) => {
  // Định nghĩa columns
  const columns: Column<CustomerReport>[] = [
    {
      header: "STT",
      className: "text-center w-12",
      cell: (_row: CustomerReport, index?: number) => (
        <span>{index !== undefined ? index + 1 + (currentPage - 1) * CUSTOMER_PAGE_SIZE : ""}</span>
      ),
    },
    {
      header: "ID Báo cáo",
      accessorKey: "reportID",
      sortable: true,
      className: "text-center",
      cell: (row) => <span className="font-mono text-sm">{row.reportID.slice(0, 8) + "..."}</span>,
    },
    {
      header: "Tiêu đề",
      accessorKey: "title",
      sortable: true,
      className: "text-left max-w-xs",
      cell: (row) => (
        <div className="truncate" title={row.title}>
          {row.title}
        </div>
      ),
    },
    {
      header: "Loại báo cáo",
      accessorKey: "reportType",
      className: "text-center",
      cell: (row) => getCustomerReportTypeBadge(row.reportType),
    },
    {
      header: "Trạng thái",
      accessorKey: "reportStatus",
      className: "text-center",
      cell: (row) => getCustomerReportStatusBadge(row.reportStatus),
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.onViewDetail(row)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Chi tiết
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.onDeleteReport(row)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={reports}
      loading={loading}
      emptyMessage="Bạn chưa có báo cáo nào."
      pagination={{
        currentPage,
        totalPages,
        onPageChange: actions.onPageChange,
      }}
      getRowId={(row) => row.reportID}
    />
  )
}

export default CustomerReportsTable
