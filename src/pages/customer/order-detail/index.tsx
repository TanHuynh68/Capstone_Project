import { useParams } from "react-router-dom";
import OrderManagementTemplate from "@/components/templates/order-detail/OrderManagementTemplate";
import type {
  OrderDetail,
  ProgressStepResponse,
} from "@/types/orderManagement";
import OrderService from "@/services/OrderService";
import { useEffect, useState } from "react";
import ProgressService from "@/services/Progress";

export default function OrderManagementPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrderDetail } = OrderService();
  const { getProgress } = ProgressService();
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [progressSteps, setProgressSteps] = useState<ProgressStepResponse[]>(
    []
  );
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

  //fetch progress steps by offer phase ID
  const fetchProgressSteps = async (offerPhaseId: string) => {
    const response = await getProgress(id + "", offerPhaseId);
    if (response) {
      // setOrderDetail(response?.responseRequestModel);
      setProgressSteps(response?.responseRequestModel?.responseList);
      console.log(
        "fetchProgressSteps: ",
        response?.responseRequestModel?.responseList
      );
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
      progressStep={progressSteps}
      orderDetail={orderDetail}
      onFetchProgressSteps={fetchProgressSteps}
    />
  );
}
