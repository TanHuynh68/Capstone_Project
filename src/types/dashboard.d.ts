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
  oldUser: number
  newUser: number
  userGrowthRate: number

  oldOrder: number
  newOrder: number
  orderGrowthRate: number

  oldReport: number
  newReport: number
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

//Admin manage staff
interface Staff {
  accountID: string
  fullName: string
  phoneNumber: string
  email: string
  genderDisplay: string
  roleDisplay: string
  isActive: boolean
  isVerify: boolean
  createdAt: string
}

interface StaffFilters {
  fullName: string
  page: number
  size: number
}

interface StaffResponse {
  data: Staff[]
  totalPages: number
  totalElements: number
}

interface CreateStaffRequest {
  fullName: string
  phoneNumber: string
  email: string
  gender: string
  password: string
  confirmPassword: string
  role: string
}

interface UpdateStaffActiveRequest {
  accountID: string
  isActive: boolean
}
