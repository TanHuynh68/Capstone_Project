"use client";

import type { ProgressStep } from "@/types/orderManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Star } from "lucide-react";
import { useCurrentUser } from "@/components/utils";
import { ROLE } from "@/constants";

interface ProgressStepCardProps {
  step: ProgressStep;
  onEvaluate: () => void;
}

export default function ProgressStepCard({
  step,
  onEvaluate,
}: ProgressStepCardProps) {
  const currentUser = useCurrentUser();
  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "Design":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approval":
        return "bg-green-100 text-green-800";
      case "Revision":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{step.stepTitle}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStepTypeColor(step.progressStepType + "")}>
                {step.progressStepType}
              </Badge>
              <Badge
                variant={step.isApprovedByCustomer ? "default" : "secondary"}
              >
                {step.isApprovedByCustomer ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã duyệt
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Chờ duyệt
                  </>
                )}
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
            <h4 className="font-medium mb-2">Hình ảnh tiến độ:</h4>
            <div className="grid grid-cols-2 gap-2">
              {step.progressImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`Progress ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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

        {/* Customer Note */}
        {step.customerNote && (
          <div>
            <h4 className="font-medium mb-2">Ghi chú của khách hàng:</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">{step.customerNote}</p>
            </div>
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

        {/* Action Button */}
        {currentUser?.role === ROLE.CUSTOMER && (
          <div className="pt-4 border-t">
            <Button onClick={onEvaluate} className="w-full" variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Đánh giá
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
