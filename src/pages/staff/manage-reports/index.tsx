import { useReportsLogic } from "@/hooks/useReportsLogic";
import ReportsFilterBar from "@/components/molecules/staff/manage-reports/ReportsFilterBar";
import ReportsTable from "@/components/organisms/staff/manage-reports/ReportsTable";
import StaffReportDetailDialog from "@/components/molecules/staff/manage-reports/StaffReportDetailDialog";
import ProcessReportDialog from "@/components/molecules/staff/manage-reports/ProcessReportDialog";

export default function ManagerReportsByStaff() {
  const {
    reports,
    loading,
    totalPages,
    filters,
    selectedReport,
    reportDetail,
    isProcessDialogOpen,
    isDetailDialogOpen,
    detailLoading,
    handleViewDetail,
    handleProcessReport,
    handleUpdateReportStatus,
    handleProcessSubmit,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleCloseDetailDialog,
    handleCloseProcessDialog,
  } = useReportsLogic();

  const tableActions = {
    onViewDetail: handleViewDetail,
    onProcessReport: handleProcessReport,
    onUpdateStatus: handleUpdateReportStatus,
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
    onPageChange: handlePageChange,
  };

  return (
    <div className=" p-6 space-y-6">
      {/* Main Content */}
      <ReportsFilterBar
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      <ReportsTable
        reports={reports}
        loading={loading}
        totalPages={totalPages}
        currentPage={filters.page}
        searchTerm={filters.searchTerm}
        actions={tableActions}
      />

      {/* Staff Report Detail Dialog */}
      <StaffReportDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        reportDetail={reportDetail}
        loading={detailLoading}
      />

      {/* Process Report Dialog */}
      <ProcessReportDialog
        isOpen={isProcessDialogOpen}
        onClose={handleCloseProcessDialog}
        report={selectedReport}
        onSubmit={handleProcessSubmit}
      />
    </div>
  );
}
