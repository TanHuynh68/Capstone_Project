"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  User,
  Package,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import OrderService from "@/services/OrderService";
import { OrderDetail } from "@/types/orderManagement";
import { formatCurrencyVND } from "@/utils";

export default function StaffOrderDetailPage() {
  const { orderID } = useParams<{ orderID: string }>();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const  {staffGetOrderDetail} = OrderService();

  const fetchOrderDetail = async () => {
    if (!orderID) return;

    setIsLoading(true);
    try {
      const response = await staffGetOrderDetail(orderID);
      if (response?.isSuccess && response.responseRequestModel) {
        setOrderDetail(response.responseRequestModel);
      } else {
        console.log("Không thể tải thông tin đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderID]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800";
      case "InProgress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Deposited":
        return "bg-purple-100 text-purple-800";
      case "Withdrawed":
        return "bg-orange-100 text-orange-800";
      case "Rework":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Done":
        return "Hoàn thành";
      case "InProgress":
        return "Đang thực hiện";
      case "Pending":
        return "Chờ xử lý";
      case "Rejected":
        return "Đã hủy";
      case "Deposited":
        return "Đã cọc";
      case "Withdrawed":
        return "Đã rút";
      case "Rework":
        return "Làm lại";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-600 mb-4">
            Đơn hàng với ID "{orderID}" không tồn tại.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const { order, offer, offerPhases } = orderDetail;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết đơn hàng
          </h1>
          <p className="text-gray-600">#{order.orderID}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {getStatusText(order.orderStatus)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tổng giá trị
                  </label>
                  <div className="mt-1 text-lg font-bold text-blue-600">
                    {formatPrice(order.totalPrice||0)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Số tiền cọc yêu cầu
                  </label>
                  <div className="mt-1 font-medium">
                    {formatPrice(order.requiredDepositAmount||0)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Số tiền cọc designer
                  </label>
                  <div className="mt-1 font-medium">
                    {formatPrice(order.designerDepositAmount||0)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Ngày bắt đầu
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(order.startDate)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Deadline
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatDate(order.deadlineAt)}
                  </div>
                </div>
              </div>

              {order.note && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Ghi chú
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{order.note}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offer Phases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Các giai đoạn thực hiện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offerPhases.map((phase) => (
                  <div
                    key={phase.offerPhaseID}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">
                          Giai đoạn {phase.phase}: {phase.phaseName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {phase.phaseDescription}
                        </p>
                      </div>
                      <Badge className={getStatusColor(phase.offerPhaseStatus)}>
                        {getStatusText(phase.offerPhaseStatus)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Giá:</span>
                        <div className="font-medium">
                          {formatPrice(phase.offerPhasePrice||0)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tiến độ:</span>
                        <div className="font-medium">
                          {phase.progressCount} bước
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Thời gian:</span>
                        <div className="font-medium">
                          {new Date(phase.startDate).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          -{" "}
                          {new Date(phase.endDate).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer & Designer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin liên quan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Khách hàng
                </label>
                <div className="mt-1">
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-gray-600">
                    ID: {order.customerID}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Designer
                </label>
                <div className="mt-1">
                  <div className="font-medium">{order.designerName}</div>
                  <div className="text-sm text-gray-600">
                    ID: {order.designerID}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thông tin báo giá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giá trị sản phẩm:</span>
                <span className="font-medium">
                  {formatCurrencyVND(offer.itemValue||0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giá khởi điểm:</span>
                <span className="font-medium">
                  {formatPrice(offer.initPrice||0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giá cuối cùng:</span>
                <span className="font-medium text-blue-600">
                  {formatPrice(offer.finalPrice||0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cọc designer:</span>
                <span className="font-medium">
                  {formatPrice(offer.designerDepositPrice||0)}
                </span>
              </div>

              <Separator />

              <div>
                <span className="text-sm text-gray-600">
                  Trạng thái báo giá:
                </span>
                <div className="mt-1">
                  <Badge className={getStatusColor(offer.offerStatus)}>
                    {getStatusText(offer.offerStatus)}
                  </Badge>
                </div>
              </div>

              {offer.sampleImage && (
                <div>
                  <span className="text-sm text-gray-600">Hình mẫu:</span>
                  <div className="mt-2">
                    <img
                      src={offer.sampleImage || "/placeholder.svg"}
                      alt="Sample"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium">Tạo đơn hàng</div>
                <div className="text-gray-600">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div>
                <div className="font-medium">Cập nhật cuối</div>
                <div className="text-gray-600">
                  {formatDate(order.updatedAt)}
                </div>
              </div>
              {order.endDate && (
                <div>
                  <div className="font-medium">Hoàn thành</div>
                  <div className="text-gray-600">
                    {formatDate(order.endDate)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
