"use client";

import type { OfferPhase, OrderDetail } from "@/types/orderManagement";
import OfferPhaseItem from "@/components/molecules/customer/order-detail/OfferPhaseItem";
import SelectPhasesDialog from "@/components/molecules/customer/order-detail/SelectPhasesDialog";
import WithdrawDepositDialog from "@/components/molecules/customer/order-detail/WithdrawDepositDialog";
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema";
import { Button } from "@/components/ui/button";
import { CheckSquare, Wallet } from "lucide-react";
import { useRef, useState } from "react";
import { useCurrentUser } from "@/utils";
import { ROLE } from "@/constants";
import "./RightTop.css";

interface RightTopPanelProps {
  orderDetail: OrderDetail;
  phases: OfferPhase[];
  selectedPhaseId: string | null;
  orderID: string;
  onPhaseSelect: (phaseId: string) => void;
  onCreateProgressStep?: (data: CreateProgressStepFormData) => Promise<void>;
  onSelectPhases?: (phaseIds: string[]) => Promise<void>;
  onWithdrawDeposit: (phaseIds: string[]) => Promise<void>;
}

export default function RightTopPanel({
  phases,
  selectedPhaseId,
  orderID,
  onPhaseSelect,
  onCreateProgressStep,
  onSelectPhases,
  onWithdrawDeposit,
  orderDetail,
}: RightTopPanelProps) {
  const [isSelectPhasesDialogOpen, setIsSelectPhasesDialogOpen] =
    useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const currentUser = useCurrentUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handlePhaseSelect = (phaseId: string) => {
    onPhaseSelect(phaseId);
    const container = containerRef.current;
    const selectedItem = itemRefs.current[phaseId];
    if (container && selectedItem) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();
      const offset = itemRect.top - containerRect.top;
      const scrollAmount =
        offset - container.clientHeight / 2 + itemRect.height / 2;
      container.scrollTop += scrollAmount;
    }
  };

  const handleSelectPhases = async (phaseIds: string[]) => {
    if (onSelectPhases) {
      await onSelectPhases(phaseIds);
      setIsSelectPhasesDialogOpen(false);
    }
  };

  const handleWithdrawDeposit = async (phaseIds: string[]) => {
    if (onWithdrawDeposit) {
      await onWithdrawDeposit(phaseIds);
      setIsWithdrawDialogOpen(false);
    }
  };

  // Filter phases for withdrawal (Deposited status and has deposit amount)
  const withdrawablePhases = phases.filter(
    (phase) =>
      phase.offerPhaseStatus === "Deposited" && phase.offerPhasePrice > 0
  );

  const isStatusDealedExisted = orderDetail.offerPhases.filter(item=>item.offerPhaseStatus === 'Dealed')
  console.log('isStatusDealedExisted: ', isStatusDealedExisted)
  return (
    <>
      <div className="flex flex-col max-h-[242px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Giai đoạn thực hiện</h3>
          <div className="flex items-center gap-2">
            {currentUser?.role === ROLE.CUSTOMER && isStatusDealedExisted.length > 0 &&
              orderDetail.order.orderStatus === "InProgress" && (
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

            {currentUser?.role === ROLE.DESIGNER &&
              withdrawablePhases.length > 0 &&
              orderDetail.order.orderStatus === "InProgress" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWithdrawDialogOpen(true)}
                  className="flex items-center gap-2 text-blue-600 border-green-200 hover:bg-green-50"
                >
                  <Wallet className="h-4 w-4" />
                  Rút tiền cọc
                </Button>
              )}

            <span className="text-sm text-gray-500">
              {phases.length} giai đoạn
            </span>
          </div>
        </div>
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth"
        >
          {phases.map((phase) => (
            <div
              key={phase.offerPhaseID}
              ref={(el: any) => (itemRefs.current[phase.offerPhaseID] = el)}
            >
              <OfferPhaseItem
                phase={phase}
                isSelected={selectedPhaseId === phase.offerPhaseID}
                orderID={orderID}
                onClick={() => handlePhaseSelect(phase.offerPhaseID)}
                onCreateProgressStep={onCreateProgressStep}
              />
            </div>
          ))}
        </div>
      </div>

      <SelectPhasesDialog
        isOpen={isSelectPhasesDialogOpen}
        onClose={() => setIsSelectPhasesDialogOpen(false)}
        phases={phases.filter((item) => item.offerPhaseStatus === "Dealed")}
        onSubmit={handleSelectPhases}
      />

      <WithdrawDepositDialog
        isOpen={isWithdrawDialogOpen}
        onClose={() => setIsWithdrawDialogOpen(false)}
        phases={withdrawablePhases}
        onSubmit={handleWithdrawDeposit}
      />
    </>
  );
}
