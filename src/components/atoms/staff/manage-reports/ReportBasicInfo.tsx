"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, User } from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { getCustomerReportStatusBadge } from "@/components/atoms/customer-reports/CustomerReportBadges";

interface ReportBasicInfoProps {
  reportDetail: {
    reportID: string;
    reporter: string;
    targetID: string;
    title: string;
    content: string;
    reportType: string;
    reportStatus: string;
    createdAt: string;
  };
}

const mapReportType = (type: string) => {
  switch (type) {
    case "ShippingReport":
      return "Báo cáo giao hàng";
    case "PostReport":
      return "Báo cáo bài đăng";
    case "PaymentReport":
      return "Báo cáo thanh toán";
    case "OrderReport":
      return "Báo cáo đơn hàng";
    case "UserReport":
      return "Báo cáo người dùng";
    default:
      return type;
  }
};

export default function ReportBasicInfo({
  reportDetail,
}: ReportBasicInfoProps) {
  return (
    <Card className="shadow-sm border-gray-200 mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <div className="flex justify-between w-full">
            <div>Thông tin cơ bản</div>
            {getCustomerReportStatusBadge(reportDetail.reportStatus)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Loại báo cáo
            </Label>
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                {mapReportType(reportDetail.reportType)}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Ngày tạo
            </Label>
            <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              {formatFullDateWithDistance2(reportDetail.createdAt)}
            </p>
          </div>
        </div>
        <div>
          <Label className="text-sm font-semibold text-gray-700">
            Người báo cáo
          </Label>
          <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            {reportDetail.reporter}
          </p>
        </div>
        <div>
          <Label className="text-sm font-semibold text-gray-700">Tiêu đề</Label>
          <p className="text-sm bg-gray-100 p-2 rounded mt-1">
            {reportDetail.title}
          </p>
        </div>
        <div>
          <Label className="text-sm font-semibold text-gray-700">
            Nội dung báo cáo
          </Label>
          <Textarea
            className="text-sm bg-gray-100 p-2 rounded mt-1 min-h-[100px] resize-none"
            value={reportDetail.content}
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
}
