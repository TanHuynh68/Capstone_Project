"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Loader2,
  X,
} from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { getCustomerReportStatusBadge } from "@/components/atoms/customer-reports/CustomerReportBadges";

import BenefitService from "@/services/BenefitService";
import {
  processReportSchema,
  type ProcessReportFormData,
} from "@/schemas/report/updateReportSchema";
import type { ZodError } from "zod";
import PaymentReportDetail from "@/components/molecules/staff/manage-reports/PaymentReportDetail";
import ShippingReportDetail from "@/components/molecules/staff/manage-reports/ShippingReportDetail";
import PostReportDetail from "@/components/molecules/staff/manage-reports/PostReportDetail";
import OrderReportDetail from "@/components/molecules/staff/manage-reports/OrderReportDetail";
import BenefitResultDisplay from "@/components/molecules/staff/manage-reports/BenefitResultDisplay";
import { useNavigate, useParams } from "react-router-dom";
import ReportService from "@/services/ReportService";

import type {
  OrderTargetDetail,
  PostTargetDetail,
  ShippingTargetDetail,
  ReportDetail,
} from "./ReportDetailType";
import ReportImages from "@/components/atoms/staff/manage-reports/ReportImages";
import { PATH } from "@/routes/path";
import { useReportsLogic } from "@/hooks/useReportsLogic";

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

// enum ReportTypeEnum {
//   GeneralReport = "GeneralReport",
//   AccountReport = "AccountReport",
//   PostReport = "PostReport",
//   OrderReport = "OrderReport",
//   ShippingReport = "ShippingReport",
//   OrderWalletReport = "OrderWalletReport",
//   PaymentReport = "PaymentReport",
//   CommunityFeedback = "CommunityFeedback",
// }

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

const mapBenefitType = (type: string) => {
  switch (type) {
    case "General":
      return "Chung";
    case "PostAndOffer":
      return "Bài viết và Đề xuất";
    case "Delivery":
      return "Giao hàng";
    case "OrderAndProgress":
      return "Đơn hàng và Tiến độ";
    default:
      return type;
  }
};

const getValidBenefitTypesForReport = (reportType: string): string[] => {
  switch (reportType) {
    case "GeneralReport":
    case "AccountReport":
    case "OrderWalletReport":
    case "PaymentReport":
    case "CommunityFeedback":
      return ["General"];
    case "PostReport":
      return ["General", "PostAndOffer"];
    case "OrderReport":
      return ["OrderAndProgress"];
    case "ShippingReport":
      return ["Delivery"];
    default:
      return ["General"]; // Default fallback
  }
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportId = id;

  // States
  const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { getReport } = ReportService();
  const { handleProcessSubmit } = useReportsLogic();

  // Form states
  const [formData, setFormData] = useState<ProcessReportFormData>({
    reportID: "",
    processNote: "",
    accept: true,
    benefitID: "",
  });

  // Benefit states
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<any | null>(null);

  const { getBenefits, getBenefitDetail } = BenefitService();

  useEffect(() => {
    if (reportId) {
      fetchReportDetail(reportId);
    }
  }, [reportId]);

  useEffect(() => {
    if (reportDetail) {
      fetchBenefits("", formData.accept);
    }
  }, [formData.accept, reportDetail]); // Updated to use reportDetail directly

  const fetchReportDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await getReport(id);
      setReportDetail(response.responseRequestModel);
      setFormData({
        reportID: response.responseRequestModel.reportID,
        processNote: "",
        accept: true,
        benefitID: "",
      });
    } catch (error) {
      console.error("Error fetching report detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch benefits with filtering based on accept state
  const fetchBenefits = async (searchTerm = "", acceptState = true) => {
    setBenefitsLoading(true);
    try {
      const response = await getBenefits({
        title: searchTerm,
        page: 1,
        size: 50,
      });
      let filteredBenefits =
        response.responseRequestModel.responseList.items || [];
      // If accept is false, only show General benefits
      if (!acceptState) {
        filteredBenefits = filteredBenefits.filter(
          (benefit: any) => benefit.benefitType === "General"
        );
      } else {
        if (reportDetail?.reportType) {
          const validBenefitTypes = getValidBenefitTypesForReport(
            reportDetail.reportType
          );
          filteredBenefits = filteredBenefits.filter((benefit: any) =>
            validBenefitTypes.includes(benefit.benefitType)
          );
        }
      }
      setBenefits(filteredBenefits);
    } catch (error) {
      console.error("Error fetching benefits:", error);
      setBenefits([]);
    } finally {
      setBenefitsLoading(false);
    }
  };

  // Fetch benefit detail when selected
  const fetchBenefitDetail = async (benefitID: string) => {
    try {
      const benefit = await getBenefitDetail(benefitID);
      setSelectedBenefit(benefit.responseRequestModel);
    } catch (error) {
      console.error("Error fetching benefit detail:", error);
    }
  };

  const handleInputChange = (
    field: keyof ProcessReportFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Handle accept state change - reset benefit selection and refetch
    if (field === "accept") {
      setFormData((prev) => ({ ...prev, benefitID: "" }));
      setSelectedBenefit(null);
      fetchBenefits("", value as boolean);
    }

    // Handle benefit selection
    if (field === "benefitID" && typeof value === "string") {
      if (value) {
        fetchBenefitDetail(value);
      } else {
        setSelectedBenefit(null);
      }
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      processReportSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as ZodError;
        const newErrors: Record<string, string> = {};
        zodError.issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    console.log("formData: ", formData);
    setIsSubmitting(true);
    try {
      const response = await handleProcessSubmit(formData);
      if (response) {
        fetchReportDetail(reportId + "");
      }
    } catch (error) {
      console.error("Error processing report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTargetDetail = () => {
    if (!reportDetail?.targetDetail) {
      if (reportDetail?.reportType === "PaymentReport") {
        return <PaymentReportDetail />;
      }
      return null;
    }

    switch (reportDetail.reportType) {
      case "ShippingReport":
        return (
          <ShippingReportDetail
            targetDetail={reportDetail.targetDetail as ShippingTargetDetail}
          />
        );
      case "PostReport":
        return (
          <PostReportDetail
            targetDetail={reportDetail.targetDetail as PostTargetDetail}
          />
        );
      case "OrderReport":
        return (
          <OrderReportDetail
            targetDetail={reportDetail.targetDetail as OrderTargetDetail}
          />
        );
      case "PaymentReport":
        return <PaymentReportDetail />;
      default:
        return null;
    }
  };

  // Check if report is resolved and has benefit data
  const isReportResolved =
    reportDetail?.reportStatus === "Approved" ||
    reportDetail?.reportStatus === "Rejected";
  const hasBenefitData = reportDetail?.benefit;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải chi tiết báo cáo...</span>
        </div>
      </div>
    );
  }

  if (!reportDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy báo cáo
          </h2>
          <p className="text-gray-600 mb-4">
            Báo cáo bạn đang tìm kiếm không tồn tại.
          </p>
          <Button onClick={() => navigate(`${PATH.STAFF_REPORT_DETAIL}/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6 max-w-8xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Chi tiết báo cáo vi phạm
              </h1>
            </div>
          </div>
          {getCustomerReportStatusBadge(reportDetail.reportStatus)}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Report Details (2/3 width) */}
          <div className="col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Người báo cáo
                    </Label>
                    <p className="text-sm  p-2 rounded mt-1 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {reportDetail.reporter}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </Label>
                    <p className="text-sm  p-2 rounded mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatFullDateWithDistance2(reportDetail.createdAt)}
                    </p>
                  </div>
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
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Tiêu đề
                  </Label>
                  <p className="text-sm  p-2 rounded mt-1">
                    {reportDetail.title}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Nội dung báo cáo
                  </Label>
                  <Textarea
                    className="text-sm  p-2 rounded mt-1 min-h-[100px] resize-none"
                    value={reportDetail.content}
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>

            {/* Target Detail */}
            {renderTargetDetail()}

            {/* Report Images */}
            {reportDetail.reportImages &&
              reportDetail.reportImages.length > 0 && (
                <ReportImages reportImages={reportDetail.reportImages} />
              )}

            {/* Resolution Info (if resolved) */}
            {(reportDetail.resolver ||
              reportDetail.processNote ||
              reportDetail.resolvedAt) && (
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
                        <Label className="text-sm font-semibold text-gray-700">
                          Người xử lý
                        </Label>
                        <p className="text-sm  p-2 rounded mt-1 flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {reportDetail.resolver}
                        </p>
                      </div>
                    )}
                    {reportDetail.resolvedAt && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">
                          Ngày xử lý
                        </Label>
                        <p className="text-sm  p-2 rounded mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatFullDateWithDistance2(reportDetail.resolvedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                  {reportDetail.processNote && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">
                        Ghi chú xử lý
                      </Label>
                      <Textarea
                        className="text-sm bg-gray-50 p-4 rounded mt-1 min-h-[100px] resize-none"
                        value={reportDetail.processNote}
                        readOnly
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Process Form or Benefit Display (1/3 width) */}
          <div className="">
            <div className="sticky top-6 space-y-6">
              {/* Show Benefit Result if report is resolved, otherwise show Process Form */}
              {isReportResolved && hasBenefitData ? (
                <BenefitResultDisplay
                  benefit={reportDetail.benefit}
                  reportStatus={reportDetail.reportStatus}
                />
              ) : reportDetail.reportStatus === "Pending" ? (
                <>
                  {/* Process Form */}
                  <Card className="shadow-sm border-gray-200">
                    <CardHeader className="bg-gradient-to-r rounded-t-lg">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-2 h-2  rounded-full"></div>
                        Quyết định xử lý
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      {/* Accept/Reject Decision */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                          Quyết định <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            {formData.accept ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <Label
                              htmlFor="accept-switch"
                              className="text-sm font-medium"
                            >
                              {formData.accept
                                ? "Chấp nhận tố cáo"
                                : "Từ chối tố cáo"}
                            </Label>
                          </div>
                          <Switch
                            id="accept-switch"
                            checked={formData.accept}
                            onCheckedChange={(checked) =>
                              handleInputChange("accept", checked)
                            }
                          />
                        </div>
                        {errors.accept && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.accept}
                          </p>
                        )}
                      </div>

                      {/* Benefit Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                          Chọn quyền lợi áp dụng{" "}
                          <span className="text-red-500">*</span>
                        </Label>

                        {/* Info message for reject state */}
                        {!formData.accept ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-700 flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Khi từ chối tố cáo, chỉ có thể áp dụng quyền lợi
                              loại "Chung"
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700 flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Quyền lợi được lọc theo loại báo cáo:{" "}
                              {mapReportType(reportDetail?.reportType || "")}
                              {reportDetail?.reportType && (
                                <Badge
                                  variant="outline"
                                  className="text-xs ml-2"
                                >
                                  {getValidBenefitTypesForReport(
                                    reportDetail.reportType
                                  )
                                    .map((type) => mapBenefitType(type))
                                    .join(", ")}
                                </Badge>
                              )}
                            </p>
                          </div>
                        )}

                        {/* Benefit Select */}
                        <Select
                          value={formData.benefitID}
                          onValueChange={(value) =>
                            handleInputChange("benefitID", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.benefitID ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Chọn quyền lợi phù hợp" />
                          </SelectTrigger>
                          <SelectContent className="">
                            {benefitsLoading ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="ml-2">Đang tải...</span>
                              </div>
                            ) : benefits.length > 0 ? (
                              benefits.map((benefit: any) => (
                                <SelectItem
                                  key={benefit.benefitID}
                                  value={benefit.benefitID}
                                >
                                  <div className="flex items-start gap-2">
                                    <Award className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
                                    <div className="flex flex-col">
                                      <div className="font-medium break-words">
                                        {benefit.title}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {mapBenefitType(benefit.benefitType)} -
                                        v{benefit.version}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                {!formData.accept
                                  ? "Không tìm thấy quyền lợi loại 'Chung' nào"
                                  : "Không tìm thấy quyền lợi nào"}
                              </div>
                            )}
                          </SelectContent>
                        </Select>

                        {errors.benefitID && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.benefitID}
                          </p>
                        )}
                      </div>

                      {/* Process Note */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="processNote"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Ghi chú xử lý <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="processNote"
                          value={formData.processNote}
                          onChange={(e) =>
                            handleInputChange("processNote", e.target.value)
                          }
                          placeholder={
                            formData.accept
                              ? "Nhập lý do chấp nhận tố cáo và các hành động đã thực hiện..."
                              : "Nhập lý do từ chối tố cáo..."
                          }
                          rows={4}
                          className={`resize-none ${
                            errors.processNote
                              ? "border-red-500 focus:border-red-500 bg-red-50"
                              : "focus:border-blue-500"
                          }`}
                        />
                        {errors.processNote && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.processNote}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full ${
                          formData.accept
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : formData.accept ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Chấp nhận tố cáo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Từ chối tố cáo
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Selected Benefit Preview */}
                  {selectedBenefit && (
                    <Card className="shadow-sm border-gray-200">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5 text-purple-600" />
                          Chi tiết quyền lợi
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div>
                          <h3 className="font-semibold text-lg text-purple-700">
                            {selectedBenefit.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {mapBenefitType(selectedBenefit.benefitType)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Version {selectedBenefit.version}
                            </Badge>
                          </div>
                        </div>

                        {selectedBenefit.description && (
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Mô tả:
                            </Label>
                            <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                              {selectedBenefit.description}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-blue-700">
                              Khách hàng
                            </Label>
                            <div className="p-2 bg-blue-50 rounded text-sm">
                              <div className="flex justify-between">
                                <span>Điểm:</span>
                                <span
                                  className={`font-medium ${
                                    selectedBenefit.customerScoreChange >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {selectedBenefit.customerScoreChange > 0
                                    ? "+"
                                    : ""}
                                  {selectedBenefit.customerScoreChange}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bồi thường:</span>
                                <span className="font-medium text-blue-600">
                                  {selectedBenefit.customerCompensationRate}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-purple-700">
                              Nhà thiết kế
                            </Label>
                            <div className="p-2 bg-purple-50 rounded text-sm">
                              <div className="flex justify-between">
                                <span>Điểm:</span>
                                <span
                                  className={`font-medium ${
                                    selectedBenefit.designerScoreChange >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {selectedBenefit.designerScoreChange > 0
                                    ? "+"
                                    : ""}
                                  {selectedBenefit.designerScoreChange}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bồi thường:</span>
                                <span className="font-medium text-purple-600">
                                  {selectedBenefit.designerCompensationRate}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
