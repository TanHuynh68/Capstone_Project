"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Calendar, Clock } from "lucide-react";
import OrderStatusBadge from "@/components/atoms/order/OrderStatusBadge";
import PriceDisplay from "@/components/atoms/order/PriceDisplay";
import OrderDate from "@/components/atoms/order/OrderDate";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/path";

interface OrderCardProps {
  order: Order;
  onView?: (orderID: string) => void;
  onMessage?: (orderID: string) => void;
}

export default function OrderCard({
  order,
  onView,
  onMessage,
}: OrderCardProps) {
  console.log("OrderCardA: ", order);
  const isOverdue =
    new Date(order?.deadlineAt) < new Date() &&
    order?.orderStatus !== "Completed";
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Đơn hàng #{order?.orderID.slice(0, 8)}
            </h3>
            {/* <OrderDate date={order?.createdAt} format="relative" className="text-gray-500" /> */}
          </div>
          <OrderStatusBadge status={order?.orderStatus} />
        </div>

        {/* Price Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tổng tiền:</span>
            <PriceDisplay amount={order?.totalPrice} size="md" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Đặt cọc yêu cầu:</span>
            <PriceDisplay amount={order?.requiredDepositAmount} size="sm" />
          </div>

          {order?.designerDepositAmount >= 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Designer đã cọc:</span>
              <PriceDisplay amount={order?.designerDepositAmount} size="sm" />
            </div>
          )}
        </div>

        {/* Deposit Progress
        {order?.requiredDepositAmount > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Tiến độ đặt cọc</span>
              <span>{Math.round(depositProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(depositProgress, 100)}%` }}
              />
            </div>
          </div>
        )} */}

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <div className="text-gray-500">Bắt đầu</div>
              <OrderDate date={order?.startDate} format="short" />
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
              <OrderDate
                date={order?.deadlineAt}
                format="short"
                className={isOverdue ? "text-red-600" : ""}
              />
            </div>
          </div>
        </div>

        {/* Note */}
        {order?.note && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Ghi chú:</div>
            <p className="text-sm text-gray-700 line-clamp-2">{order?.note}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            className="w-full"
            to={`${PATH.ORDER_DETAIL}/${order?.orderID}`}
          >
            <Button
              variant="outline"
              size="sm"
              className="flex-1 w-full"
              onClick={() => onView?.(order?.orderID)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessage?.(order?.orderID)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
