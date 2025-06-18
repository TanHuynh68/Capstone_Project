"use client"

import type { OfferPhase } from "@/types/orderManagement"
import OfferPhaseItem from "@/components/molecules/customer/order/OfferPhaseItem"

interface RightTopPanelProps {
  phases: OfferPhase[]
  selectedPhaseId: string | null
  onPhaseSelect: (phaseId: string) => void
}

export default function RightTopPanel({ phases, selectedPhaseId, onPhaseSelect }: RightTopPanelProps) {
  return (
    <div className="flex flex-col h-[530px]">
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
            onClick={() => onPhaseSelect(phase.offerPhaseID)}
          />
        ))}
      </div>
    </div>
  )
}
