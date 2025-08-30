"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Offer } from "@/types/orderManagement";
import { formatCurrencyVND } from "@/utils";
import { DollarSign, Calendar, Image } from "lucide-react";
import SingleImageGallery from "@/components/atoms/custom/image/SingleImageGallery";

interface OfferInfoCardProps {
  offer: Offer;
}

export default function OfferInfoCard({ offer }: OfferInfoCardProps) {
  console.log("Offer: ", offer);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOfferStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" };
      case "Accepted":
        return { label: "Đã chấp nhận", color: "bg-green-100 text-green-800" };
      case "Rejected":
        return { label: "Đã từ chối", color: "bg-red-100 text-red-800" };
      case "InProgress":
        return { label: "Đang thực hiện", color: "bg-blue-100 text-blue-800" };
      case "Completed":
        return { label: "Hoàn thành", color: "bg-green-100 text-green-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusConfig = getOfferStatusConfig(offer.offerStatus);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg font-semibold">
            Thông tin đề xuất
          </CardTitle>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-2)' }}>
              <DollarSign className="h-4 w-4" style={{ color: 'white' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                NTK cần cọc
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {formatCurrencyVND(offer.designerDepositPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-4)' }}>
              <Calendar className="h-4 w-4" style={{ color: 'white' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                Ngày tạo
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {formatDate(offer.createdAt)}
              </p>
            </div>
          </div>

          {offer.sampleImage && (
            <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-3)' }}>
                <Image className="h-4 w-4" style={{ color: 'white' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                  Hình ảnh mẫu
                </p>
                <div className="mt-2">
                  <SingleImageGallery
                    imageUrl={offer.sampleImage}
                    title={null}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
