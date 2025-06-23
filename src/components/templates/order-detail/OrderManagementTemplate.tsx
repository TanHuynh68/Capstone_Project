"use client"

import { useState } from "react"
import type { OrderDetail, EvaluationCriteria, ProgressStepResponse } from "@/types/orderManagement"
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema"
import LeftPanel from "@/components/organisms/customer/order-detail/LeftPanel"
import RightTopPanel from "@/components/organisms/customer/order-detail/RightTopPanel"
import RightBottomPanel from "@/components/organisms/customer/order-detail/RightBottomPanel"
import ProgressService from "@/services/ProgressService"

interface OrderManagementTemplateProps {
  orderDetail: OrderDetail
  onFetchProgressSteps: any
  progressStep: ProgressStepResponse[]
  handleCreateReview: any
  onCreateProgressStep?: (data: CreateProgressStepFormData) => Promise<void>
}

export default function OrderManagementTemplate({
  orderDetail,
  onFetchProgressSteps,
  progressStep,
  handleCreateReview,
  onCreateProgressStep,
}: OrderManagementTemplateProps) {
  console.log("OrderManagementTemplate: ", progressStep)
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluatingStepId, setEvaluatingStepId] = useState<string | null>(null)
  const [loadingSteps, setLoadingSteps] = useState(false)
  const { getProgressReviewDetail } = ProgressService()

  const fetchProgressReviewDetail = async (progressStepID: string) => {
    const response = await getProgressReviewDetail(progressStepID)
    if (response && response.responseRequestModel) {
      return response.responseRequestModel
    }
  }

  const handlePhaseSelect = async (phaseId: string) => {
    setSelectedPhaseId(phaseId)
    setLoadingSteps(true)
    // call back fetch progress step
    await onFetchProgressSteps(phaseId)
    setLoadingSteps(false)
  }

  const handleViewPhases = () => {
    console.log("View phases clicked")
    // Implement view phases logic
  }

  const handleViewDelivery = () => {
    console.log("View delivery clicked")
    // Implement view delivery logic
  }

  const handleViewActivityLog = () => {
    console.log("View activity log clicked")
    // Implement view activity log logic
  }

  const handleEvaluationSubmit = async (stepId: string, criteria: EvaluationCriteria) => {
    await handleCreateReview({
      progressStepID: stepId,
      ...criteria,
      // rating star 1->5 => 2->10
      qualityScore: criteria.qualityScore * 2,
    })
  }

  const handleStartEvaluation = (stepId: string) => {
    setEvaluatingStepId(stepId)
    setIsEvaluating(true)
  }

  const handleFinishEvaluation = () => {
    setIsEvaluating(false)
    setEvaluatingStepId(null)
  }

  return (
    <div className="bg-gray-50 p-4">
      <div className="h-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left Panel - 50% width */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <LeftPanel
              orderDetail={orderDetail}
              onViewPhases={handleViewPhases}
              onViewDelivery={handleViewDelivery}
              onViewActivityLog={handleViewActivityLog}
            />
          </div>

          {/* Right Panel - 50% width, conditional layout */}
          <div className={`${isEvaluating ? "flex flex-col" : "flex flex-col gap-6"}`}>
            {/* Top Right Panel - Giai đoạn thực hiện (ẩn khi đánh giá) */}
            <div
              className={`bg-white rounded-lg shadow-sm border  transition-all duration-500 ease-in-out transform ${
                isEvaluating
                  ? "opacity-0 scale-95 -translate-y-4 h-0 overflow-hidden p-0 border-0"
                  : "opacity-100 scale-100 translate-y-0 flex-1 p-6"
              }`}
            >
              {!isEvaluating && (
                <RightTopPanel
                  phases={orderDetail.offerPhases}
                  selectedPhaseId={selectedPhaseId}
                  orderID={orderDetail.order.orderID}
                  onPhaseSelect={handlePhaseSelect}
                  onCreateProgressStep={onCreateProgressStep}
                />
              )}
            </div>

            {/* Bottom Right Panel - Tiến độ thực hiện (mở rộng khi đánh giá) */}
            <div
              className={`bg-white rounded-lg shadow-sm border p-6 transition-all duration-500 ease-in-out transform ${
                isEvaluating
                  ? "flex-1 opacity-100 scale-100 translate-y-0"
                  : "flex-1 opacity-100 scale-100 translate-y-0"
              }`}
            >
              <RightBottomPanel
                progressSteps={progressStep}
                selectedPhaseId={selectedPhaseId}
                isEvaluating={isEvaluating}
                evaluatingStepId={evaluatingStepId}
                loadingSteps={loadingSteps}
                onStartEvaluation={handleStartEvaluation}
                onFinishEvaluation={handleFinishEvaluation}
                onEvaluationSubmit={handleEvaluationSubmit}
                onFetchEvaluationDetail={fetchProgressReviewDetail}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
