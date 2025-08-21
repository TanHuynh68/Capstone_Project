"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Award,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

interface Benefit {
  benefitID: string;
  benefitType: number;
  title: string;
  description: string;
  version: number;
  customerScoreChange: number;
  designerScoreChange: number;
  customerCompensationRate: number;
  designerCompensationRate: number;
  isActive: boolean;
  createdByAdminID: string;
  createdAt: string;
}

interface BenefitResultDisplayProps {
  benefit: Benefit;
  reportStatus: string;
}

const mapBenefitType = (type: number) => {
  switch (type) {
    case 0:
      return "Chung";
    case 1:
      return "Đặt cọc";
    case 2:
      return "Giao hàng";
    case 3:
      return "Phạt";
    case 4:
      return "Bảo hành";
    default:
      return "Không xác định";
  }
};

export default function BenefitResultDisplay({
  benefit,
  reportStatus,
}: BenefitResultDisplayProps) {
  const isApproved = reportStatus === "Approved";

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader
        className={`rounded-t-lg ${
          isApproved
            ? "bg-gradient-to-r from-green-50 to-emerald-50"
            : "bg-gradient-to-r from-red-50 to-rose-50"
        }`}
      >
        <CardTitle className="text-lg flex items-center gap-2">
          {isApproved ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <span className={isApproved ? "text-green-700" : "text-red-700"}>
            {isApproved ? "Báo cáo đã được chấp nhận" : "Báo cáo đã bị từ chối"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Benefit Overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            <Label className="text-base font-semibold text-gray-700">
              Quyền lợi được áp dụng
            </Label>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-lg text-purple-700 mb-2">
              {benefit.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {mapBenefitType(benefit.benefitType)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Phiên bản {benefit.version}
              </Badge>
            </div>
            {benefit.description && (
              <p className="text-sm text-purple-600 bg-white p-3 rounded border">
                {benefit.description}
              </p>
            )}
          </div>
        </div>

        {/* Impact Details */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-700">
            Chi tiết tác động
          </Label>

          {/* Customer Impact */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <Label className="text-sm font-semibold text-blue-700">
                Tác động đến Khách hàng
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thay đổi điểm:</span>
                  <div className="flex items-center gap-1">
                    {benefit.customerScoreChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : benefit.customerScoreChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : null}
                    <span
                      className={`font-medium ${
                        benefit.customerScoreChange > 0
                          ? "text-green-600"
                          : benefit.customerScoreChange < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {benefit.customerScoreChange > 0 ? "+" : ""}
                      {benefit.customerScoreChange}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Tỷ lệ bồi thường:
                  </span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-600">
                      {benefit.customerCompensationRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Designer Impact */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <Label className="text-sm font-semibold text-purple-700">
                Tác động đến Nhà thiết kế
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thay đổi điểm:</span>
                  <div className="flex items-center gap-1">
                    {benefit.designerScoreChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : benefit.designerScoreChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : null}
                    <span
                      className={`font-medium ${
                        benefit.designerScoreChange > 0
                          ? "text-green-600"
                          : benefit.designerScoreChange < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {benefit.designerScoreChange > 0 ? "+" : ""}
                      {benefit.designerScoreChange}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Tỷ lệ bồi thường:
                  </span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-purple-600">
                      {benefit.designerCompensationRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 space-y-1">
            <div>ID Quyền lợi: {benefit.benefitID}</div>
            <div>
              Ngày tạo:{" "}
              {new Date(benefit.createdAt).toLocaleDateString("vi-VN")}
            </div>
            <div>
              Trạng thái:{" "}
              {benefit.isActive ? "Đang hoạt động" : "Không hoạt động"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
