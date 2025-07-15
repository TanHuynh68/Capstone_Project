
import CustomerReportsTable from "@/components/organisms/customer-reports/CustomerReportsTable"
import CustomerReportDetailDialog from "@/components/molecules/customer-reports/CustomerReportDetailDialog"
import CustomerDeleteReportDialog from "@/components/molecules/customer-reports/CustomerDeleteReportDialog"
import CustomerReportFiltersComponent from "@/components/molecules/customer-reports/CustomerReportFilters"
import { useCustomerReportsLogic } from "@/hooks/useCustomerReportsLogic"

const CustomerReportsPage = () => {
  const {
    reports,
    loading,
    totalPages,
    filters,
    selectedReport,
    reportDetail,
    isDetailDialogOpen,
    isDeleteDialogOpen,
    detailLoading,
    handleViewDetail,
    handleDeleteReport,
    handleConfirmDelete,
    handleFilterChange,
    handlePageChange,
    handleCloseDetailDialog,
    handleCloseDeleteDialog,
  } = useCustomerReportsLogic()

  const tableActions: CustomerTableActions = {
    onViewDetail: handleViewDetail,
    onDeleteReport: handleDeleteReport,
    onFilterChange: handleFilterChange,
    onPageChange: handlePageChange,
  }

  return (
    <div className="px-4 space-y-4">
      <div className="flex items-center justify-center  mt-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý báo cáo của tôi</h1>
          <p className="text-gray-600">Xem và quản lý các báo cáo bạn đã tạo</p>
        </div>
      </div>

      <CustomerReportFiltersComponent filters={filters} onFilterChange={handleFilterChange} />

      <CustomerReportsTable
        reports={reports}
        loading={loading}
        totalPages={totalPages}
        currentPage={filters.page}
        actions={tableActions}
      />

      <CustomerReportDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        reportDetail={reportDetail}
        loading={detailLoading}
      />

      <CustomerDeleteReportDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        report={selectedReport}
      />
    </div>
  )
}

export default CustomerReportsPage
