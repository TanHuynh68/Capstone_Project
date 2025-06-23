"use client";

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

export default function OrderManagementPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrderDetail } = OrderService();
  const { getProgress, createProgressStep } = ProgressService();
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [progressSteps, setProgressSteps] = useState<ProgressStepResponse[]>(
    []
  );
  const { createProgressReview } = ProgressService();

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    if (id) {
      const response = await getOrderDetail(id);
      if (response) {
        setOrderDetail(response?.responseRequestModel);
        console.log("fetchOrderDetail: ", response?.responseRequestModel);
      }
    }
  };

  // send progress review by customer
  const handleCreateReview = async (value: any) => {
    const response = await createProgressReview(value);
    if (response && response.responseRequestModel) {
      toast.success(MESSAGE.CREATE_PROGRESS_SUCCESSFULLY);
    }
  };

  //fetch progress steps by offer phase ID
  const fetchProgressSteps = async (offerPhaseId: string) => {
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
    try {
      const response = await createProgressStep(data);
      if (response && response.responseRequestModel) {
        toast.success("Tạo bước tiến độ thành công!");
        // Refresh progress steps if a phase is selected
        if (progressSteps.length > 0) {
          const currentPhaseId = progressSteps[0]?.progressStep?.progressStepID; // You might need to track this differently
          await fetchOrderDetail();
          await fetchProgressSteps(currentPhaseId)
        }
      }
    } catch (error) {
      console.error("Error creating progress step:", error);
      toast.error("Không thể tạo bước tiến độ. Vui lòng thử lại.");
      throw error; // Re-throw to keep dialog open on failure
    }
  };

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
      handleCreateReview={handleCreateReview}
      progressStep={progressSteps}
      orderDetail={orderDetail}
      onFetchProgressSteps={fetchProgressSteps}
      onCreateProgressStep={handleCreateProgressStep}
    />
  );
}
