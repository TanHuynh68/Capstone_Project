"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { CUSTOMER_PAGE_SIZE } from "@/constants/customerReports.constants"
import CustomerReportService from "@/services/CustomerReportService"

export const useCustomerReportsLogic = () => {
  const [reports, setReports] = useState<CustomerReport[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(null)
  const [reportDetail, setReportDetail] = useState<CustomerReportDetail | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const [filters, setFilters] = useState<CustomerReportFilters>({
    reportType: "all",
    reportStatus: "all",
    page: 1,
  })

  const { getCustomerReports, getReportDetail, deleteReport } = CustomerReportService()

  // Lấy danh sách báo cáo
  const fetchReports = useCallback(
    async (params?: { showToast?: boolean }) => {
      setLoading(true)
      try {
        const query: CustomerReportsApiQuery = {
          reportType: filters.reportType === "all" ? undefined : Number(filters.reportType),
          reportStatus: filters.reportStatus === "all" ? undefined : Number(filters.reportStatus),
          page: filters.page,
          size: CUSTOMER_PAGE_SIZE,
        }

        const res = await getCustomerReports(query)
        const items = res?.responseRequestModel?.responseList?.items || []
        const total = res?.responseRequestModel?.responseList?.totalPages || 1

        setReports(items)
        setTotalPages(total)

        if (params?.showToast) {
          toast.success("Lấy danh sách báo cáo thành công")
        }
      } catch (error) {
        console.error("Fetch reports error:", error)
        toast.error("Lấy danh sách báo cáo thất bại")
      } finally {
        setLoading(false)
      }
    },
    [getCustomerReports, filters],
  )

  // Lấy chi tiết báo cáo
  const fetchReportDetail = useCallback(
    async (reportID: string) => {
      setDetailLoading(true)
      try {
        const detail = await getReportDetail(reportID)
        setReportDetail(detail?.responseRequestModel)
      } catch (error) {
        console.error("Fetch report detail error:", error)
        toast.error("Lấy chi tiết báo cáo thất bại")
      } finally {
        setDetailLoading(false)
      }
    },
    [getReportDetail],
  )

  // Xem chi tiết báo cáo
  const handleViewDetail = useCallback(
    (report: CustomerReport) => {
      setSelectedReport(report)
      setIsDetailDialogOpen(true)
      fetchReportDetail(report.reportID)
    },
    [fetchReportDetail],
  )

  // Xóa báo cáo
  const handleDeleteReport = useCallback((report: CustomerReport) => {
    setSelectedReport(report)
    setIsDeleteDialogOpen(true)
  }, [])

  // Xác nhận xóa báo cáo
  const handleConfirmDelete = useCallback(async () => {
    if (!selectedReport) return

    try {
      await deleteReport(selectedReport.reportID)
      toast.success("Xóa báo cáo thành công")
      setIsDeleteDialogOpen(false)
      setSelectedReport(null)
      fetchReports()
    } catch (error) {
      console.error("Delete report error:", error)
      toast.error("Xóa báo cáo thất bại")
      throw error
    }
  }, [selectedReport, deleteReport, fetchReports])

  // Xử lý thay đổi filter
  const handleFilterChange = useCallback((newFilters: Partial<CustomerReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  // Xử lý thay đổi trang
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  // Đóng dialog chi tiết
  const handleCloseDetailDialog = useCallback(() => {
    setIsDetailDialogOpen(false)
    setSelectedReport(null)
    setReportDetail(null)
  }, [])

  // Đóng dialog xóa
  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false)
    setSelectedReport(null)
  }, [])

  // Effect để fetch data khi filters thay đổi
  useEffect(() => {
    fetchReports()
  }, [filters.page, filters.reportType, filters.reportStatus])

  return {
    // State
    reports,
    loading,
    totalPages,
    filters,
    selectedReport,
    reportDetail,
    isDetailDialogOpen,
    isDeleteDialogOpen,
    detailLoading,

    // Actions
    fetchReports,
    handleViewDetail,
    handleDeleteReport,
    handleConfirmDelete,
    handleFilterChange,
    handlePageChange,
    handleCloseDetailDialog,
    handleCloseDeleteDialog,
  }
}
