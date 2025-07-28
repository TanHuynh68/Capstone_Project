"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import FeedbackService from "@/services/FeedbackService";
import type { FeedbackData } from "@/types/feedback";
import FeedbackDisplay from "@/components/molecules/feedback/FeedbackDisplay";

// Custom hook to use FeedbackService
const useFeedbackService = () => {
  const service = FeedbackService();
  return service;
};

export function MyFeedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Đánh giá của khách hàng</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Tổng cộng: {feedbacks.length} đánh giá</span>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.feedbackID}
            className="bg-card rounded-lg p-4 border border-border"
          >
            <FeedbackDisplay feedback={feedback} />
          </div>
        ))}
      </div>
    </div>
  );
}
