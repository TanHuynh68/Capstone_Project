import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  Camera,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import DeliveryStatusBadge from "@/components/atoms/staff/manage-users/manage-delivery/DeliveryStatusBadge";

interface DeliveryImage {
  deliveryImageID: string;
  imageUrl: string;
  uploadType: "Sender" | "Receiver";
}

interface DeliveryDetail {
  deliveryID: string;
  orderID: string;
  senderID: string;
  senderName: string;
  receiverID: string;
  receiverName: string;
  orderCode: string;
  senderAddress: string;
  senderPhoneNumber: string;
  receiverAddress: string;
  receiverPhoneNumber: string;
  deliveryPrice: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  note: string;
  deliveryStatus: string;
  createdAt: string;
  deliveredAt: string;
  isConfirm: boolean;
  images: DeliveryImage[];
}

export default function DeliveryDetailPage() {
  const params = useParams();
  const [delivery, setDelivery] = useState<DeliveryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDelivery: DeliveryDetail = {
      deliveryID: "ba8d5591-77e4-45f0-984c-0b90dfaae7ca",
      orderID: "7c0cdd10-828d-4e2d-9863-13f210d79150",
      senderID: "81450cfa-323b-4f4f-2f79-08ddeb6dff08",
      senderName: "des electoral",
      receiverID: "47836129-b340-48c5-2f78-08ddeb6dff08",
      receiverName: "cus whitecondemned",
      orderCode: "L3XPVA",
      senderAddress:
        "299 Liên Phường, Phường 8, Quận Phú Nhuận, TP. Hồ Chí Minh",
      senderPhoneNumber: "0391110001",
      receiverAddress: "123 NTMK, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh",
      receiverPhoneNumber: "0390001122",
      deliveryPrice: 21001,
      length: "10",
      width: "10",
      height: "10",
      weight: "100",
      note: "oke",
      deliveryStatus: "Delivered",
      createdAt: "2025-09-04T05:45:04.819",
      deliveredAt: "2025-09-04T05:44:53.3805242",
      isConfirm: true,
      images: [
        {
          deliveryImageID: "952a132d-0ea9-41d4-ae0b-08dde9671d2f",
          imageUrl:
            "https://res.cloudinary.com/dqne88ub0/image/upload/v1756964708/delivery/638925614670486616.jpg",
          uploadType: "Sender",
        },
        {
          deliveryImageID: "92c8464a-c23b-42b1-b2cb-b2fb706c44d1",
          imageUrl:
            "https://res.cloudinary.com/dqne88ub0/image/upload/v1756964732/delivery/638925614908176667.jpg",
          uploadType: "Receiver",
        },
      ],
    };

    setTimeout(() => {
      setDelivery(mockDelivery);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Không tìm thấy thông tin giao hàng
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết giao hàng
          </h1>
          <p className="text-gray-600">Mã đơn hàng: {delivery.orderCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Trạng thái giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Trạng thái hiện tại:
              </span>
              <DeliveryStatusBadge status={delivery.deliveryStatus} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Xác nhận:</span>
              <div className="flex items-center gap-2">
                {delivery.isConfirm ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={
                    delivery.isConfirm ? "text-green-600" : "text-red-600"
                  }
                >
                  {delivery.isConfirm ? "Đã xác nhận" : "Chưa xác nhận"}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Tạo lúc:</span>
                <span>{formatDate(delivery.createdAt)}</span>
              </div>
              {delivery.deliveredAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Giao lúc:</span>
                  <span>{formatDate(delivery.deliveredAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Thông tin kiện hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Kích thước (cm):</span>
                <p className="font-medium">
                  {delivery.length} × {delivery.width} × {delivery.height}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Khối lượng:</span>
                <p className="font-medium">{delivery.weight}g</p>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600">Phí giao hàng:</span>
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(delivery.deliveryPrice)}
              </p>
            </div>

            {delivery.note && (
              <div>
                <span className="text-sm text-gray-600">Ghi chú:</span>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {delivery.note}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sender Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin người gửi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Tên:</span>
              <p className="font-medium">{delivery.senderName}</p>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm text-gray-600">Số điện thoại:</span>
                <p className="font-medium">{delivery.senderPhoneNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm text-gray-600">Địa chỉ:</span>
                <p className="text-sm">{delivery.senderAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receiver Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin người nhận
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Tên:</span>
              <p className="font-medium">{delivery.receiverName}</p>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm text-gray-600">Số điện thoại:</span>
                <p className="font-medium">{delivery.receiverPhoneNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm text-gray-600">Địa chỉ:</span>
                <p className="text-sm">{delivery.receiverAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images */}
      {delivery.images && delivery.images.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Hình ảnh giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {delivery.images.map((image) => (
                <div key={image.deliveryImageID} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {image.uploadType === "Sender"
                        ? "Người gửi"
                        : "Người nhận"}
                    </Badge>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={`Hình ảnh từ ${
                        image.uploadType === "Sender"
                          ? "người gửi"
                          : "người nhận"
                      }`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
