
import { Card } from "@/components/ui/card";
import { formatDateTimeVN } from "@/components/utils";
interface OfferPhaseCardProps {
  offerPhase: OfferPhase;
}
const OfferPhaseCard = ({ offerPhase }: OfferPhaseCardProps) => {
  return (
    <Card className="p-2 bg-black text-white">
      <div className="flex gap-2 items-center">
        <div className="text-xs font-semibold ">{offerPhase?.phase}</div>
        <div className="text-2xl font-semibold truncate">
          {offerPhase?.phaseName}
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
