"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { OfferPhase } from "@/types/orderManagement"
import PhaseStatusBadge from "@/components/atoms/customer/order/PhaseStatusBadge"
import { formatCurrencyVND } from "@/components/utils"
import { Calendar, DollarSign, FileText } from "lucide-react"

interface OfferPhaseItemProps {
  phase: OfferPhase
  isSelected: boolean
  onClick: () => void
}

export default function OfferPhaseItem({ phase, isSelected, onClick }: OfferPhaseItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-sm">Giai đoạn {phase.phase}</h4>
            <p className="text-sm text-gray-600">{phase.phaseName}</p>
          </div>
          <PhaseStatusBadge status={phase.offerPhaseStatus} />
        </div>

        {phase.phaseDescription && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <FileText className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Mô tả:</span>
            </div>
            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{phase.phaseDescription}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-gray-500" />
            <span className="text-sm font-medium text-green-600">{formatCurrencyVND(phase.offerPhasePrice)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
