import type React from "react";
import ReportsTable from "@/components/organisms/manage-reports/ReportsTable";
import ProcessReportDialog from "@/components/molecules/manage-reports/ProcessReportDialog";
import ReportsFilterBar from "@/components/molecules/manage-reports/ReportsFilterBar";
import { useReportsLogic } from "@/hooks/useReportsLogic";

const ManagerReportsByStaff: React.FC = () => {
  const {
    reports,
    loading,
    totalPages,
    filters,
    selectedReport,
    isProcessDialogOpen,
    handleProcessReport,
    handleUpdateReportStatus,
    handleProcessSubmit,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleCloseDialog,
  } = useReportsLogic();

  const tableActions: TableActions = {
    onProcessReport: handleProcessReport,
    onUpdateStatus: handleUpdateReportStatus,
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
    onPageChange: handlePageChange,
  };

  return (
    <div className="px-4 space-y-4">
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

      <ProcessReportDialog
        isOpen={isProcessDialogOpen}
        onClose={handleCloseDialog}
        report={selectedReport}
        onSubmit={handleProcessSubmit}
      />
    </div>
  );
};

export default ManagerReportsByStaff;
