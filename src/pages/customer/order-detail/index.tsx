import { useParams } from "react-router-dom";
import OrderManagementTemplate from "@/components/templates/order-detail/OrderManagementTemplate";
import type {
  OrderDetail,
  ProgressStepResponse,
} from "@/types/orderManagement";
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema";
import OrderService from "@/services/OrderService";
import { useEffect, useState } from "react";
import ProgressService from "@/services/ProgressService";
import { toast } from "sonner";
import { MESSAGE } from "@/constants";
import FeedbackService from "@/services/FeedbackService";
import { CreateFeedbackFormData } from "@/schemas/feedbackSchema";
import { useCurrentUser } from "@/utils";
import WalletService from "@/services/WalletService";
import LoadingSpinner from "@/components/atoms/custom/loading-spinner/LoadingSpinner";
import { useStateValue } from "@/context/stateProvider";

export default function OrderManagementPage() {
  const { id } = useParams<{ id: string }>();
  const {
    getOrderDetail,
    createDepositListPhase,
    createWithdrawPhase,
    getOrderDeposited,
  } = OrderService();
  const {
    getProgress,
    createProgressStep,
    getProgressReviewDetail,
    createProgressReview,
  } = ProgressService();
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [ordersDeposited, setOrdersDeposited] = useState<DepositHistoryItem[]>(
    []
  );
  const [progressSteps, setProgressSteps] = useState<ProgressStepResponse[]>(
    []
  );

  // Loading states
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  const currentUser = useCurrentUser();
  const { fetchDepositOrderList, fetchWallet } = useStateValue();
  const { getDepositTransaction } = WalletService();
  const { createFeedback, createFeedbackResponse, getFeedbacks } =
    FeedbackService();

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  // Reset progress steps when order changes
  useEffect(() => {
    setProgressSteps([]);
  }, [id]);

  // fetch deposited history
  const fetchOrdersDeposited = async () => {
    if (id) {
      const response = await getOrderDeposited(id);
      if (response) {
        setOrdersDeposited(response?.responseRequestModel?.responseList || []);
      }
    }
  };

  const fetchDepositTransaction = async (id: string) => {
    if (id) {
      const response = await getDepositTransaction(id);
      if (response) {
        return response?.responseRequestModel?.depositTransactions || [];
      }
    }
  };

  const fetchOrderDetail = async () => {
    if (id) {
      setIsLoadingOrder(true);
      try {
        const response = await getOrderDetail(id);
        if (response) {
          setOrderDetail(response?.responseRequestModel);
        }
      } catch (error) {
        console.error("Error fetching order detail:", error);
        toast.error("Không thể tải thông tin đơn hàng");
      } finally {
        setIsLoadingOrder(false);
      }
    }
  };

  const createDepositListPhaseByCustomer = async (phaseIds: string[]) => {
    if (phaseIds) {
      const response = await createDepositListPhase({
        offerPhaseIDs: phaseIds,
      });
      if (response) {
        toast.success(MESSAGE.DEPOSIT_SUCCESSFULLY);
        fetchOrderDetail();
        fetchDepositOrderList();
        fetchWallet();
      }
    }
  };

  // withdraw by des
  const handleWithdrawByDesigner = async (phaseIds: string[]) => {
    if (phaseIds) {
      console.log("phaseIds: ", phaseIds);
      const response = await createWithdrawPhase(phaseIds);
      if (response) {
        toast.success(MESSAGE.WITHDRAW_SUCCESSFULLY);
        fetchOrderDetail();
        fetchDepositOrderList();
        fetchWallet();
      }
    }
  };

  // send progress review by customer
  const handleCreateReview = async (value: any) => {
    const response = await createProgressReview(value);
    if (response && response.responseRequestModel) {
      toast.success(MESSAGE.CREATE_PROGRESS_SUCCESSFULLY);
      fetchOrderDetail();
    }
  };

  //fetch progress steps by offer phase ID
  const fetchProgressSteps = async (offerPhaseId: string) => {
    console.log("fetchProgressSteps: ", offerPhaseId);
    const response = await getProgress(id + "", offerPhaseId);
    if (response) {
      setProgressSteps(response?.responseRequestModel?.responseList);
      console.log(
        "fetchProgressSteps: ",
        response?.responseRequestModel?.responseList
      );
    }
  };

  // Create progress step
  const handleCreateProgressStep = async (data: CreateProgressStepFormData) => {
    const response = await createProgressStep(data);
    if (response && response.responseRequestModel) {
      toast.success(MESSAGE.CREATE_PROGRESS_STEP);
      fetchOrderDetail();
    }
  };

  const handleCreateFeedback = async (data: CreateFeedbackFormData) => {
    const response = await createFeedback(data);
    return response;
  };

  const handleGetFeedback = async (orderID: string) => {
    const response = await getFeedbacks(orderID);
    console.log("handleGetFeedback orderID: ", response);
    return response?.responseRequestModel || null;
  };

  const handleCreateFeedbackResponse = async (
    feedbackID: string,
    response: string
  ) => {
    const result = await createFeedbackResponse({ feedbackID, response });
    if (result) {
      toast.success("Phản hồi đã được gửi thành công");
    }
    toast.success("Phản hồi đã được gửi thành công");
  };

  // Show loading spinner while initial order data is loading
  if (isLoadingOrder) {
    return <LoadingSpinner />;
  }

  if (!orderDetail) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-gray-600">Đơn hàng với ID "{id}" không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <OrderManagementTemplate
      fetchDepositTransaction={fetchDepositTransaction}
      fetchOrdersDeposited={fetchOrdersDeposited}
      ordersDeposited={ordersDeposited}
      userRole={currentUser?.role}
      onCreateFeedback={handleCreateFeedback}
      onCreateResponse={handleCreateFeedbackResponse}
      onGetFeedback={handleGetFeedback}
      onDesignerWithdraw={handleWithdrawByDesigner}
      getProgressReviewDetail={getProgressReviewDetail}
      handleCreateReview={handleCreateReview}
      progressStep={progressSteps}
      orderDetail={orderDetail}
      onFetchProgressSteps={fetchProgressSteps}
      onCreateProgressStep={handleCreateProgressStep}
      onSelectPhases={createDepositListPhaseByCustomer}
      fetchOrderDetail={fetchOrderDetail}
    />
  );
}
