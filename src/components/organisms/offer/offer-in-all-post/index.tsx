"use client";

import { OfferCard } from "@/components/molecules/offer/offer-card";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface OfferListProps {
  offers: Offer[];
  loading: boolean;
  selectedPostId?: string;
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
  isVisible?: boolean;
}

export function OfferInAllPost({
  offers,
  loading,
  selectedPostId,
  onAcceptOffer,
  onRejectOffer,
  isVisible = true,
}: OfferListProps) {
  const [exitingOffers, setExitingOffers] = useState<Set<string>>(new Set());
  const [visibleOffers, setVisibleOffers] = useState<Offer[]>([]);
  const [isExiting, setIsExiting] = useState(false);

//   console.log(selectedPostId, "selectedPostIdselectedPostIdselectedPostId");
//   console.log(offers, "offersoffersoffers");

  // Handle smooth transitions when offers change or visibility changes
  useEffect(() => {
    if (!isVisible && visibleOffers.length > 0) {
      // Thêm delay nhỏ trước khi bắt đầu animation exit
      const startExitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 100);

      // Đợi animation exit hoàn thành trước khi xóa offers
      const exitTimer = setTimeout(() => {
        setVisibleOffers([]);
        setIsExiting(false);
      }, 900); // Tăng thời gian để đảm bảo animation hoàn thành

      return () => {
        clearTimeout(startExitTimer);
        clearTimeout(exitTimer);
      };
    } else if (isVisible) {
      const newOffers = offers.filter(
        (offer) => !exitingOffers.has(offer.offerID)
      );
      if (newOffers.length !== visibleOffers.length) {
        setVisibleOffers(newOffers);
      }
    }
  }, [offers, exitingOffers, isVisible, visibleOffers.length]);

  const handleAcceptOffer = (offerId: string) => {
    setExitingOffers((prev) => new Set([...prev, offerId]));
    setTimeout(() => {
      onAcceptOffer?.(offerId);
      setExitingOffers((prev) => {
        const next = new Set(prev);
        next.delete(offerId);
        return next;
      });
    }, 400);
  };

  const handleRejectOffer = (offerId: string) => {
    setExitingOffers((prev) => new Set([...prev, offerId]));
    setTimeout(() => {
      onRejectOffer?.(offerId);
      setExitingOffers((prev) => {
        const next = new Set(prev);
        next.delete(offerId);
        return next;
      });
    }, 400);
  };

  if (!isVisible && visibleOffers.length === 0 && !isExiting) return null;

  return (
    <>
      <style>
        {`
          .offer-list-container {
            transition: none;
            transform-origin: top;
            will-change: transform, opacity, filter;
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
buil
          .offer-list-container.exiting {
            animation: containerExit 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            animation-delay: 100ms;
            pointer-events: none;
          }

          @keyframes containerExit {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
            40% {
              opacity: 1;
              transform: translateY(5px) scale(1.02);
              filter: blur(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-30px) scale(0.95);
              filter: blur(4px);
            }
          }

          .offer-item {
            transition: none;
            transform-origin: top;
            will-change: transform, opacity, filter;
            position: relative;
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-30px) scale(0.95);
              filter: blur(4px);
            }
            60% {
              opacity: 1;
              transform: translateY(5px) scale(1.02);
              filter: blur(0);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes slideUp {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
            40% {
              opacity: 1;
              transform: translateY(5px) scale(1.02);
              filter: blur(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-30px) scale(0.95);
              filter: blur(4px);
            }
          }

          .animate-slide-down {
            animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .animate-slide-up {
            animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            animation-delay: 100ms;
            pointer-events: none;
          }

          .offer-list {
            position: relative;
          }

          .offer-list > * {
            position: relative;
            z-index: 1;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          .offer-list > *:hover {
            z-index: 2;
          }

          /* Stagger effect for both enter and exit */
          .offer-list > *:nth-child(1) { animation-delay: 0ms !important; }
          .offer-list > *:nth-child(2) { animation-delay: 100ms !important; }
          .offer-list > *:nth-child(3) { animation-delay: 200ms !important; }
          .offer-list > *:nth-child(4) { animation-delay: 300ms !important; }
          .offer-list > *:nth-child(5) { animation-delay: 400ms !important; }
          .offer-list > *:nth-child(n+6) { animation-delay: 500ms !important; }
        `}
      </style>
      <div className={`offer-list-container ${isExiting ? "exiting" : ""}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Offers {selectedPostId && `(${visibleOffers.length})`}
            </h2>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Đang tải offers...</p>
              </div>
            ) : visibleOffers.length > 0 ? (
              <div className="offer-list space-y-3">
                {visibleOffers.map((offer) => (
                  <div
                    key={offer.offerID}
                    className={`offer-item ${
                      isExiting ? "animate-slide-up" : "animate-slide-down"
                    }`}
                    style={{
                      animationFillMode: "both",
                    }}
                  >
                    <OfferCard
                      offer={offer}
                      onAccept={() => handleAcceptOffer(offer.offerID)}
                      onReject={() => handleRejectOffer(offer.offerID)}
                    />
                  </div>
                ))}
              </div>
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
      </div>
    </>
  );
}
