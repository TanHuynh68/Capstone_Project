"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  X,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
} from "lucide-react";
import {
  processReportSchema,
  type ProcessReportFormData,
} from "@/schemas/updateReportSchema";
import type { ZodError } from "zod";
import { formatFullDateWithDistance2 } from "@/utils";
import { getCustomerReportStatusBadge } from "@/components/atoms/customer-reports/CustomerReportBadges";
import BenefitService from "@/services/BenefitService";
import { Badge } from "@/components/ui/badge";

interface Report {
  reportID: string;
  reporter: string;
  targetID: string;
  title: string;
  reportType: string;
  reportStatus: string;
  createdAt: string;
}

interface ProcessReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onSubmit: (data: ProcessReportFormData) => Promise<boolean>;
}

export default function ProcessReportDialog({
  isOpen,
  onClose,
  report,
  onSubmit,
}: ProcessReportDialogProps) {
  const [formData, setFormData] = useState<ProcessReportFormData>({
    reportID: "",
    processNote: "",
    accept: true,
    benefitID: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Benefit states
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [benefitSearch, setBenefitSearch] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

  const { getBenefits, getBenefitDetail } = BenefitService();

  // Fetch benefits with filtering based on accept state
  const fetchBenefits = async (searchTerm = "", acceptState = true) => {
    setBenefitsLoading(true);
    try {
      const response = await getBenefits({
        title: searchTerm,
        page: 1,
        size: 50,
      });

      console.log("fetchBenefits:", response);

      let filteredBenefits = response.responseRequestModel.responseList.items || [];

      // If accept is false, only show General benefits
      if (!acceptState) {
        filteredBenefits = filteredBenefits.filter(
          (benefit: any) => benefit.benefitType === "General"
        );
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
      setSelectedBenefit(benefit);
    } catch (error) {
      console.error("Error fetching benefit detail:", error);
    }
  };

  // Update form data when report changes
  useEffect(() => {
    if (report) {
      setFormData({
        reportID: report.reportID,
        processNote: "",
        accept: true,
        benefitID: "",
      });
      setErrors({});
      setSelectedBenefit(null);
    }
  }, [report]);

  // Fetch benefits when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchBenefits("", formData.accept);
    }
  }, [isOpen]);

  // Search benefits with accept state filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        fetchBenefits(benefitSearch, formData.accept);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [benefitSearch, isOpen, formData.accept]);

  const handleInputChange = (
    field: keyof ProcessReportFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Handle accept state change - reset benefit selection and refetch
    if (field === "accept") {
      setFormData((prev) => ({ ...prev, benefitID: "" }));
      setSelectedBenefit(null);
      // Fetch benefits with new accept state
      fetchBenefits(benefitSearch, value as boolean);
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

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        handleClose();
        resetForm();
      }
    } catch (error) {
      console.error("Error processing report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      reportID: "",
      processNote: "",
      accept: true,
      benefitID: "",
    });
    setErrors({});
    setSelectedBenefit(null);
    setBenefitSearch("");
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  const mapBenefitType = (type: string) => {
    switch (type) {
      case "General":
        return "Chung";
      case "Deposit":
        return "Đặt cọc";
      case "Delivery":
        return "Giao hàng";
      case "Penalty":
        return "Phạt";
      case "Warranty":
        return "Bảo hành";
      default:
        return type;
    }
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[1200px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Giải quyết tố cáo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex justify-between pt-1 w-full">
                  <div>Thông tin cơ bản</div>
                  {getCustomerReportStatusBadge(report.reportStatus)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Tiêu đề
                  </Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1">
                    {report.title}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Ngày tạo
                  </Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {formatFullDateWithDistance2(report?.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            {/* Process Form */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
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
                  {!formData.accept && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-700 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Khi từ chối tố cáo, chỉ có thể áp dụng quyền lợi loại
                        "Chung"
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
                    <SelectContent className="max-h-60">
                      {benefitsLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Đang tải...</span>
                        </div>
                      ) : benefits.length > 0 ? (
                        benefits.map((benefit) => (
                          <SelectItem
                            key={benefit.benefitID}
                            value={benefit.benefitID}
                          >
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-blue-500" />
                              <div>
                                <div className="font-medium">
                                  {benefit.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {mapBenefitType(benefit.benefitType)} - v
                                  {benefit.version}
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
              </CardContent>
            </Card>

            {/* Selected Benefit Preview */}
            {selectedBenefit && (
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Chi tiết quyền lợi được chọn
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

                  <div className="grid grid-cols-2 gap-4">
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
                            {selectedBenefit.customerScoreChange > 0 ? "+" : ""}
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
                            {selectedBenefit.designerScoreChange > 0 ? "+" : ""}
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Lưu ý:</span> Quyết định này sẽ được
            ghi lại và không thể hoàn tác
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 bg-transparent"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 ${
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
