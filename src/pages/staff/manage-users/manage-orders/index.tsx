"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaffOrderGrid from "@/components/organisms/staff/manage-users/manage-orders/StaffOrderGrid";
import OrderService from "@/services/OrderService";

export default function StaffOrdersPage() {
  const { accountID } = useParams<{ accountID: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const { staffGetOrdersUser } = OrderService();

  const fetchOrders = async () => {
    if (!accountID) return;

    setIsLoading(true);
    try {
      const response = await staffGetOrdersUser({
        accountID,
      });

      if (
        response?.isSuccess &&
        response.responseRequestModel?.responseList?.items
      ) {
        const orderItems = response.responseRequestModel.responseList.items;
        setOrders(orderItems);

        // Get user name from first order if available
        if (orderItems.length > 0) {
          setUserName(
            orderItems[0].customerName || orderItems[0].designerName || ""
          );
        }
      } else {
        console.log("Không thể tải danh sách đơn hàng");
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

  const handleViewOrder = (orderID: string) => {
    console.log("Viewing order:", orderID);
  };

  const handleBackToUserManagement = () => {
    navigate(-1);
  };

  if (!accountID) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy thông tin người dùng
          </h2>
          <p className="text-gray-600 mb-4">Vui lòng quay lại và thử lại.</p>
          <Button onClick={handleBackToUserManagement}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: orders.length,
    done: orders.filter((o) => o.orderStatus === "Done").length,
    inProgress: orders.filter((o) => o.orderStatus === "InProgress").length,
    pending: orders.filter((o) => o.orderStatus === "Pending").length,
    rejected: orders.filter((o) => o.orderStatus === "Rejected").length,
    totalValue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Đơn hàng của {userName || "người dùng"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">Account ID: {accountID}</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Tổng đơn hàng</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.done}</div>
          <div className="text-sm text-gray-500">Hoàn thành</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {stats.inProgress}
          </div>
          <div className="text-sm text-gray-500">Đang thực hiện</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-500">Chờ xử lý</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {stats.rejected}
          </div>
          <div className="text-sm text-gray-500">Đã hủy</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {new Intl.NumberFormat("vi-VN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(stats.totalValue)}
          </div>
          <div className="text-sm text-gray-500">Tổng giá trị</div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">Hiển thị {orders.length} đơn hàng</p>
      </div>

      {/* Orders Grid */}
      <StaffOrderGrid
        orders={orders}
        loading={isLoading}
        onView={handleViewOrder}
      />
    </div>
  );
}
