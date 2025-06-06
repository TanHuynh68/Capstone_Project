import { Card } from "@/components/ui/card";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { formatDateRangeVN } from "@/components/utils";
import { MoreHorizontal } from 'lucide-react';
import { useState } from "react";
import UpdateOfferPhase from "../chat-form/UpdateOfferPhase";


interface OfferPhaseCardProps {
  offerPhase: OfferPhase;
  fetchOfferPhase: any;
}

const OfferPhaseCard = ({
  offerPhase,
  fetchOfferPhase,
}: OfferPhaseCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Card 
        className="p-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="flex gap-2 items-center col-span-9">
            <div className="text-xs font-semibold bg-gray-700 px-2 py-1 rounded-md">
              {offerPhase?.phase}
            </div>
            <div className="text-xl font-semibold truncate">
              {offerPhase?.phaseName}
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <MoreHorizontal className="h-5 w-5 text-gray-300" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm text-gray-300">
            {formatDateRangeVN(offerPhase?.startDate+'', offerPhase?.endDate+'')}
          </div>
          <div className="text-sm font-medium">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(offerPhase?.offerPhasePrice)}
          </div>
        </div>
      </Card>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="min-w-[620px] p-10 pt-0 overflow-hidden">
            <UpdateOfferPhase
                fetchOfferPhase={fetchOfferPhase}
                offer={offerPhase}
              />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OfferPhaseCard;
