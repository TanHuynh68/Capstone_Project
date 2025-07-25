"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, AlertCircle } from "lucide-react";
import CustomerFeedbackForm from "@/components/molecules/feedback/CustomerFeedbackForm";
import DesignerResponseForm from "@/components/molecules/feedback/DesignerResponseForm";
import FeedbackDisplay from "@/components/molecules/feedback/FeedbackDisplay";
import {
  type CreateFeedbackFormData,
  type FeedbackData,
} from "@/schemas/feedbackSchema";
import { ROLE } from "@/constants";

interface FeedbackSectionProps {
  orderID: string;
  userRole: string;
  onCreateFeedback: (data: CreateFeedbackFormData) => Promise<void>;
  onCreateResponse: (feedbackID: string, response: string) => Promise<void>;
  onGetFeedback: (orderID: string) => Promise<FeedbackData | null>;
}

export default function FeedbackSection({
  orderID,
  userRole,
  onCreateFeedback,
  onCreateResponse,
  onGetFeedback,
}: FeedbackSectionProps) {
  const [feedback, setFeedback] = useState<FeedbackData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [orderID]);

  const fetchFeedback = async () => {
    setLoading(true);
    const result = await onGetFeedback(orderID);
    console.log("orderID: ", orderID);
    console.log("fetchFeedback: ", result);
    if (result) {
      setFeedback(result);
    }
    setLoading(false);
  };

  const handleCreateFeedback = async (data: CreateFeedbackFormData) => {
    await onCreateFeedback(data);
    await fetchFeedback(); // Refresh feedback data
  };

  const handleCreateResponse = async (feedbackID: string, response: string) => {
    await onCreateResponse(feedbackID, response);
    await fetchFeedback(); // Refresh feedback data
  };

  const showCustomerForm = userRole === ROLE.CUSTOMER && !feedback;
  const showDesignerForm =
    userRole === ROLE.DESIGNER && feedback && !feedback.response;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Đánh giá & Phản hồi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Đang tải...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Display existing feedback */}
            {feedback && <FeedbackDisplay feedback={feedback} />}

            {/* Customer feedback form */}
            {showCustomerForm && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Đánh giá dịch vụ
                </h3>
                <CustomerFeedbackForm
                  orderID={orderID}
                  onSubmit={handleCreateFeedback}
                />
              </div>
            )}

            {/* Designer response form */}
            {showDesignerForm && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Phản hồi đánh giá
                </h3>
                <DesignerResponseForm
                  feedbackID={feedback.feedbackID}
                  onSubmit={handleCreateResponse}
                />
              </div>
            )}

            {/* No feedback state */}
            {!feedback && !showCustomerForm && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  {userRole === ROLE.CUSTOMER
                    ? "Chưa có đánh giá nào cho đơn hàng này"
                    : "Khách hàng chưa đánh giá đơn hàng này"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
