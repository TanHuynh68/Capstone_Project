"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OfferPhase } from "@/types/orderManagement";
import PhaseStatusBadge from "@/components/atoms/customer/order-detail/PhaseStatusBadge";
import CreateProgressStepDialog from "./CreateProgressStepDialog";
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema";
import { formatCurrencyVND, useCurrentUser } from "@/utils";
import { Calendar, DollarSign, FileText, Plus } from "lucide-react";
import { ROLE } from "@/constants";

interface OfferPhaseItemProps {
  phase: OfferPhase;
  isSelected: boolean;
  orderID: string;
  onClick: () => void;
  onCreateProgressStep?: (data: CreateProgressStepFormData) => Promise<void>;
}

export default function OfferPhaseItem({
  phase,
  isSelected,
  orderID,
  onClick,
  onCreateProgressStep,
}: OfferPhaseItemProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const currentUser = useCurrentUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    setIsCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: CreateProgressStepFormData) => {
    if (onCreateProgressStep) {
      await onCreateProgressStep(data);
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <div className="p-1">
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2 flex-1">
              <h4 className="font-semibold text-sm">{phase.phase}</h4>
              <p className="text-sm text-gray-600">{phase.phaseName}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* display phase status */}
              <PhaseStatusBadge status={phase.offerPhaseStatus} />
              {/* create new progress step button by designer */}
              {
               currentUser?.role === ROLE.DESIGNER && <Button
                variant="outline"
                size="icon"
                onClick={handleCreateClick}
                className="h-8 w-8"
                title="Tạo tiến độ"
              >
                <Plus className="h-4 w-4" />
              </Button>
              }
            </div>
          </div>

          {phase.phaseDescription && (
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <FileText className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Mô tả:</span>
              </div>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                {phase.phaseDescription}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-gray-500" />
              <span className="text-sm font-medium text-green-600">
                {formatCurrencyVND(phase.offerPhasePrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Progress Step Dialog */}
      <CreateProgressStepDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        orderID={orderID}
        offerPhaseID={phase.offerPhaseID}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
