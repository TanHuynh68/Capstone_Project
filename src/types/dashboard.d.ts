// dashboard chart
 interface DashboardStats {
  account: {
    totalAccount: number
    totalAccountActive: number
    numberOfCustomer: number
    numberOfDesigner: number
    totalNewAccountInFilter: number
    newCustomerInFilter: number
    newDesignerInFilter: number
  }
  order: {
    totalOrder: number
    totalRevenue: number
    orderDone: number
    orderInProgress: number
    orderPendingConflict: number
    orderCancelled: number
    totalOrderInFilter: number
    totalRevenueInFilter: number
    orderDoneInFilter: number
    orderInProgressInFilter: number
    orderPendingConflictInFilter: number
    orderCancelledInFilter: number
  }
  report: {
    totalReport: number
    reportPending: number
    reportResolved: number
    reportRejected: number
    totalReportInFilter: number
    reportPendingInFilter: number
    reportResolvedInFilter: number
    reportRejectedInFilter: number
  }
}

interface DashboardApiResponse {
  responseRequestModel: DashboardStats
}

interface DashboardApiRequest {
  startDate: string
  endDate: string
}

type ChartType = "account" | "order" | "report"

interface ChartDataPoint {
  date: string
  [key: string]: string | number
}

// Growth rate
interface GrowthRates {
  userGrowthRate: number
  orderGrowthRate: number
  reportGrowthRate: number
}

interface DateRange {
  startDate: string
  endDate: string
}

interface ComparisonDateRange {
  compareStart: string
  compareEnd: string
}