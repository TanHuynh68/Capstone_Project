import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProgressStepApproval } from "@/types/orderManagement";
import { CheckCircle, X, Star, Calendar } from "lucide-react";

interface EvaluationDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: ProgressStepApproval | null;
  stepTitle?: string;
}

export default function EvaluationDetailDialog({
  isOpen,
  onClose,
  evaluation,
}: EvaluationDetailDialogProps) {
  if (!evaluation) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 25) return "text-green-600";
    // if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getBorderColor = (score: number) => {
    if (score >= 25) return "border-green-600";
    // if (score >= 60) return "text-yellow-600";
    return "border-red-600";
  };

  // const getPassStatus = (isPass: boolean) => {
  //   return isPass
  //     ? { icon: CheckCircle, label: "Đạt yêu cầu", color: "bg-green-100 text-green-800" }
  //     : { icon: X, label: "Chưa đạt yêu cầu", color: "bg-red-100 text-red-800" }
  // }

  // const passStatus = getPassStatus(evaluation.isPass)

  const criteriaItems = [
    {
      label: "Điểm chất lượng chung",
      score: evaluation.qualityScore,
      key: "qualityScore",
      isScore: true,
    },
    {
      label: "Thiết kế chính xác",
      value: evaluation.isDesignAccurate,
      key: "isDesignAccurate",
    },
    {
      label: "Chất liệu đúng yêu cầu",
      value: evaluation.isMaterialCorrect,
      key: "isMaterialCorrect",
    },
    {
      label: "Màu sắc chính xác",
      value: evaluation.isColorCorrect,
      key: "isColorCorrect",
    },
    {
      label: "Chức năng đáp ứng",
      value: evaluation.isFunctionalityMet,
      key: "isFunctionalityMet",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[900px] overflow-y-auto">
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 justify-center text-foreground">
                <Star className="h-5 w-5 text-yellow-500" />
                Tổng quan đánh giá
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center rounded-full border-4 ${getBorderColor(
                      evaluation.totalScore
                    )} w-20 h-20 mx-auto`}
                  >
                    <span
                      className={`text-3xl font-bold ${getScoreColor(
                        evaluation.totalScore
                      )}`}
                    >
                      {evaluation.totalScore}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">Tổng điểm</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria with Quality Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                <div className="flex justify-between gap-2">
                  <div>Tiêu chí đánh giá</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(evaluation.createdAt)}</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criteriaItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.isScore ? (
                      <Badge
                        className={`${getScoreColor(item.score)} bg-opacity-20`}
                      >
                        <span className="font-bold text-lg">{item.score}</span>
                      </Badge>
                    ) : (
                      <Badge
                        className={
                          item.value
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {item.value ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đạt
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Chưa đạt
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Comment */}
          {evaluation.customerComment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Nhận xét của khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-foreground leading-relaxed">
                    {evaluation.customerComment}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
