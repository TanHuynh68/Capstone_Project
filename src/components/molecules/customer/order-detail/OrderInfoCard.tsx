"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Order } from "@/types/orderManagement";
import OrderStatusBadge from "@/components/atoms/customer/order-detail/OrderStatusBadge";
import {
  MoreHorizontal,
  User,
  Calendar,
  DollarSign,
  LockKeyhole,
} from "lucide-react";
import { formatCurrencyVND } from "@/components/utils";

interface OrderInfoCardProps {
  order: Order;
  onViewPhases: () => void;
  onViewDelivery: () => void;
  onViewActivityLog: () => void;
}

export default function OrderInfoCard({
  order,
  onViewPhases,
  onViewDelivery,
  onViewActivityLog,
}: OrderInfoCardProps) {
  console.log("order: ", order);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">
          Thông tin đơn hàng
        </CardTitle>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewPhases}>
                Xem giai đoạn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewDelivery}>
                Giao hàng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewActivityLog}>
                Activity log
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <OrderStatusBadge status={order.orderStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Mã đơn hàng:</span>
          <span className="text-sm font-mono">
            {order.orderID.slice(0, 8)}...
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Khách hàng:</span>
          <span className="text-sm font-medium">{order.customerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Nhà thiết kế:</span>
          <span className="text-sm font-medium">{order.designerName}</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className=" text-sm text-gray-600">Tổng giá trị:</span>
          <span className="font-semibold text-green-600">
            {formatCurrencyVND(order.totalPrice)}
          </span>
        </div>
        <div className="text-gray-500">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 " />
            <span className=" text-sm text-gray-600"> Đã cọc:</span>
            <span className="font-semibold">
              {formatCurrencyVND(order.designerDepositAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Ngày bắt đầu:</span>
          <span className="text-sm">{formatDate(order.startDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Ngày hết hạn:</span>
          <span className="text-sm font-medium text-red-600">
            {formatDate(order.deadlineAt)}
          </span>
        </div>

      </CardContent>
    </Card>
  );
}
