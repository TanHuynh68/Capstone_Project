"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageCircle,
  Star,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import FeedbackService from "@/services/FeedbackService";
import type { FeedbackData } from "@/types/feedback";
import { formatVietnamDateHoursWithSuffix } from "@/utils/date";
import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";

// Custom hook to use FeedbackService
const useFeedbackService = () => {
  const service = FeedbackService();
  return service;
};

export function MyFeedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(
    new Set()
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const { getMyFeedbacks } = useFeedbackService();

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyFeedbacks();
      if (response?.responseRequestModel?.responseList) {
        setFeedbacks(response.responseRequestModel.responseList);
      }
    } catch (err: unknown) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  }, [getMyFeedbacks]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const toggleResponse = (feedbackId: string) => {
    const newExpanded = new Set(expandedResponses);
    if (newExpanded.has(feedbackId)) {
      newExpanded.delete(feedbackId);
    } else {
      newExpanded.add(feedbackId);
    }
    setExpandedResponses(newExpanded);
  };

  // Filter feedbacks based on selected rating
  const filteredFeedbacks = selectedRating
    ? feedbacks.filter((feedback) => feedback.rating === selectedRating)
    : feedbacks;

  // Calculate stats for filtered feedbacks
  const calculateFilteredStats = () => {
    if (filteredFeedbacks.length === 0) return null;

    const totalRating = filteredFeedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    const averageRating = totalRating / filteredFeedbacks.length;

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredFeedbacks.forEach((feedback) => {
      ratingCounts[feedback.rating as keyof typeof ratingCounts]++;
    });

    const ratingPercentages = {
      5: (ratingCounts[5] / filteredFeedbacks.length) * 100,
      4: (ratingCounts[4] / filteredFeedbacks.length) * 100,
      3: (ratingCounts[3] / filteredFeedbacks.length) * 100,
      2: (ratingCounts[2] / filteredFeedbacks.length) * 100,
      1: (ratingCounts[1] / filteredFeedbacks.length) * 100,
    };

    return {
      averageRating,
      totalReviews: filteredFeedbacks.length,
      ratingPercentages,
      ratingCounts,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Đang tải đánh giá...</span>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Chưa có đánh giá nào
          </h3>
          <p className="text-sm text-muted-foreground">
            Bạn chưa có đánh giá nào từ khách hàng
          </p>
        </div>
      </div>
    );
  }

  const filteredStats = calculateFilteredStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Đánh giá của khách hàng
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Tổng cộng: {filteredFeedbacks.length} đánh giá
            {selectedRating && ` (${selectedRating} sao)`}
          </span>
        </div>
      </div>

      {/* Star Rating Filter */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">
            Lọc theo sao:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRating(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                selectedRating === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  selectedRating === rating
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {rating}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Show message when no filtered results */}
      {filteredFeedbacks.length === 0 && selectedRating && (
        <div className="bg-card rounded-lg p-8 border border-border">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Không có đánh giá {selectedRating} sao
            </h3>
            <p className="text-sm text-muted-foreground">
              Chưa có khách hàng nào đánh giá {selectedRating} sao
            </p>
            <button
              onClick={() => setSelectedRating(null)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Xem tất cả đánh giá
            </button>
          </div>
        </div>
      )}

      {/* Rating Summary Section - Only show if there are filtered results */}
      {filteredStats && filteredFeedbacks.length > 0 && (
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex gap-6 justify-center items-center">
            {/* Left side - Average rating */}
            <div className="text-center min-w-[120px]">
              <div className="text-4xl font-bold text-primary mb-2">
                {filteredStats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(filteredStats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredStats.totalReviews} đánh giá
              </div>
            </div>

            {/* Right side - Rating distribution */}
            <div className="flex-1">
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1 w-12 flex-shrink-0">
                      <span className="text-sm font-medium text-foreground">
                        {rating}
                      </span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-3 min-w-0">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{
                          width: `${
                            filteredStats.ratingPercentages[
                              rating as keyof typeof filteredStats.ratingPercentages
                            ]
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-20 text-right flex-shrink-0">
                      {
                        filteredStats.ratingCounts[
                          rating as keyof typeof filteredStats.ratingCounts
                        ]
                      }{" "}
                      đánh giá
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Reviews - Only show if there are filtered results */}
      {filteredFeedbacks.length > 0 && (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.feedbackID}
              className="bg-card rounded-lg p-4 border border-border"
            >
              {/* Customer Review */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {feedback.customerName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      (Khách hàng)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= feedback.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">
                      {feedback.rating}/5
                    </span>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed">
                  {feedback.comment}
                </p>

                {feedback.imageURL && (
                  <div className="flex justify-start items-start">
                    <SingleImageGallery
                      imageUrl={feedback.imageURL}
                      title=""
                      alt="Feedback image"
                      className="max-w-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatVietnamDateHoursWithSuffix(feedback.createdAt)}
                    </span>
                  </div>

                  {/* Designer Response - Collapsible */}
                  {feedback.response && feedback.responseAt && (
                    <button
                      onClick={() => toggleResponse(feedback.feedbackID)}
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {expandedResponses.has(feedback.feedbackID) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span>
                        {expandedResponses.has(feedback.feedbackID)
                          ? "Ẩn phản hồi"
                          : `Xem phản hồi (1)`}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Designer Response Content - Collapsible */}
              {feedback.response && feedback.responseAt && (
                <div className="">
                  {expandedResponses.has(feedback.feedbackID) && (
                    <div className="mt-3 pl-4 border-l-2 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {feedback.designerName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          (Nhà thiết kế)
                        </span>
                      </div>
                      <p className="text-foreground mb-2 leading-relaxed">
                        {feedback.response}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatVietnamDateHoursWithSuffix(
                            feedback.responseAt
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
