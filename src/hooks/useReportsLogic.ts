"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { PAGE_SIZE } from "@/constants/reports.constants"
import { filterReportsBySearch } from "@/utils/reports.utils"
import ReportService from "@/services/ReportService"
import CustomerReportService from "@/services/CustomerReportService"
export const useReportsLogic = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null)
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const [filters, setFilters] = useState<TableFilters>({
    reportType: "all",
    reportStatus: "all",
    searchTerm: "",
    page: 1,
  })

  const { getReportsByStaff, processReport } = ReportService()
  const { getReportDetail } = CustomerReportService()
  // Lấy danh sách báo cáo
  const fetchReports = useCallback(
    async (params?: { showToast?: boolean }) => {
      setLoading(true)
      try {
        const query: ReportsApiQuery = {
          search: filters.searchTerm || undefined,
          reportType: filters.reportType === "all" ? undefined : Number(filters.reportType),
          reportStatus: filters.reportStatus === "all" ? undefined : Number(filters.reportStatus),
          page: filters.page,
          size: PAGE_SIZE,
        }

        const res = await getReportsByStaff(query)
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
    [getReportsByStaff, filters],
  )

  // Lấy chi tiết báo cáo
  const fetchReportDetail = useCallback(
    async (reportID: string) => {
      setDetailLoading(true)
      try {
        const detail = await getReportDetail(reportID)
        setReportDetail(detail.responseRequestModel)
      } catch (error) {
        console.error("Fetch report detail error:", error)
      } finally {
        setDetailLoading(false)
      }
    },
    [getReportDetail],
  )

  // Xem chi tiết báo cáo
  const handleViewDetail = useCallback(
    (report: Report) => {
      setSelectedReport(report)
      setIsDetailDialogOpen(true)
      fetchReportDetail(report.reportID)
    },
    [fetchReportDetail],
  )

  // Xử lý báo cáo
  const handleProcessReport = useCallback((report: Report) => {
    setSelectedReport(report)
    setIsProcessDialogOpen(true)
  }, [])

  // Cập nhật trạng thái báo cáo
  const handleUpdateReportStatus = useCallback(
    async (
      // reportID: string, newStatus: number
    ) => {
      try {
        // TODO: Implement API call
        // await updateReportStatus(reportID, newStatus);
        toast.success("Cập nhật trạng thái báo cáo thành công")
        fetchReports()
      } catch (error) {
        console.error("Update status error:", error)
        toast.error("Cập nhật trạng thái báo cáo thất bại")
      }
    },
    [fetchReports],
  )

  // Xử lý submit báo cáo
  const handleProcessSubmit = useCallback(
    async (data: ProcessReportData) => {
      try {
        await processReport(data)
        toast.success("Xử lý báo cáo thành công")
        setIsProcessDialogOpen(false)
        setSelectedReport(null)
        fetchReports()
        return true
      } catch (error) {
        console.error("Process report error:", error)
        toast.error("Xử lý báo cáo thất bại")
        return false
      }
    },
    [processReport, fetchReports],
  )

  // Xử lý tìm kiếm
  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, page: 1 }))
  }, [])

  // Xử lý thay đổi filter
  const handleFilterChange = useCallback((newFilters: Partial<TableFilters>) => {
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

  // Đóng dialog xử lý
  const handleCloseProcessDialog = useCallback(() => {
    setIsProcessDialogOpen(false)
    setSelectedReport(null)
  }, [])

  // Lọc báo cáo theo từ khóa tìm kiếm
  const filteredReports = useMemo(() => {
    return filterReportsBySearch(reports, filters.searchTerm)
  }, [reports, filters.searchTerm])

  // Effect để fetch data khi filters thay đổi
  useEffect(() => {
    fetchReports()
  }, [filters.page, filters.reportType, filters.reportStatus])

  return {
    // State
    reports: filteredReports,
    loading,
    totalPages,
    filters,
    selectedReport,
    reportDetail,
    isProcessDialogOpen,
    isDetailDialogOpen,
    detailLoading,

    // Actions
    fetchReports,
    handleViewDetail,
    handleProcessReport,
    handleUpdateReportStatus,
    handleProcessSubmit,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleCloseDetailDialog,
    handleCloseProcessDialog,
  }
}
