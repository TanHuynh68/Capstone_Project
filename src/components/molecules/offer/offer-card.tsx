import { Avatar } from "@/components/atoms/avatar/avatar";
import { Badge } from "@/components/atoms/badge/badge";
import { format } from "date-fns";

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

            {/* Hover popup profile card */}
            <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 w-[300px] bg-popover text-popover-foreground rounded-2xl shadow-xl p-4 border border-border opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-top pointer-events-none group-hover:pointer-events-auto">
              {/* Top images */}
              <div className="grid grid-cols-3 gap-1 mb-3 overflow-hidden rounded">
                <img
                  src={"/images/labubu-3.png"}
                  alt="ảnh giới thiệu"
                  className="w-full h-[60px] object-contain"
                />
                <img
                  src={"/images/labubu-4.png"}
                  alt="ảnh giới thiệu"
                  className="w-full h-[60px] object-contain"
                />
                <img
                  src={"/images/labubu-5.png"}
                  alt="ảnh giới thiệu"
                  className="w-full h-[60px] object-contain"
                />
              </div>

              {/* Avatar and info */}
              <div className="flex flex-col items-center text-center mb-3">
                <img
                  src={offer.avatar || "/unknown-user.png"}
                  alt={offer.fullName}
                  className="w-16 h-16 rounded-full border-2 border-background -mt-8 shadow-md"
                />
                <div className="font-semibold text-base mt-2">
                  {offer.fullName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {offer.location || "Vietnam"}
                </div>
                <span className="mt-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                  Freelance
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-center text-center text-sm text-muted-foreground mb-4">
                {[
                  { label: "Yêu thích", value: offer.appreciations || "51.6K" },
                  { label: "Theo dõi", value: offer.followers || "12.8K" },
                  { label: "Lượt xem", value: offer.views || "527.4K" },
                ].map((item, index, array) => (
                  <div
                    key={index}
                    className={`relative px-4 ${
                      index !== array.length - 1
                        ? "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-5 after:bg-border"
                        : ""
                    }`}
                  >
                    <div className="font-semibold text-foreground">
                      {item.value}
                    </div>
                    <div className="text-xs">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 border border-border text-sm rounded-full py-1.5 font-medium text-primary hover:bg-accent/5 dark:hover:bg-accent/10 transition-colors">
                  Hồ sơ thiết kế
                </button>
                <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 rounded-full text-sm font-semibold transition-colors">
                  Nhắn tin
                </button>
              </div>

              {/* Dropdown triangle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 rotate-45 bg-popover border-l border-t border-border"></div>
            </div>
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
        <div className="w-full rounded-md overflow-hidden border border-border mb-3 bg-background flex justify-center items-center">
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
