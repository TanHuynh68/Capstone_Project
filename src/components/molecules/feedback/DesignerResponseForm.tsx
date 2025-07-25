"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import {
  createFeedbackResponseSchema,
  type CreateFeedbackResponseFormData,
} from "@/schemas/feedbackSchema";
import useZodForm from "@/hooks/useFormValidation";
import FormField from "./FormField";

interface DesignerResponseFormProps {
  feedbackID: string;
  onSubmit: (feedbackID: string, response: string) => Promise<void>;
  loading?: boolean;
}

export default function DesignerResponseForm({
  feedbackID,
  onSubmit,
  loading = false,
}: DesignerResponseFormProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const form = useZodForm(createFeedbackResponseSchema, {
    defaultValues: {
      feedbackID,
      response: "",
    },
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onChange", // Re-validate on change after first submit
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = form;

  const watchedResponse = watch("response");

  const onFormSubmit = async (data: CreateFeedbackResponseFormData) => {
    try {
      await onSubmit(data.feedbackID, data.response);
      // Reset form on success
      reset({ feedbackID, response: "" });
      setHasSubmitted(false); // Reset submit state
      toast.success("Phản hồi đã được gửi thành công!");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Có lỗi xảy ra khi gửi phản hồi");
    }
  };

  const onFormError = (errors: any) => {
    // This function is called when validation fails
    setHasSubmitted(true);
    console.log("Form validation errors:", errors);

    // Show toast for first error
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  // Only show errors after first submit attempt
  const showResponseError = hasSubmitted && errors.response?.message;

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="space-y-4"
    >
      <FormField
        label="Phản hồi của bạn"
        required
        error={showResponseError ? errors.response?.message + "" : undefined}
      >
        <Controller
          name="response"
          control={control}
          render={({ field }) => (
            <div>
              <Textarea
                {...field}
                placeholder="Nhập phản hồi của bạn..."
                className={`min-h-[100px] resize-none ${
                  showResponseError ? "border-red-500 focus:border-red-500" : ""
                }`}
                maxLength={500}
                onChange={(e) => {
                  field.onChange(e);
                  // Re-validate response field if form has been submitted before
                  if (hasSubmitted) {
                    trigger("response");
                  }
                }}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {watchedResponse?.length || 0}/500 ký tự
              </div>
            </div>
          )}
        />
      </FormField>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || isSubmitting}
          className="px-6"
        >
          {loading || isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
        </Button>
      </div>
    </form>
  );
}
