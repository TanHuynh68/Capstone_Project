"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileText, User, Calendar, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react"
import {
  getCustomerReportStatusBadge,
} from "@/components/atoms/customer-reports/CustomerReportBadges"
import { formatFullDateWithDistance2 } from "@/utils"



interface CustomerReportDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  reportDetail: CustomerReportDetail | null
  loading: boolean
}

export default function CustomerReportDetailDialog({
  isOpen,
  onClose,
  reportDetail,
  loading,
}: CustomerReportDetailDialogProps) {
  if (!reportDetail && !loading) return null
    console.log('reportDetail: ', reportDetail)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Chi tiết tố cáo
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : reportDetail ? (
          <div className="space-y-6 py-2">
            {/* Basic Information */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Tiêu đề</Label>
                    <p className="text-sm bg-gray-100 p-2 rounded mt-1">{reportDetail.title}</p>
                  </div>
                                    <div>
                    <Label className="text-sm font-semibold text-gray-700">Ngày tạo</Label>
                    <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatFullDateWithDistance2(reportDetail?.createdAt)}
                    </p>
                  </div>
                  {/* <div>
                    <Label className="text-sm font-semibold text-gray-700">Loại tố cáo</Label>
                    <div className="mt-1">{getCustomerReportTypeBadge(reportDetail.reportType)}</div>
                  </div> */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Trạng thái</Label>
                    <div className="mt-1">{getCustomerReportStatusBadge(reportDetail.reportStatus)}</div>
                  </div>
                  {reportDetail.targetID && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Target ID</Label>
                      <p className="text-sm bg-gray-100 p-2 rounded mt-1 font-mono">{reportDetail.targetID}</p>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Nội dung tố cáo
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{reportDetail.content}</p>
                </div>
              </CardContent>
            </Card>

            {/* Reporter Information */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Thông tin người tố cáo
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Người tố cáo</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1">{reportDetail.reporter}</p>
                </div>
              </CardContent>
            </Card>

            {/* Resolution Information */}
            {(reportDetail.resolver || reportDetail.processNote || reportDetail.resolvedAt) && (
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {reportDetail.reportStatus === "Approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : reportDetail.reportStatus === "Rejected" ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-600" />
                    )}
                    Thông tin xử lý
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportDetail.resolver && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Người xử lý</Label>
                        <p className="text-sm bg-gray-100 p-2 rounded mt-1">{reportDetail.resolver}</p>
                      </div>
                    )}
                    {reportDetail.resolvedAt && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Ngày xử lý</Label>
                        <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatFullDateWithDistance2(reportDetail?.resolvedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                  {reportDetail.processNote && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Ghi chú xử lý</Label>
                      <div className="bg-gray-50 p-4 rounded-lg mt-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{reportDetail.processNote}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
