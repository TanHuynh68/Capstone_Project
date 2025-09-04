"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Clock, User, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StaffOrderCardProps {
  order: Order;
  onView?: (orderID: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-800 border-green-200";
    case "InProgress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "Created":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Deposited":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Withdrawed":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Rework":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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
    case "Created":
      return "Đã tạo";
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

export default function StaffOrderCard({ order, onView }: StaffOrderCardProps) {
  const navigate = useNavigate();

  const isOverdue =
    new Date(order?.deadlineAt) < new Date() && order?.orderStatus !== "Done";

  const handleViewDetail = () => {
    navigate(`/staff/order-detail/${order.orderID}`);
    onView?.(order.orderID);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border hover:border-blue-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Đơn hàng #{order?.orderID?.slice(0, 8)}...
            </h3>
            <p className="text-sm text-gray-500">
              Tạo lúc: {formatDate(order?.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              order?.orderStatus
            )}`}
          >
            {getStatusText(order?.orderStatus)}
          </span>
        </div>

        {/* Note */}
        {order?.note && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-2">{order?.note}</p>
          </div>
        )}

        {/* Customer & Designer Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Khách hàng:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {order?.customerName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Designer:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {order?.designerName}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Tổng giá trị:</span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(order?.totalPrice)}
          </span>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <div className="text-gray-500">Bắt đầu</div>
              <div className="font-medium">{formatDate(order?.startDate)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock
              className={`h-4 w-4 ${
                isOverdue ? "text-red-500" : "text-gray-400"
              }`}
            />
            <div>
              <div
                className={`text-gray-500 ${isOverdue ? "text-red-500" : ""}`}
              >
                Deadline
              </div>
              <div className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>
                {formatDate(order?.deadlineAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleViewDetail} className="flex-1" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
