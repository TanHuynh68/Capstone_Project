"use client";

import { useState } from "react";
import type {
  OrderDetail,
  ProgressStepResponse,
} from "@/types/orderManagement";
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema";
import LeftPanel from "@/components/organisms/customer/order-detail/LeftPanel";
import RightTopPanel from "@/components/organisms/customer/order-detail/RightTopPanel";
import RightBottomPanel from "@/components/organisms/customer/order-detail/RightBottomPanel";
import ActivityLogDialog from "@/components/molecules/customer/order-detail/ActivityLogDialog";
import FeedbackSection from "@/components/organisms/feedback/FeedbackSection";
import type { TimelineItemData } from "@/components/molecules/timeline/TimelineItem";
import OrderService from "@/services/OrderService";
import { ACTIVITY_TYPE_VI } from "@/constants/order";
import type {
  CreateFeedbackFormData,
  FeedbackData,
} from "@/schemas/feedbackSchema";

interface OrderManagementTemplateProps {
  orderDetail: OrderDetail;
  onFetchProgressSteps: any;
  progressStep: ProgressStepResponse[];
  handleCreateReview: any;
  onCreateProgressStep?: (data: CreateProgressStepFormData) => Promise<void>;
  onSelectPhases?: (phaseIds: string[]) => Promise<void>;
  getProgressReviewDetail: any;
  onDesignerWithdraw: (phaseIds: string[]) => Promise<void>;
  userRole: string;
  onCreateFeedback: (data: CreateFeedbackFormData) => Promise<void>;
  onCreateResponse: (feedbackID: string, response: string) => Promise<void>;
  onGetFeedback: (orderID: string) => Promise<FeedbackData | null>;
  ordersDeposited: DepositHistoryItem[];
  fetchOrdersDeposited: any;
  fetchDepositTransaction: any;
}

export default function OrderManagementTemplate({
  orderDetail,
  onFetchProgressSteps,
  progressStep,
  handleCreateReview,
  onCreateProgressStep,
  onSelectPhases,
  getProgressReviewDetail,
  onDesignerWithdraw,
  userRole,
  onCreateFeedback,
  onCreateResponse,
  onGetFeedback,
  ordersDeposited,
  fetchOrdersDeposited,
  fetchDepositTransaction,
}: OrderManagementTemplateProps) {
  console.log("OrderManagementTemplate: ", progressStep);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluatingStepId, setEvaluatingStepId] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [activityLog, setActivityLog] = useState<TimelineItemData[]>([]);
  const [activityLogLoading, setActivityLogLoading] = useState(false);
  const [depositHistoryLoading, setDepositHistoryLoading] = useState(false);

  const orderService = OrderService();

  const fetchProgressReviewDetail = async (progressStepID: string) => {
    const response = await getProgressReviewDetail(progressStepID);
    if (response && response.responseRequestModel) {
      return response.responseRequestModel;
    }
  };

  const handlePhaseSelect = async (phaseId: string) => {
    setSelectedPhaseId(phaseId);
    setLoadingSteps(true);
    // call back fetch progress step
    await onFetchProgressSteps(phaseId);
    setLoadingSteps(false);
  };

  const handleViewPhases = () => {
    console.log("View phases clicked");
    // Implement view phases logic
  };

  const handleViewDepositHistory = async () => {
    setDepositHistoryLoading(true);
    try {
      await fetchOrdersDeposited();
    } catch (error) {
      console.error("Error fetching deposit history:", error);
    } finally {
      setDepositHistoryLoading(false);
    }
  };

  // Map activityType to TimelineIconType
  const mapActivityTypeToIcon = (
    activityType: string
  ): TimelineItemData["type"] => {
    switch (activityType) {
      case "General":
        return "info";
      case "Deposit":
        return "banknote";
      case "Withdraw":
        return "banknote";
      case "Refund":
        return "banknote";
      case "Ship":
        return "ship";
      case "Progress":
        return "progress";
      case "Check":
        return "check";
      default:
        return "info";
    }
  };

  const handleViewActivityLog = async () => {
    setActivityLogLoading(true);
    setActivityLogOpen(true);
    try {
      // Fetch activity log for this order
      // Pass orderID as query param if needed
      const res = await orderService.getOrderActivity(
        orderDetail.order.orderID
      );
      const responseList = res?.responseRequestModel?.responseList || [];
      // Map to TimelineItemData
      const timelineItems: TimelineItemData[] = responseList.map(
        (item: {
          orderActivityLogID: string;
          createdAt: string;
          activityType: string;
          activity: string;
        }) => ({
          id: item.orderActivityLogID,
          date: item.createdAt,
          title:
            ACTIVITY_TYPE_VI[
              item.activityType as keyof typeof ACTIVITY_TYPE_VI
            ] ?? item.activityType,
          description: item.activity,
          type: mapActivityTypeToIcon(item.activityType),
        })
      );
      setActivityLog(timelineItems);
    } catch {
      setActivityLog([]);
    } finally {
      setActivityLogLoading(false);
    }
  };

  const handleEvaluationSubmit = async (stepId: string, criteria: any) => {
    await handleCreateReview({
      progressStepID: stepId,
      ...criteria,
      // rating star 1->5 => 2->10
      qualityScore: criteria.qualityScore * 2,
    });
  };

  const handleStartEvaluation = (stepId: string) => {
    setEvaluatingStepId(stepId);
    setIsEvaluating(true);
  };

  const handleFinishEvaluation = () => {
    setIsEvaluating(false);
    setEvaluatingStepId(null);
  };

  return (
    <div className="bg-gray-50 p-4 overflow-y-auto">
      <ActivityLogDialog
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
        loading={activityLogLoading}
        items={activityLog}
        onClose={() => setActivityLogOpen(false)}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Existing grid layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - 50% width */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <LeftPanel
              fetchDepositTransaction={fetchDepositTransaction}
              orderDetail={orderDetail}
              onViewPhases={handleViewPhases}
              onViewDepositHistory={handleViewDepositHistory}
              onViewActivityLog={handleViewActivityLog}
              depositHistory={ordersDeposited}
              depositHistoryLoading={depositHistoryLoading}
            />
          </div>
          {/* Right Panel - 50% width, conditional layout */}
          <div
            className={`${
              isEvaluating ? "flex flex-col" : "flex flex-col gap-6"
            }`}
          >
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
                  onWithdrawDeposit={onDesignerWithdraw}
                  phases={orderDetail.offerPhases}
                  selectedPhaseId={selectedPhaseId}
                  orderID={orderDetail?.order?.orderID || ""}
                  onPhaseSelect={handlePhaseSelect}
                  onCreateProgressStep={onCreateProgressStep}
                  onSelectPhases={onSelectPhases}
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

        {/* Feedback Section - Full width at bottom */}
        <FeedbackSection
          orderID={orderDetail.order.orderID}
          userRole={userRole}
          onCreateFeedback={onCreateFeedback}
          onCreateResponse={onCreateResponse}
          onGetFeedback={onGetFeedback}
        />
      </div>
    </div>
  );
}
