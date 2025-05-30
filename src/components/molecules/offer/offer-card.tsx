import { Avatar } from "@/components/atoms/avatar/avatar";
import { Badge } from "@/components/atoms/badge/badge";
import { ProfilePopup } from "@/components/molecules/profile/profile-popup";
import { format } from "date-fns";
import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";

interface OfferCardProps {
  offer: Offer;
  onClick?: () => void;
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
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
      className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-accent/5 dark:hover:bg-accent/10"
    >
      {/* Avatar + name + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="relative group flex text-center justify-center">
            {/* Avatar */}
            <div className="flex items-center justify-center">
              <Avatar
                src={offer.avatar || "/unknown-user.png"}
                alt={offer.fullName}
                size="sm"
                className="cursor-pointer"
              />
              <div className="text-sm font-medium ml-2">{offer.fullName}</div>
            </div>

            {/* Profile Popup */}
            <ProfilePopup
              fullName={offer.fullName}
              avatar={offer.avatar}
              location={offer.location}
              appreciations={offer.appreciations}
              followers={offer.followers}
              views={offer.views}
            />
          </div>
        </div>

        {/* Trạng thái: chấm tròn + badge hover */}
        {offer.offerStatus === 0 && (
          <div className="relative group w-fit h-fit pl-2">
            <div
              className="w-3 h-3 bg-yellow-400 dark:bg-yellow-500 rounded-full transition-opacity duration-300 group-hover:opacity-0 animate-blink2"
              title="Chờ xét"
            />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
              <Badge
                variant="warning"
                className="text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-500/20 whitespace-nowrap"
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
        <div className="mb-3">
          <SingleImageGallery
            imageUrl={offer.sampleImage}
            title=""
            className="!mb-0"
            alt={`Ảnh đề xuất của ${offer.fullName}`}
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
