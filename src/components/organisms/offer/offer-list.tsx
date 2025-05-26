"use client";

import { OfferCard } from "@/components/molecules/offer/offer-card";
import { Loader2 } from "lucide-react";
import type { Offer } from "@/types";

interface OfferListProps {
  offers: Offer[];
  loading: boolean;
  selectedPostId?: string;
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
}

export function OfferList({
  offers,
  loading,
  selectedPostId,
  onAcceptOffer,
  onRejectOffer,
}: OfferListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Offers {selectedPostId && `(${offers.length})`}
        </h2>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Đang tải offers...</p>
          </div>
        ) : offers.length > 0 ? (
          offers.map((offer) => (
            <OfferCard
              key={offer.offerID}
              offer={offer}
              onAccept={onAcceptOffer}
              onReject={onRejectOffer}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">
              {selectedPostId
                ? "Chưa có offer nào cho bài đăng này"
                : "Chọn một bài đăng để xem offers"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
