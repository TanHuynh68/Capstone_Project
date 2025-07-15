interface Report {
    reportID: string;
    reporter: string;
    targetID: string;
    title: string;
    reportType: string;
    reportStatus: string;
    createdAt: string;
}

interface TableFilters {
    reportType: string;
    reportStatus: string;
    searchTerm: string;
    page: number;
}

interface TableActions {
    onProcessReport: (report: Report) => void;
    onUpdateStatus: (reportID: string, status: number) => void;
    onSearch: (searchTerm: string) => void;
    onFilterChange: (filters: Partial<TableFilters>) => void;
    onPageChange: (page: number) => void;
}

interface ProcessReportData {
    reportID: string;
    processNote: string;
    accept: boolean;
}

interface ReportsApiQuery {
    search?: string;
    reportType?: number;
    reportStatus?: number;
    page: number;
    size: number;
}