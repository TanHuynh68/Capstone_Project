"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import OfferPhaseCard from "./OfferPhaseCard";
interface OfferPhasesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  offersPhase: OfferPhase[];
  fetchOfferPhase: any
}

const OfferPhasesDialog = ({
  isOpen,
  onClose,
  offersPhase,
  fetchOfferPhase,
}: OfferPhasesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[400px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Giai đoạn dự án</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {offersPhase.length > 0 ? (
            offersPhase.map((item: OfferPhase) => (
              <OfferPhaseCard
                fetchOfferPhase={fetchOfferPhase}
                offerPhase={item}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có giai đoạn nào được tìm thấy
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferPhasesDialog;
