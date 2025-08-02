 interface DashboardStats {
  account: {
    totalAccount: number
    totalAccountActive: number
    numberOfCustomer: number
    numberOfDesigner: number
    newAccount: number
    newCustomer: number
    newDesigner: number
  }
  order: {
    totalOrder: number
    orderDone: number
    orderInProgress: number
    orderPendingConflict: number
    orderCancelled: number
  }
  report: {
    totalReport: number
    reportPending: number
    reportResolved: number
    reportRejected: number
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
