"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import {
  createFeedbackSchema,
  type CreateFeedbackFormData,
} from "@/schemas/feedbackSchema";
import useZodForm from "@/hooks/useFormValidation";
import FormField from "./FormField";

interface CustomerFeedbackFormProps {
  orderID: string;
  onSubmit: any;
  loading?: boolean;
}

export default function CustomerFeedbackForm({
  orderID,
  onSubmit,
  loading = false,
}: CustomerFeedbackFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const form = useZodForm(createFeedbackSchema, {
    defaultValues: {
      orderID,
      rating: 0,
      comment: "",
      image: undefined,
    },
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onChange", // Re-validate on change after first submit
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = form;

  const watchedComment = watch("comment");
  const watchedImage = watch("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Re-validate image field if form has been submitted before
      if (hasSubmitted) {
        trigger("image");
      }
    }
  };

  const removeImage = () => {
    setValue("image", undefined);
    setImagePreview(null);

    // Re-validate image field if form has been submitted before
    if (hasSubmitted) {
      trigger("image");
    }
  };

  const onFormSubmit = async (data: CreateFeedbackFormData) => {
    try {
      const response = await onSubmit(data);
      if (response && response.responseRequestModel) {
        console.log("onSubmit; ", data);
        // Reset form on success
        reset();
        setImagePreview(null);
        setHasSubmitted(false); // Reset submit state
        toast.success("Đánh giá đã được gửi thành công!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const onFormError = (errors: any) => {
    // This function is called when validation fails
    setHasSubmitted(true);
    console.log("Form validation errors:", errors);
  };

  console.log("hasSubmitted: ", hasSubmitted);
  console.log("Form errors: ", errors);

  // Only show errors after first submit attempt
  const showRatingError = hasSubmitted && errors.rating?.message;
  const showCommentError = hasSubmitted && errors.comment?.message;
  const showImageError = hasSubmitted && errors.image?.message;

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="space-y-6"
    >
      {/* Rating Field */}
      <FormField
        label="Đánh giá của bạn"
        required
        error={showRatingError ? errors.rating?.message + "" : undefined}
      >
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => {
                    field.onChange(star);
                    // Re-validate rating field if form has been submitted before
                    if (hasSubmitted) {
                      trigger("rating");
                    }
                  }}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || field.value)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {field.value > 0 && `${field.value}/5 sao`}
              </span>
            </div>
          )}
        />
      </FormField>

      {/* Comment Field */}
      <FormField
        label="Nhận xét"
        required
        error={showCommentError ? errors.comment?.message + "" : undefined}
      >
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <div>
              <Textarea
                {...field}
                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                className={`min-h-[120px] resize-none ${
                  showCommentError ? "border-red-500 focus:border-red-500" : ""
                }`}
                maxLength={1000}
                onChange={(e) => {
                  field.onChange(e);
                  // Re-validate comment field if form has been submitted before
                  if (hasSubmitted) {
                    trigger("comment");
                  }
                }}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {watchedComment?.length || 0}/1000 ký tự
              </div>
            </div>
          )}
        />
      </FormField>

      {/* Image Upload Field */}
      <FormField
        label="Hình ảnh"
        error={showImageError ? errors.image?.message + "" : undefined}
      >
        {!imagePreview ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
              showImageError ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Nhấp để tải lên hình ảnh
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, GIF tối đa 5MB
              </span>
            </label>
          </div>
        ) : (
          <div className="relative">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-gray-500 mt-1" />
                <div className="flex-1">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 rounded-lg object-cover"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {watchedImage?.name}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </FormField>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || isSubmitting}
          className="px-6"
        >
          {loading || isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </div>
    </form>
  );
}
