"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Offer } from "@/types/orderManagement"
import { formatCurrencyVND } from "@/components/utils"
import { DollarSign, Calendar, FileText } from "lucide-react"

interface OfferInfoCardProps {
  offer: Offer
}

export default function OfferInfoCard({ offer }: OfferInfoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getOfferStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" }
      case "Accepted":
        return { label: "Đã chấp nhận", color: "bg-green-100 text-green-800" }
      case "Rejected":
        return { label: "Đã từ chối", color: "bg-red-100 text-red-800" }
      case "InProgress":
        return { label: "Đang thực hiện", color: "bg-blue-100 text-blue-800" }
      case "Completed":
        return { label: "Hoàn thành", color: "bg-green-100 text-green-800" }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  const statusConfig = getOfferStatusConfig(offer.offerStatus)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Thông tin đề xuất</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Trạng thái:</span>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Giá ban đầu:</span>
            <span className="text-sm">{formatCurrencyVND(offer.initPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Giá cuối cùng:</span>
            <span className="text-sm font-semibold text-green-600">{formatCurrencyVND(offer.finalPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Tiền cọc:</span>
            <span className="text-sm font-medium text-blue-600">{formatCurrencyVND(offer.designerDepositPrice)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Ngày tạo:</span>
            <span className="text-sm">{formatDate(offer.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Deadline:</span>
            <span className="text-sm font-medium text-red-600">{formatDate(offer.deadlineEndAt)}</span>
          </div>
        </div>

        {offer.note && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Ghi chú:</span>
            </div>
            <p className="text-sm bg-gray-50 p-2 rounded">{offer.note}</p>
          </div>
        )}

        {offer.sampleImage && (
          <div className="space-y-2">
            <span className="text-sm text-gray-600">Hình ảnh mẫu:</span>
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img src={offer.sampleImage || "/placeholder.svg"} alt="Sample" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
