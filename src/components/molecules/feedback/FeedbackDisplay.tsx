"use client";

import { Star, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { FeedbackData } from "@/schemas/feedbackSchema";

interface FeedbackDisplayProps {
  feedback: FeedbackData;
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'lúc' HH:mm", {
        locale: vi,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Customer Feedback */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {feedback.customerName}
            </span>
            <span className="text-sm text-blue-600">(Khách hàng)</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= feedback.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-blue-600">
              {feedback.rating}/5
            </span>
          </div>
        </div>

        <p className="text-gray-800 mb-3">{feedback.comment}</p>

        {feedback.imageURL && (
          <div className="mb-3">
            <img
              src={feedback.imageURL || "/placeholder.svg"}
              alt="Feedback image"
              className="max-w-full h-auto max-h-48 rounded-lg object-cover border"
            />
          </div>
        )}

        <div className="flex items-center gap-1 text-sm text-blue-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(feedback.createdAt)}</span>
        </div>
      </div>

      {/* Designer Response */}
      {feedback.response && feedback.responseAt && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 ml-8">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">
              {feedback.designerName}
            </span>
            <span className="text-sm text-green-600">(Nhà thiết kế)</span>
          </div>

          <p className="text-gray-800 mb-3">{feedback.response}</p>

          <div className="flex items-center gap-1 text-sm text-green-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(feedback.responseAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
