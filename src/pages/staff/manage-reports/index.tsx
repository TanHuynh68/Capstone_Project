import { useReportsLogic } from "@/hooks/useReportsLogic";
import ReportsFilterBar from "@/components/molecules/staff/manage-reports/ReportsFilterBar";
import ReportsTable from "@/components/organisms/staff/manage-reports/ReportsTable";

export default function ManagerReportsByStaff() {
  const {
    reports,
    loading,
    totalPages,
    filters,
    handleViewDetail,
    handleProcessReport,
    handleUpdateReportStatus,
    handleSearch,
    handleFilterChange,
    handlePageChange,
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
    </div>
  );
}
