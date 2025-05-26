"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";
import { Avatar } from "@/components/atoms/avatar/avatar";
import { Badge } from "@/components/atoms/badge/badge";

interface OfferCardProps {
  offer: Offer;
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
}

export function OfferCard({ offer, onAccept, onReject }: OfferCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Đang chờ";
      case 1:
        return "Đã chấp nhận";
      case 2:
        return "Đã từ chối";
      default:
        return "Không xác định";
    }
  };

  const getStatusVariant = (status: number) => {
    switch (status) {
      case 1:
        return "success";
      case 2:
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <Card className="mb-3 hover:shadow-sm transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar
            src={offer.avatar || "/placeholder.svg?height=32&width=32"}
            alt={offer.fullName}
            size="sm"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm">{offer.fullName}</h4>
            <p className="text-xs text-gray-500">
              {formatDate(offer.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusVariant(offer.offerStatus)}>
            {getStatusText(offer.offerStatus)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center space-x-4 mb-3 text-sm">
          <div className="flex items-center space-x-1 text-green-600 font-medium">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(offer.initPrice)}</span>
          </div>
          {offer.finalPrice && (
            <div className="flex items-center space-x-1 text-blue-600 font-medium">
              <DollarSign className="w-4 h-4" />
              <span>Final: {formatCurrency(offer.finalPrice)}</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatDate(offer.deadlineEndAt)}</span>
          </div>
        </div>

        {offer.note && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {offer.note}
          </p>
        )}

        {offer.sampleImage && (
          <div className="mb-3">
            <img
              src={offer.sampleImage || "/placeholder.svg"}
              alt="Sample"
              className="w-full h-32 object-cover rounded border"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Khách hàng: {offer.isAcceptedByCus ? "✓" : "✗"}</span>
          <span>Designer: {offer.isAcceptedByDes ? "✓" : "✗"}</span>
        </div>

        {offer.offerStatus === 0 && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject?.(offer.offerID)}
              className="flex-1 text-xs"
            >
              Từ chối
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept?.(offer.offerID)}
              className="flex-1 text-xs"
            >
              Chấp nhận
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
