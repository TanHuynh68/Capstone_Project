import { Avatar } from "@/components/atoms/avatar/avatar";
import { Badge } from "@/components/atoms/badge/badge";
import { format } from "date-fns";

interface OfferCardProps {
  offer: Offer;
  onClick?: () => void;
}

export function OfferCard({ offer, onClick }: OfferCardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const createdAt = format(new Date(offer.createdAt), "dd/MM/yyyy");
  const deadline = format(new Date(offer.deadlineEndAt), "dd/MM/yyyy");

  return (
    <div
      onClick={onClick}
      className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Avatar + name + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar
            src={offer.avatar || "/unknown-user.png"}
            alt={offer.fullName}
            size="sm"
          />
          <div className="text-sm font-medium">{offer.fullName}</div>
        </div>

        {/* Trạng thái: chấm tròn + badge hover */}
        {offer.offerStatus === 0 && (
          <div className="relative group w-fit h-fit pl-2">
            <div
              className="w-3 h-3 bg-yellow-400 rounded-full transition-opacity duration-300 group-hover:opacity-0 animate-blink2"
              title="Chờ xét"
            />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
              <Badge
                variant="warning"
                className="text-yellow-800 bg-yellow-100 dark:bg-yellow-300/20 dark:text-yellow-300 whitespace-nowrap"
              >
                Chờ xét
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Giá + deadline */}
      <div className="text-sm font-medium mb-2 space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Giá đề xuất:</span>
          <span className="text-primary font-semibold">
            {formatCurrency(offer.initPrice)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Ngày hoàn thành:</span>
          <span className="text-primary font-semibold">{deadline}</span>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {offer.note}
      </div>

      {/* Ảnh minh họa */}
      {offer.sampleImage && (
        <div className="w-full rounded-md overflow-hidden border border-border mb-3 bg-popover flex justify-center items-center">
          <img
            src={offer.sampleImage}
            alt="sample"
            className="w-full max-h-[250px] object-contain"
          />
        </div>
      )}

      {/* Ngày tạo */}
      <div className="text-xs text-muted-foreground italic">
        Đã đăng {createdAt}
      </div>
    </div>
  );
}

