"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { formatFullDateWithDistance2 } from "@/utils/date";

interface ReportResolutionInfoProps {
  reportDetail: {
    resolver?: string;
    processNote?: string;
    resolvedAt?: string;
    reportStatus: string;
  };
}

export default function ReportResolutionInfo({ reportDetail }: ReportResolutionInfoProps) {
  if (!reportDetail.resolver && !reportDetail.processNote && !reportDetail.resolvedAt) {
    return null;
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
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
              <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                {reportDetail.resolver}
              </p>
            </div>
          )}
          {reportDetail.resolvedAt && (
            <div>
              <Label className="text-sm font-semibold text-gray-700">Ngày xử lý</Label>
              <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                {formatFullDateWithDistance2(reportDetail.resolvedAt)}
              </p>
            </div>
          )}
        </div>
        {reportDetail.processNote && (
          <div>
            <Label className="text-sm font-semibold text-gray-700">Ghi chú xử lý</Label>
            <Textarea
              className="text-sm bg-gray-50 p-4 rounded mt-1 min-h-[100px] resize-none"
              value={reportDetail.processNote}
              readOnly
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
