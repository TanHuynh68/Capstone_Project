import { ChartAreaInteractive } from '@/components/layouts/admin-layout/chart-area-interactive'
import { DataTable } from '@/components/layouts/admin-layout/data-table'
import { SectionCards } from '@/components/layouts/admin-layout/section-cards'
import data from "./data.json"

const AdminDashboard = () => {
    return (
        <div>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
        </div>
    )
}

export default AdminDashboard