import { AdminMetricCards } from "@/components/layouts/admin-layout/admin-metric-cards";
import { ChartAreaInteractive } from "@/components/layouts/admin-layout/chart-area-interactive";
import { DataTable } from "@/components/layouts/admin-layout/data-table";
import { SectionCards } from "@/components/layouts/admin-layout/section-cards";


const AdminDashboard = () => {
  return (
    <div>
      <div className="px-4 lg:px-6">
        <AdminMetricCards />
        <SectionCards />
      </div>
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable />
    </div>
  );
};

export default AdminDashboard;
