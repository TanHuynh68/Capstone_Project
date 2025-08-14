"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Clock } from "lucide-react";
import OrderStatusBadge from "@/components/atoms/customer/order/OrderStatusBadge";
import PriceDisplay from "@/components/atoms/customer/order/PriceDisplay";
import OrderDate from "@/components/atoms/customer/order/OrderDate";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/path";
import { ShippingFormDialog } from "@/components/organisms/delivery/shipping-form-dialog";

interface OrderCardProps {
  order: Order;
  onView?: (orderID: string) => void;
  onMessage?: (orderID: string) => void;
  onOrderCreated?: () => void;
}

export default function OrderCard({
  order,
  onView,
  onOrderCreated,
}: OrderCardProps) {
  console.log("OrderCardA: ", order);
  const isOverdue =
    new Date(order?.deadlineAt) < new Date() &&
    order?.orderStatus !== "Completed";
  return (
    <Card className="hover:shadow-md hover:bg-primary/5 border hover:border-primary transition-all duration-200 p-0">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Đơn hàng #{order?.orderID.slice(0, 8)}
            </h3>
            {/* <OrderDate date={order?.createdAt} format="relative" className="text-muted-foreground" /> */}
          </div>
          <OrderStatusBadge status={order?.orderStatus} />
        </div>
        {/* Note */}
        {order?.note && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-foreground line-clamp-2">
              {order?.note}
            </p>
          </div>
        )}

        {/* Price Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tổng tiền:</span>
            <PriceDisplay amount={order?.totalPrice} size="md" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tên khác hàng:</span>
            <div className="text-md text-foreground">{order.customerName}</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tên khác hàng:</span>
            <div className="text-md text-foreground">{order.designerName}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Bắt đầu</div>
              <OrderDate date={order?.startDate} format="short" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Clock
              className={`h-4 w-4 ${
                isOverdue ? "text-destructive" : "text-muted-foreground"
              }`}
            />
            <div>
              <div
                className={`text-muted-foreground ${
                  isOverdue ? "text-destructive" : ""
                }`}
              >
                Deadline
              </div>
              <OrderDate
                date={order?.deadlineAt}
                format="short"
                className={isOverdue ? "text-destructive" : ""}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`grid gap-2 ${
            order?.orderStatus === "Created" ||
            order?.orderStatus === "Completed"
              ? "grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          <Link
            className="w-full"
            to={`${PATH.ORDER_DETAIL}/${order?.orderID}`}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onView?.(order?.orderID)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
          </Link>
          {(order?.orderStatus === "Created" ||
            order?.orderStatus === "Completed") && (
            <ShippingFormDialog
              text="Giao hàng"
              orderID={order?.orderID}
              order={order}
              onOrderCreated={onOrderCreated}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
