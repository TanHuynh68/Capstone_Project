"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckSquare, DollarSign } from "lucide-react";
import type { OfferPhase } from "@/types/orderManagement";
import { formatCurrencyVND } from "@/utils";
import PhaseStatusBadge from "@/components/atoms/customer/order-detail/PhaseStatusBadge";

interface SelectPhasesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phases: OfferPhase[];
  onSubmit: (phaseIds: string[]) => Promise<any>;
}

export default function SelectPhasesDialog({
  isOpen,
  onClose,
  phases,
  onSubmit,
}: SelectPhasesDialogProps) {
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total price of selected phases
  const calculateTotalPrice = () => {
    return selectedPhases.reduce((total, phaseId) => {
      const phase = phases.find((p) => p.offerPhaseID === phaseId);
      return total + (phase?.offerPhasePrice || 0);
    }, 0);
  };

  const handlePhaseToggle = (phaseId: string) => {
    setSelectedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPhases(
      selectedPhases.length === phases.length
        ? []
        : phases.map((p) => p.offerPhaseID)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await onSubmit(selectedPhases);
      if (response) {
        // state of phase in dialog (select or no select)
        setSelectedPhases([]);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting phases:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPhases([]);
    onClose();
  };

  const isAllSelected = selectedPhases.length === phases.length;
  const isIndeterminate =
    selectedPhases.length > 0 && selectedPhases.length < phases.length;
  const totalPrice = calculateTotalPrice();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[600px] h-[800px] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chọn giai đoạn thực hiện
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Select All */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  ref={(ref: any) => {
                    if (ref) ref.indeterminate = isIndeterminate;
                  }}
                  onCheckedChange={handleSelectAll}
                  className="h-5 w-5"
                />
                <label
                  htmlFor="select-all"
                  className="font-medium cursor-pointer"
                >
                  Chọn tất cả ({selectedPhases.length}/{phases.length})
                </label>
              </div>

              {/* Total Price Display */}
              {selectedPhases.length > 0 && (
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-700">
                    {formatCurrencyVND(totalPrice)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Phases List */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {phases.map((phase) => {

              const isSelected = selectedPhases.includes(phase.offerPhaseID);

              return (
                <Card
                  key={phase.offerPhaseID}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handlePhaseToggle(phase.offerPhaseID)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {}} // Handled by card click
                        className="mt-1 h-5 w-5"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {phase.phase}
                            </span>
                            <span className="text-sm text-gray-600">
                              {phase.phaseName}
                            </span>
                          </div>
                          <PhaseStatusBadge status={phase.offerPhaseStatus}/>
                        </div>

                        {phase.phaseDescription && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {phase.phaseDescription}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {new Date(phase.startDate).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -{" "}
                            {new Date(phase.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="font-semibold text-green-600">
                            {formatCurrencyVND(phase.offerPhasePrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Đã chọn:{" "}
                <span className="font-semibold">{selectedPhases.length}</span>{" "}
                giai đoạn
              </div>
              {selectedPhases.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-bold text-green-600 text-base">
                    {formatCurrencyVND(totalPrice)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedPhases.length === 0 || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Xác nhận ({selectedPhases.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
