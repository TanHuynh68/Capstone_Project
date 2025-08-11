"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import ChatMediaGallery from "./ChatMediaGallery";

interface InfoAboutTheConversationTabProps {
  posts: OfferDetail[];
  value: string;
  fetchOfferPhase: (offerID: string) => Promise<void>;
  setOffersPhase: (phases: any[]) => void;
  offersPhase: any[];
  fetchOffers: () => Promise<void>;
  images: ChatMediaItem[];
  designs: ChatMediaItem[];
}

const InfoAboutTheConversationTab = ({
  posts,
  value,
  fetchOfferPhase,
  setOffersPhase,
  offersPhase,
  fetchOffers,
  images,
  designs,
}: InfoAboutTheConversationTabProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Handle value changes with animation
  useEffect(() => {
    if (value !== currentValue) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentValue(value);
        setAnimationKey((prev) => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [value, currentValue]);

  // Initialize currentValue
  useEffect(() => {
    setCurrentValue(value);
  }, []);

  const renderContent = () => {
    const baseClasses = `transition-all duration-300 ease-in-out transform ${
      isTransitioning
        ? "opacity-0 translate-y-4 scale-95"
        : "opacity-100 translate-y-0 scale-100"
    }`;

    switch (currentValue) {
      case "viewPost":
        return (
          <div key={`viewPost-${animationKey}`} className={baseClasses}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bài đăng ({posts?.length || 0})
              </h3>
              <PostCard
                fetchOffers={fetchOffers}
                offersPhase={offersPhase}
                setOffersPhase={setOffersPhase}
                fetchOfferPhase={fetchOfferPhase}
                posts={posts}
              />
            </div>
          </div>
        );

      case "images":
        return (
          <div key={`images-${animationKey}`} className={baseClasses}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Ảnh ({images?.length || 0})
              </h3>
              <ChatMediaGallery mediaItems={images} type="images" />
            </div>
          </div>
        );

      case "designs":
        return (
          <div key={`designs-${animationKey}`} className={baseClasses}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thiết kế ({designs?.length || 0})
              </h3>
              <ChatMediaGallery mediaItems={designs} type="designs" />
            </div>
          </div>
        );

      case "offerPhase":
        return (
          <div key={`offerPhase-${animationKey}`} className={baseClasses}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Xem đề xuất
              </h3>
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                <div className="text-lg font-medium mb-2">
                  Danh sách đề xuất
                </div>
                <div className="text-sm mb-4">
                  Nội dung đề xuất sẽ hiển thị ở đây
                </div>
                {/* Mock content for testing scroll */}
                <div className="space-y-3 text-left max-h-96 overflow-y-auto">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white rounded-lg border shadow-sm"
                    >
                      <div className="font-medium text-gray-800">
                        Đề xuất #{i + 1}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Đây là nội dung mô tả chi tiết cho đề xuất số {i + 1}.
                        Nội dung này có thể rất dài và cần scroll để xem hết.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-0 flex-1">
      <div className="h-full overflow-y-auto">
        {/* Content Container with Animation */}
        <div className="relative">
          {/* Background Animation */}
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out rounded-lg ${
              isTransitioning ? "bg-gray-50" : "bg-transparent"
            }`}
          />

          {/* Content with Staggered Animation */}
          <div className="relative z-10 p-4">{renderContent()}</div>

          {/* Loading Overlay */}
          {isTransitioning && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/80 rounded-lg">
              <div className="flex space-x-1">
                {[0, 150, 300].map((delay, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoAboutTheConversationTab;
