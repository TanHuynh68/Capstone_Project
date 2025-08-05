import { ChartAreaInteractive } from "@/components/layouts/admin-layout/chart-area-interactive";
import { DataTable } from "@/components/layouts/admin-layout/data-table";
import { SectionCards } from "@/components/layouts/admin-layout/section-cards";

const StaffDashboard = () => {
  return (
    <div>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable />
    </div>
  );
};

export default StaffDashboard;
