interface CustomerReport {
    reportID: string
    title: string
    reportType: string
    reportStatus: string
    createdAt: string
}

interface ReportDetail {
    reportID: string
    reporter: string
    targetID: string
    title: string
    content: string
    reportType: string
    reportStatus: string
    createdAt: string
    resolver?: string
    processNote?: string
    resolvedAt?: string
    reportImages: ReportImages[]
}

interface ReportImages {
    reportImageID: string,
    imageURL: string,
    imageNote: string,
    uploadAt: string
}
interface CustomerReportFilters {
    reportType: string
    reportStatus: string
    page: number
}

interface CustomerReportsApiQuery {
    reportType?: number
    reportStatus?: number
    page: number
    size: number
}

interface CustomerTableActions {
    onViewDetail: (report: CustomerReport) => void
    onDeleteReport: (report: CustomerReport) => void
    onFilterChange: (filters: Partial<CustomerReportFilters>) => void
    onPageChange: (page: number) => void
}