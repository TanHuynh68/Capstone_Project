"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  User,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  FileText,
} from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { useRef, useState } from "react";
import PhaseStatusBadge from "@/components/atoms/customer/order-detail/PhaseStatusBadge";
import OrderStatusBadge from "@/components/atoms/customer/order/OrderStatusBadge";

interface Order {
  orderID: string;
  customerID: string;
  customerName: string;
  designerID: string;
  designerName: string;
  totalPrice: number;
  orderStatus: string;
  requiredDepositAmount: number;
  designerDepositAmount: number;
  note: string;
  deadlineAt: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Offer {
  offerID: string;
  projectPostID: string;
  itemValue: number;
  initPrice: number;
  finalPrice: number;
  designerDepositPrice: number;
  note: string;
  sampleImage: string;
  offerStatus: string;
  createdAt: string;
  deadlineEndAt: string;
}

interface OfferPhase {
  offerPhaseID: string;
  phase: number;
  phaseName: string;
  phaseDescription: string;
  offerPhasePrice: number;
  offerPhaseStatus: string;
  progressCount: number;
  startDate: string;
  endDate: string;
  modifyDate: string;
}

interface OrderTargetDetail {
  order: Order;
  offer: Offer;
  offerPhases: OfferPhase[];
}

interface OrderReportDetailProps {
  targetDetail: OrderTargetDetail;
}

const mapOrderStatus = (status: string) => {
  switch (status) {
    case "Created":
      return {
        label: "Đã tạo",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
      };
    case "InProgress":
      return {
        label: "Đang thực hiện",
        color: "bg-purple-100 text-purple-800",
        icon: Clock,
      };
    case "Completed":
      return {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    case "Cancelled":
      return {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      };
    case "Pending":
      return {
        label: "Chờ xử lý",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      };
    default:
      return {
        label: status,
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
      };
  }
};

const mapOfferStatus = (status: string) => {
  switch (status) {
    case "Accepted":
      return {
        label: "Đã chấp nhận",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    case "Rejected":
      return {
        label: "Đã từ chối",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      };
    case "Pending":
      return {
        label: "Chờ xử lý",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      };
    default:
      return {
        label: status,
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
      };
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function OrderReportDetail({
  targetDetail,
}: OrderReportDetailProps) {
  const { order, offer, offerPhases } = targetDetail;
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const phasesContainerRef = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const orderStatusInfo = mapOrderStatus(order.orderStatus);
  const offerStatusInfo = mapOfferStatus(offer.offerStatus);
  const OfferStatusIcon = offerStatusInfo.icon;

  const handlePhaseClick = (phaseId: string) => {
    setSelectedPhaseId(phaseId);
    const phaseElement = phaseRefs.current[phaseId];
    const container = phasesContainerRef.current;

    if (phaseElement && container) {
      const containerRect = container.getBoundingClientRect();
      const phaseRect = phaseElement.getBoundingClientRect();

      // Calculate the scroll position to center the phase
      const scrollTop =
        phaseElement.offsetTop -
        container.offsetTop -
        containerRect.height / 2 +
        phaseRect.height / 2;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-indigo-600" />
          Chi tiết đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Order Information */}
        <div>
          <h4 className="font-semibold text-indigo-700 flex items-center gap-2 mb-3">
            <Package className="h-4 w-4" />
            Thông tin đơn hàng
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Khách hàng
              </Label>
              <p className="text-sm bg-blue-50 p-2 rounded mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                {order.customerName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Nhà thiết kế
              </Label>
              <p className="text-sm bg-purple-50 p-2 rounded mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-purple-500" />
                {order.designerName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Trạng thái đơn hàng
              </Label>
              <div className="mt-1">
                <Badge className={orderStatusInfo.color}>
                  <OrderStatusBadge status={order.orderStatus}/>
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Tổng giá trị
              </Label>
              <p className="text-sm bg-green-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-700">
                  {formatCurrency(order.totalPrice)}
                </span>
              </p>
            </div>
          </div>

          {/* Deposit Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Tiền cọc yêu cầu
              </Label>
              <p className="text-sm bg-yellow-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold text-yellow-700">
                  {formatCurrency(order.requiredDepositAmount)}
                </span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Tiền cọc nhà thiết kế
              </Label>
              <p className="text-sm bg-orange-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span className="font-semibold text-orange-700">
                  {formatCurrency(order.designerDepositAmount)}
                </span>
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4">
            <h5 className="font-medium text-gray-700 mb-2">Thời gian</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Ngày bắt đầu
                </Label>
                <p className="text-sm bg-gray-50 p-2 rounded flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  {formatFullDateWithDistance2(order.startDate)}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Deadline
                </Label>
                <p className="text-sm bg-gray-50 p-2 rounded flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  {formatFullDateWithDistance2(order.deadlineAt)}
                </p>
              </div>
              {order.endDate && (
                <div>
                  <Label className="text-xs font-medium text-gray-600">
                    Ngày kết thúc
                  </Label>
                  <p className="text-sm bg-gray-50 p-2 rounded flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    {formatFullDateWithDistance2(order.endDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {order.note && (
            <div className="mt-4">
              <Label className="text-sm font-semibold text-gray-700">
                Ghi chú
              </Label>
              <p className="text-sm bg-gray-50 p-3 rounded mt-1">
                {order.note}
              </p>
            </div>
          )}
        </div>

        {/* Offer Information */}
        <div>
          <h4 className="font-semibold text-purple-700 flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4" />
            Thông tin đề xuất
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Trạng thái đề xuất
              </Label>
              <div className="mt-1">
                <Badge className={offerStatusInfo.color}>
                  <OfferStatusIcon className="h-3 w-3 mr-1" />
                  {offerStatusInfo.label}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Giá trị sản phẩm
              </Label>
              <p className="text-sm bg-blue-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-700">
                  {formatCurrency(offer.itemValue)}
                </span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Giá ban đầu
              </Label>
              <p className="text-sm bg-gray-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-700">
                  {formatCurrency(offer.initPrice)}
                </span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Giá trị đơn hàng
              </Label>
              <p className="text-sm bg-green-50 p-2 rounded mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-700">
                  {formatCurrency(offer.finalPrice)}
                </span>
              </p>
            </div>
          </div>

          {offer.sampleImage && (
            <div className="mt-4">
              <Label className="text-sm font-semibold text-gray-700">
                Hình ảnh mẫu
              </Label>
              <div className="mt-2">
                <img
                  src={offer.sampleImage || "/placeholder.svg"}
                  alt="Sample image"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          )}

          {offer.note && (
            <div className="mt-4">
              <Label className="text-sm font-semibold text-gray-700">
                Ghi chú đề xuất
              </Label>
              <p className="text-sm bg-purple-50 p-3 rounded mt-1">
                {offer.note}
              </p>
            </div>
          )}
        </div>

        {/* Offer Phases */}
        {offerPhases && offerPhases.length > 0 && (
          <div>
            <h4 className="font-semibold text-orange-700 flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              Các giai đoạn thực hiện ({offerPhases.length})
            </h4>
            <div
              ref={phasesContainerRef}
              className="max-h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {offerPhases.map((phase) => {
                const isSelected = selectedPhaseId === phase.offerPhaseID;

                return (
                  <div
                    key={phase.offerPhaseID}
                    ref={(el: any) =>
                      (phaseRefs.current[phase.offerPhaseID] = el)
                    }
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? "border-orange-300 bg-orange-50 shadow-md ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                    onClick={() => handlePhaseClick(phase.offerPhaseID)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5
                        className={`font-medium ${
                          isSelected ? "text-orange-800" : "text-gray-800"
                        }`}
                      >
                        Giai đoạn {phase.phase}: {phase.phaseName}
                      </h5>
                      <PhaseStatusBadge status={phase.offerPhaseStatus} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-600">
                          Giá giai đoạn
                        </Label>
                        <p className="text-sm bg-green-50 p-2 rounded flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span className="font-semibold text-green-700">
                            {formatCurrency(phase.offerPhasePrice)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">
                          Ngày bắt đầu
                        </Label>
                        <p className="text-sm bg-blue-50 p-2 rounded">
                          {formatFullDateWithDistance2(phase.startDate)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">
                          Ngày kết thúc
                        </Label>
                        <p className="text-sm bg-blue-50 p-2 rounded">
                          {formatFullDateWithDistance2(phase.endDate)}
                        </p>
                      </div>
                    </div>

                    {phase.phaseDescription && (
                      <div className="mb-2">
                        <Label className="text-xs font-medium text-gray-600">
                          Mô tả
                        </Label>
                        <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                          {phase.phaseDescription}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Số lần tiến độ: {phase.progressCount}</span>
                      <span>
                        Cập nhật:{" "}
                        {formatFullDateWithDistance2(phase.modifyDate)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
