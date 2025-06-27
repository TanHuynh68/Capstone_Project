"use client";

import type { ProgressStep } from "@/types/orderManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, X, Eye, Star } from "lucide-react";
import { useCurrentUser } from "@/components/utils";
import { ROLE } from "@/constants";

interface ProgressStepCardProps {
  step: ProgressStep;
  onEvaluate: () => void;
  onViewEvaluationDetail?: (stepId: string) => void;
}

export default function ProgressStepCard({
  step,
  onViewEvaluationDetail,
  onEvaluate,
}: ProgressStepCardProps) {
  const currentUser = useCurrentUser();
  const getStepTypeConfig = (type: string) => {
    switch (type) {
      case "NewDesign":
        return { label: "Thiết kế mới", color: "bg-blue-100 text-blue-800" };
      case "Review":
        return { label: "Đánh giá", color: "bg-yellow-100 text-yellow-800" };
      case "Approval":
        return { label: "Phê duyệt", color: "bg-green-100 text-green-800" };
      case "Revision":
        return { label: "Chỉnh sửa", color: "bg-red-100 text-red-800" };
      default:
        return { label: type, color: "bg-gray-100 text-gray-800" };
    }
  };

  const getApprovalStatus = () => {
    if (step.isApprovedByCustomer === null) {
      return {
        icon: Clock,
        label: "Chờ xem xét",
        color: "bg-gray-100 text-gray-800",
      };
    } else if (step.isApprovedByCustomer === true) {
      return {
        icon: CheckCircle,
        label: "Đã duyệt",
        color: "bg-green-100 text-green-800",
      };
    } else {
      return { icon: X, label: "Từ chối", color: "bg-red-100 text-red-800" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stepTypeConfig = getStepTypeConfig(step.progressStepType);
  const approvalStatus = getApprovalStatus();
  const ApprovalIcon = approvalStatus.icon;

  // Check if step has been evaluated (has approval data)
  const hasEvaluation = step.approval || step.isApprovedByCustomer !== null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{step.stepTitle}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={stepTypeConfig.color}>
                {stepTypeConfig.label}
              </Badge>
              <Badge className={approvalStatus.color}>
                <ApprovalIcon className="h-3 w-3 mr-1" />
                {approvalStatus.label}
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            Bước {step.stepNumber}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">Mô tả:</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress Images */}
        {step.progressImages && step.progressImages.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">
              Hình ảnh tiến độ ({step.progressImages.length}):
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {step.progressImages.slice(0, 4).map((image) => (
                <div
                  key={image.progressImageID}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group"
                >
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.imageName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                  {image.description && image.description !== "string" && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {step.progressImages.length > 4 && (
              <p className="text-xs text-gray-500 mt-1">
                +{step.progressImages.length - 4} ảnh khác
              </p>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <div>
              <div className="font-medium">Tạo lúc:</div>
              <div>{formatDate(step.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <div>
              <div className="font-medium">Cập nhật:</div>
              <div>{formatDate(step.updateAt)}</div>
            </div>
          </div>
        </div>

        {!hasEvaluation && currentUser.role === ROLE.CUSTOMER && (
          <Button onClick={onEvaluate} className="w-full" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Đánh giá bước này
          </Button>
        )}
        {/* Action Buttons */}
        <div className="pt-4 border-t space-y-2 mb-4">
          {/* View Evaluation Detail Button */}
          {hasEvaluation && onViewEvaluationDetail && (
            <Button
              onClick={() => {
                onViewEvaluationDetail(step.progressStepID),
                  console.log("step.progressStepID: ", step.progressStepID);
              }}
              className="w-full"
              variant="ghost"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết đánh giá
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
