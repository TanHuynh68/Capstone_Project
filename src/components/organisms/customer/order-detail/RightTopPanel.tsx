"use client"

import type { OfferPhase } from "@/types/orderManagement"
import OfferPhaseItem from "@/components/molecules/customer/order-detail/OfferPhaseItem"
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema"

interface RightTopPanelProps {
  phases: OfferPhase[]
  selectedPhaseId: string | null
  orderID: string
  onPhaseSelect: (phaseId: string) => void
  onCreateProgressStep?: (data: CreateProgressStepFormData) => Promise<void>
}

export default function RightTopPanel({
  phases,
  selectedPhaseId,
  orderID,
  onPhaseSelect,
  onCreateProgressStep,
}: RightTopPanelProps) {
  return (
    <div className="flex flex-col h-[242px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Giai đoạn thực hiện</h3>
        <span className="text-sm text-gray-500">{phases.length} giai đoạn</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {phases.map((phase) => (
          <OfferPhaseItem
            key={phase.offerPhaseID}
            phase={phase}
            isSelected={selectedPhaseId === phase.offerPhaseID}
            orderID={orderID}
            onClick={() => onPhaseSelect(phase.offerPhaseID)}
            onCreateProgressStep={onCreateProgressStep}
          />
        ))}
      </div>
    </div>
  )
}