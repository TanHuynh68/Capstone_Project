"use client"
import type { EvaluationCriteria, ProgressStepResponse, ProgressStepApproval } from "@/types/orderManagement"
import ProgressStepCard from "@/components/molecules/customer/order-detail/ProgressStepCard"
import EvaluationForm from "@/components/molecules/customer/order-detail/EvaluationForm"
import EvaluationDetailDialog from "@/components/molecules/customer/order-detail/EvaluationDetailDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface RightBottomPanelProps {
  progressSteps: ProgressStepResponse[]
  selectedPhaseId: string | null
  isEvaluating: boolean
  evaluatingStepId: string | null
  loadingSteps: boolean
  onStartEvaluation: (stepId: string) => void
  onFinishEvaluation: () => void
  onEvaluationSubmit: (stepId: string, criteria: EvaluationCriteria) => void
  onFetchEvaluationDetail?: (stepId: string) => Promise<ProgressStepApproval | null>
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
    isOpen: boolean
    evaluation: ProgressStepApproval | null
    stepTitle: string
  }>({
    isOpen: false,
    evaluation: null,
    stepTitle: "",
  })

  console.log("progressSteps: ", progressSteps)

  const handleEvaluate = (stepId: string) => {
    onStartEvaluation(stepId)
  }

  const handleEvaluationSubmit = (criteria: EvaluationCriteria) => {
    if (evaluatingStepId) {
      console.log("evaluatingStepId: ", evaluatingStepId)
      onEvaluationSubmit(evaluatingStepId, criteria)
      onFinishEvaluation()
    }
  }

  const handleBackToNormal = () => {
    onFinishEvaluation()
  }

  const handleViewEvaluationDetail = async (stepId: string) => {
    if (!onFetchEvaluationDetail) return

    try {
      const evaluation = await onFetchEvaluationDetail(stepId)
      const step = progressSteps.find((s) => s.progressStep.progressStepID === stepId)
      console.log('stepId: ', stepId)
      setEvaluationDetailDialog({
        isOpen: true,
        evaluation,
        stepTitle: step?.progressStep.stepTitle || "",
      })
    } catch (error) {
      console.error("Error fetching evaluation detail:", error)
    }
  }

  const closeEvaluationDetailDialog = () => {
    setEvaluationDetailDialog({
      isOpen: false,
      evaluation: null,
      stepTitle: "",
    })
  }

  // Render loading state
  if (loadingSteps) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-500">Đang tải tiến độ...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {isEvaluating ? (
          // Layout khi đánh giá: 2 sections
          <div className="h-full flex flex-col gap-4">
            {/* Tiến độ thực hiện - phần trên */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">Tiến độ thực hiện</h3>
              <div className="h-full overflow-y-auto pr-2">
                {progressSteps.length > 0 ? (
                  <Tabs defaultValue="0" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      {progressSteps.slice(0, 3).map((step, index) => (
                        <TabsTrigger key={step.progressStep.progressStepID} value={index.toString()}>
                          Bước {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="flex-1 overflow-hidden">
                      {progressSteps.slice(0, 3).map((step, index) => (
                        <TabsContent
                          key={step.progressStep.progressStepID}
                          value={index.toString()}
                          className="h-full mt-0"
                        >
                          <div className="h-full overflow-y-auto">
                            <ProgressStepCard
                              step={step.progressStep}
                              onEvaluate={() => handleEvaluate(step.progressStep.progressStepID)}
                              onViewEvaluationDetail={handleViewEvaluationDetail}
                            />
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium mb-2">Chưa có tiến độ</p>
                      <p className="text-sm">Giai đoạn này chưa có bước thực hiện nào</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Đánh giá tiến độ - phần dưới */}
            <div className="flex-1 pt-4">
              <div className="h-full overflow-y-auto pr-2 mt-5">
                <EvaluationForm onSubmit={handleEvaluationSubmit} onCancel={handleBackToNormal} />
              </div>
            </div>
          </div>
        ) : (
          // Layout bình thường
          <div className="h-[415px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tiến độ thực hiện</h3>
              {progressSteps.length > 0 && <span className="text-sm text-gray-500">{progressSteps.length} bước</span>}
            </div>

            <div className="flex-1">
              {!selectedPhaseId ? (
                // Chưa chọn giai đoạn
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">Chọn giai đoạn</p>
                    <p className="text-sm">Vui lòng chọn một giai đoạn để xem chi tiết</p>
                  </div>
                </div>
              ) : progressSteps.length > 0 ? (
                // Có progress steps - hiển thị tabs
                <Tabs defaultValue="0" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    {progressSteps.slice(0, 3).map((step, index) => (
                      <TabsTrigger key={step.progressStep.progressStepID} value={index.toString()}>
                        Bước {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="flex-1 overflow-hidden">
                    {progressSteps.slice(0, 3).map((step, index) => (
                      <TabsContent
                        key={step.progressStep.progressStepID}
                        value={index.toString()}
                        className="h-full mt-0"
                      >
                        <div className="h-full overflow-y-auto pr-2">
                          <ProgressStepCard
                            step={step.progressStep}
                            onEvaluate={() => handleEvaluate(step.progressStep.progressStepID)}
                            onViewEvaluationDetail={handleViewEvaluationDetail}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              ) : (
                // Không có progress steps
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">Chưa có tiến độ</p>
                    <p className="text-sm">Giai đoạn này chưa có bước thực hiện nào</p>
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
  )
}
