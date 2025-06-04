import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatDateTimeVN } from "@/components/utils";
import { Dialog } from "@radix-ui/react-dialog";
import UpdateOfferPhase from "../chat-form/UpdateOfferPhase";
interface OfferPhaseCardProps {
  offerPhase: OfferPhase;
  fetchOfferPhase: any
}
const OfferPhaseCard = ({ offerPhase, fetchOfferPhase }: OfferPhaseCardProps) => {
  return (
    <Card className="p-2 bg-black text-white">
      <div className="grid grid-cols-12 gap-2">
        <div className="flex gap-2 items-center col-span-9">
          <div className="text-xs font-semibold ">{offerPhase?.phase}</div>
          <div className="text-2xl font-semibold truncate">
            {offerPhase?.phaseName}
          </div>
        </div>
        <div className="col-span-3 flex justify-end">  
          <Dialog>
            <DialogTrigger>
              <Button>Cập nhật</Button>
            </DialogTrigger>
            <DialogContent className="min-w-[610px]">
              <UpdateOfferPhase fetchOfferPhase={fetchOfferPhase} offer={offerPhase} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex justify-between">
        <div>{formatDateTimeVN(offerPhase?.startDate)}</div>
        <div>{formatDateTimeVN(offerPhase?.endDate)}</div>
      </div>
    </Card>
  );
};

export default OfferPhaseCard;
