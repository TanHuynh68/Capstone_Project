"use client";

import type { OfferPhase } from "@/types/orderManagement";
import OfferPhaseItem from "@/components/molecules/customer/order-detail/OfferPhaseItem";
import SelectPhasesDialog from "@/components/molecules/customer/order-detail/SelectPhasesDialog";
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "@/utils";
import { ROLE } from "@/constants";

interface RightTopPanelProps {
  phases: OfferPhase[];
  selectedPhaseId: string | null;
  orderID: string;
  onPhaseSelect: (phaseId: string) => void;
  onCreateProgressStep?: (data: CreateProgressStepFormData) => Promise<void>;
  onSelectPhases?: (phaseIds: string[]) => Promise<void>;
}

export default function RightTopPanel({
  phases,
  selectedPhaseId,
  orderID,
  onPhaseSelect,
  onCreateProgressStep,
  onSelectPhases,
}: RightTopPanelProps) {
  const [isSelectPhasesDialogOpen, setIsSelectPhasesDialogOpen] =
    useState(false);
  const currentUser = useCurrentUser();
  const handleSelectPhases = async (phaseIds: string[]) => {
    if (onSelectPhases) {
      await onSelectPhases(phaseIds);
      setIsSelectPhasesDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[242px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Giai đoạn thực hiện</h3>
          <div className="flex items-center gap-2">
            {/* customer deposit cash for phases that customer selected */}
            {currentUser?.role === ROLE.CUSTOMER && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelectPhasesDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Đặt cọc
              </Button>
            )}
            <span className="text-sm text-gray-500">
              {phases.length} giai đoạn
            </span>
          </div>
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

      {/* Select Phases Dialog */}
      <SelectPhasesDialog
        isOpen={isSelectPhasesDialogOpen}
        onClose={() => setIsSelectPhasesDialogOpen(false)}
        phases={phases.filter(item => item.offerPhaseStatus === 'NotStarted')}
        onSubmit={handleSelectPhases}
      />
    </>
  );
}
