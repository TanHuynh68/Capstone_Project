import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderHistoryTemplate from "@/components/templates/order/OrderHistoryTemplate";
import OrderService from "@/services/OrderService";

export default function StaffOrdersPage() {
  const { accountID } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { staffGetOrdersUser } = OrderService();
  const fetchOrders = async () => {
    if (!accountID) return;

    setIsLoading(true);
    try {
      const response = await staffGetOrdersUser({
        accountID,
      });
      if (response && response.responseRequestModel.responseList.items) {
        setOrders(response.responseRequestModel.responseList.items);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [accountID]);

  if (!accountID) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy thông tin người dùng
          </h2>
          <p className="text-gray-600 mb-4">Vui lòng quay lại và thử lại.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Card className="flex-1">
          {/* <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Đơn hàng của{" "}
              {userName ? decodeURIComponent(userName) : "người dùng"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">ID: {accountID}</p>
          </CardContent> */}
        </Card>
      </div>

      {/* Orders */}
      <OrderHistoryTemplate
        initialOrders={orders}
        isLoading={isLoading}
        onRefresh={fetchOrders}
      />
    </div>
  );
}
