
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Package,
  User,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeliveryStatusBadge from "@/components/atoms/staff/manage-users/manage-delivery/DeliveryStatusBadge";

interface DeliveryCardProps {
  delivery: {
    createdAt: string;
    deliveredAt?: string;
    deliveryID: string;
    deliveryPrice: number;
    deliveryStatus: string;
    isConfirm: boolean;
    note?: string;
    orderCode: string;
    orderID: string;
    receiverID: string;
    receiverName: string;
    senderID: string;
    senderName: string;
  };
  onView?: (deliveryID: string) => void;
}

export default function DeliveryCard({ delivery, onView }: DeliveryCardProps) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/staff/delivery-detail/${delivery.deliveryID}`);
    onView?.(delivery.deliveryID);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
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

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-600" />#{delivery.orderCode}
            </h3>
            <p className="text-sm text-gray-500">
              ID: {delivery.deliveryID.slice(0, 8)}...
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DeliveryStatusBadge status={delivery.deliveryStatus} />
            {delivery.isConfirm && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs font-medium">Đã xác nhận</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border border-gray-200 p-3 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <User className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">Người gửi</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {delivery.senderName}
            </p>
          </div>

          <div className="border border-gray-200 p-3 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">Người nhận</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {delivery.receiverName}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Phí giao hàng</span>
          <span className="font-semibold text-gray-900">
            {formatPrice(delivery.deliveryPrice)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>Ngày tạo</span>
            </div>
            <span className="text-gray-900">
              {formatDate(delivery.createdAt)}
            </span>
          </div>

          {delivery.deliveredAt && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="h-3 w-3" />
                <span>Ngày giao</span>
              </div>
              <span className="text-gray-900">
                {formatDate(delivery.deliveredAt)}
              </span>
            </div>
          )}
        </div>

        {delivery.note && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{delivery.note}</p>
          </div>
        )}

        <Button
          onClick={handleViewDetail}
          className="w-full bg-transparent"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
}
