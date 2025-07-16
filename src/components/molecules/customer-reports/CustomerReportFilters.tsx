"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CUSTOMER_REPORT_STATUSES, CUSTOMER_REPORT_TYPES } from "@/constants/customerReports.constants"

interface CustomerReportFiltersProps {
  filters: CustomerReportFilters
  onFilterChange: (filters: Partial<CustomerReportFilters>) => void
}

const CustomerReportFiltersComponent: React.FC<CustomerReportFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <Select value={filters.reportType} onValueChange={(val) => onFilterChange({ reportType: val })}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn loại tố cáo" />
          </SelectTrigger>
          <SelectContent>
            {CUSTOMER_REPORT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.reportStatus} onValueChange={(val) => onFilterChange({ reportStatus: val })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {CUSTOMER_REPORT_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default CustomerReportFiltersComponent
