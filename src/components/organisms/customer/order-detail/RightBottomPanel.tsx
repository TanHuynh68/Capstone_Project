"use client";

import type {
  EvaluationCriteria,
  ProgressStepApproval,
  ProgressStepResponse,
} from "@/types/orderManagement";

import ProgressStepCard from "@/components/molecules/customer/order-detail/ProgressStepCard";
import EvaluationForm from "@/components/molecules/customer/order-detail/EvaluationForm";
import EvaluationDetailDialog from "@/components/molecules/customer/order-detail/EvaluationDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface RightBottomPanelProps {
  progressSteps: ProgressStepResponse[];
  selectedPhaseId: string | null;
  isEvaluating: boolean;
  evaluatingStepId: string | null;
  loadingSteps: boolean;
  onStartEvaluation: (stepId: string) => void;
  onFinishEvaluation: () => void;
  onEvaluationSubmit: (stepId: string, criteria: EvaluationCriteria) => void;
  onFetchEvaluationDetail?: (
    stepId: string
  ) => Promise<ProgressStepApproval | null>;
}

export default function RightBottomPanel({
  progressSteps,
  selectedPhaseId,
  isEvaluating,
  evaluatingStepId,
  loadingSteps,
  onStartEvaluation,
  onFinishEvaluation,
  onEvaluationSubmit,
  onFetchEvaluationDetail,
}: RightBottomPanelProps) {
  const [evaluationDetailDialog, setEvaluationDetailDialog] = useState<{
    isOpen: boolean;
    evaluation: ProgressStepApproval | null;
    stepTitle: string;
  }>({
    isOpen: false,
    evaluation: null,
    stepTitle: "",
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [selectedPhaseId]);

  console.log("progressSteps: ", progressSteps);

  const handleEvaluate = (stepId: string) => {
    onStartEvaluation(stepId);
  };

  const handleEvaluationSubmit = (criteria: EvaluationCriteria) => {
    if (evaluatingStepId) {
      console.log("evaluatingStepId: ", evaluatingStepId);
      onEvaluationSubmit(evaluatingStepId, criteria);
      onFinishEvaluation();
    }
  };

  const handleBackToNormal = () => {
    onFinishEvaluation();
  };

  const handleViewEvaluationDetail = async (stepId: string) => {
    if (!onFetchEvaluationDetail) return;

    try {
      const evaluation = await onFetchEvaluationDetail(stepId);
      const step = progressSteps.find(
        (s) => s.progressStep.progressStepID === stepId
      );
      console.log("stepId: ", stepId);

      setEvaluationDetailDialog({
        isOpen: true,
        evaluation,
        stepTitle: step?.progressStep.stepTitle || "",
      });
    } catch (error) {
      console.error("Error fetching evaluation detail:", error);
    }
  };

  const closeEvaluationDetailDialog = () => {
    setEvaluationDetailDialog({
      isOpen: false,
      evaluation: null,
      stepTitle: "",
    });
  };

  // Render loading state
  if (loadingSteps) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-500">Đang tải tiến độ...</p>
        </div>
      </div>
    );
  }

  console.log("currentStepIndex:", currentStepIndex);

  return (
    <>
      <div className="h-auto flex flex-col">
        {isEvaluating ? (
          // Layout khi đánh giá: Tăng tỷ lệ cho phần trên để hiện đủ ảnh
          <div className="h-full flex flex-col">
            {/* Tiến độ thực hiện - phần trên - 65% height để hiện đủ ảnh */}
            <div className="h-[65%] flex flex-col ">
              <h3 className="text-lg font-semibold mb-3 flex-shrink-0">
                Quá trình thực hiện
              </h3>
              <div className="flex-1 flex flex-col min-h-0">
                {progressSteps.length > 0 ? (
                  <>
                    {/* Current Step Content - scrollable với nhiều space hơn */}
                    <div className="flex-1 overflow-y-auto">
                      <ProgressStepCard
                        isTop={true}
                        step={progressSteps[currentStepIndex]}
                        onEvaluate={() =>
                          handleEvaluate(
                            progressSteps[currentStepIndex]?.progressStep
                              ?.progressStepID
                          )
                        }
                        onViewEvaluationDetail={handleViewEvaluationDetail}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium mb-2">
                        Chưa có tiến độ
                      </p>
                      <p className="text-sm">
                        Giai đoạn này chưa có bước thực hiện nào
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Đánh giá tiến độ - phần dưới - 35% height */}
            <div className="h-[45%] flex flex-col pt-2">
              <div className="flex-1 overflow-y-auto">
                <EvaluationForm
                  onSubmit={handleEvaluationSubmit}
                  onCancel={handleBackToNormal}
                />
              </div>
            </div>
          </div>
        ) : (
          // Layout bình thường - không thay đổi
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold">Quá trình thực hiện</h3>
              {progressSteps.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {progressSteps.length} bước
                </Badge>
              )}
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {!selectedPhaseId ? (
                // Chưa chọn giai đoạn
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">Chọn giai đoạn</p>
                    <p className="text-sm">
                      Vui lòng chọn một giai đoạn để xem chi tiết
                    </p>
                  </div>
                </div>
              ) : progressSteps.length > 0 ? (
                // Có progress steps
                <>
                  {/* Dots Navigation - compact */}
                  <div className="flex items-center justify-center gap-2 mb-4 flex-shrink-0">
                    {progressSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStepIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          currentStepIndex === index
                            ? "bg-blue-500 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        title={`Bước ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Current Step Content - flexible height */}
                  <div className="flex-1 min-h-0">
                    <ProgressStepCard
                      step={progressSteps[currentStepIndex]}
                      onEvaluate={() =>
                        handleEvaluate(
                          progressSteps[currentStepIndex].progressStep
                            .progressStepID
                        )
                      }
                      onViewEvaluationDetail={handleViewEvaluationDetail}
                    />
                  </div>
                </>
              ) : (
                // Không có progress steps
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">Chưa có tiến độ</p>
                    <p className="text-sm">
                      Giai đoạn này chưa có bước thực hiện nào
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Evaluation Detail Dialog */}
      <EvaluationDetailDialog
        isOpen={evaluationDetailDialog.isOpen}
        onClose={closeEvaluationDetailDialog}
        evaluation={evaluationDetailDialog.evaluation}
        stepTitle={evaluationDetailDialog.stepTitle}
      />
    </>
  );
}
