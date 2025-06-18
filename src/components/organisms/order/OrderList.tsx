"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import OrderStatusBadge from "@/components/atoms/order/OrderStatusBadge";
import PriceDisplay from "@/components/atoms/order/PriceDisplay";
import OrderDate from "@/components/atoms/order/OrderDate";

interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  onView?: (orderID: string) => void;
  onMessage?: (orderID: string) => void;
}

function OrderRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function OrderList({
  orders,
  loading,
  onView,
  onMessage,
}: OrderListProps) {
  if (loading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
             <TableRow>
            <TableHead className="text-center">Đơn hàng</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Tổng tiền</TableHead>
            <TableHead className="text-center">Đặt cọc</TableHead>
            <TableHead className="text-center">Ngày tạo</TableHead>
            <TableHead className="text-center">Deadline</TableHead>
            <TableHead className="text-center">Ghi chú</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <OrderRowSkeleton key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không có đơn hàng nào
        </h3>
        <p className="text-gray-500">
          Chưa có đơn hàng nào phù hợp với bộ lọc của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Đơn hàng</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Tổng tiền</TableHead>
            <TableHead className="text-center">Đặt cọc</TableHead>
            <TableHead className="text-center">Ngày tạo</TableHead>
            <TableHead className="text-center">Deadline</TableHead>
            <TableHead className="text-center">Ghi chú</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const isOverdue =
              new Date(order.deadlineAt) < new Date() &&
              order.orderStatus !== "Completed";
            return (
              <TableRow key={order.orderID} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      #{order.orderID.slice(0, 8)}
                    </div>
                    {/* <div className="text-sm text-gray-500">{order.customerID.slice(0, 8)}</div> */}
                  </div>
                </TableCell>

                <TableCell>
                  <OrderStatusBadge status={order.orderStatus} />
                </TableCell>

                <TableCell>
                  <PriceDisplay amount={order.totalPrice} />
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">
                      <PriceDisplay
                        amount={order.designerDepositAmount}
                        size="sm"
                      />
                      {" / "}
                      <PriceDisplay
                        amount={order.requiredDepositAmount}
                        size="sm"
                      />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <OrderDate date={order.createdAt} format="short" />
                </TableCell>

                <TableCell>
                  <OrderDate
                    date={order.deadlineAt}
                    format="short"
                    className={isOverdue ? "text-red-600" : ""}
                  />
                  {isOverdue && (
                    <div className="text-xs text-red-500 mt-1">Quá hạn</div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="max-w-32 truncate text-sm text-gray-600">
                    {order.note || "—"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(order.orderID)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMessage?.(order.orderID)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
