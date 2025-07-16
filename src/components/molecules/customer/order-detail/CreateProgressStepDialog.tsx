"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Upload, Loader2, ImageIcon } from "lucide-react";
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema";
import { toast } from "sonner";

interface CreateProgressStepDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderID: string;
  offerPhaseID: string;
  onSubmit: (data: CreateProgressStepFormData) => Promise<void>;
}

export default function CreateProgressStepDialog({
  isOpen,
  onClose,
  orderID,
  offerPhaseID,
  onSubmit,
}: CreateProgressStepDialogProps) {
  const [formData, setFormData] = useState<CreateProgressStepFormData>({
    orderID,
    offerPhaseID,
    stepTitle: "",
    description: "",
    imagesDescriptions: ["", "", "", "", "", ""], // 6 empty descriptions
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  const handleInputChange = (
    field: keyof CreateProgressStepFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Hide validation summary when user starts fixing errors
    if (showValidationSummary) {
      setShowValidationSummary(false);
    }
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...formData.imagesDescriptions];
    newDescriptions[index] = value;
    setFormData((prev) => ({ ...prev, imagesDescriptions: newDescriptions }));

    // Clear description errors
    if (errors.imagesDescriptions) {
      setErrors((prev) => ({ ...prev, imagesDescriptions: "" }));
    }
    if (errors[`imageDescription${index}`]) {
      setErrors((prev) => ({ ...prev, [`imageDescription${index}`]: "" }));
    }
    if (showValidationSummary) {
      setShowValidationSummary(false);
    }
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    if (file) {
      // Add or replace image at specific index
      newImages[index] = file;
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      newPreviews[index] = previewUrl;
    } else {
      // Remove image at specific index
      if (newImages[index]) {
        newImages.splice(index, 1);
      }
      // Revoke old preview URL to prevent memory leaks
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]!);
        newPreviews[index] = null;
      }
    }

    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);

    // Clear image errors
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
    if (errors[`image${index}`]) {
      setErrors((prev) => ({ ...prev, [`image${index}`]: "" }));
    }
    if (showValidationSummary) {
      setShowValidationSummary(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.stepTitle.trim()) {
      newErrors.stepTitle = "Tiêu đề bước là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả chi tiết là bắt buộc";
    }

    // Validate first 3 images (required)
    for (let i = 0; i < 3; i++) {
      if (!imagePreviews[i]) {
        newErrors[`image${i}`] = `Ảnh ${i + 1} là bắt buộc`;
      } else {
        // If image exists, description is required
        if (!formData.imagesDescriptions[i].trim()) {
          newErrors[`imageDescription${i}`] = `Mô tả ảnh ${i + 1} là bắt buộc`;
        }
      }
    }

    // Validate optional images (3-6): if image exists, description is required
    for (let i = 3; i < 6; i++) {
      if (imagePreviews[i] && !formData.imagesDescriptions[i].trim()) {
        newErrors[`imageDescription${i}`] = `Mô tả ảnh ${
          i + 1
        } là bắt buộc khi có ảnh`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowValidationSummary(true);
      return false;
    }

    setErrors({});
    setShowValidationSummary(false);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to top to show validation summary
      const dialogContent = document.querySelector(
        '[role="dialog"] .overflow-y-auto'
      );
      if (dialogContent) {
        dialogContent.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Filter out empty data before submitting
      const filledImages = formData.images.filter(Boolean);
      const filledDescriptions = formData.imagesDescriptions.filter(
        (desc) => desc.trim() !== ""
      );

      const submitData = {
        ...formData,
        images: filledImages,
        imagesDescriptions: filledDescriptions,
      };

      await onSubmit(submitData);
      // Success - close dialog and reset form
      handleClose();
      resetForm();
    } catch (error) {
      console.error("Error creating progress step:", error);
      toast.error("Có lỗi xảy ra khi tạo bước tiến độ", {
        description: "Vui lòng thử lại sau",
      });
      // Keep dialog open on failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Revoke all preview URLs
    imagePreviews.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });

    setFormData({
      orderID,
      offerPhaseID,
      stepTitle: "",
      description: "",
      imagesDescriptions: ["", "", "", "", "", ""],
      images: [],
    });
    setImagePreviews([null, null, null, null, null, null]);
    setErrors({});
    setShowValidationSummary(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
    setShowValidationSummary(false);
  };

  const triggerFileInput = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileChange(index, file);
      }
    };
    input.click();
  };

  const removeImage = (index: number) => {
    handleFileChange(index, null);
    // Also clear the description
    handleDescriptionChange(index, "");
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[1200px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-blue-600" />
            Tạo tiến độ mới
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Thêm tiến độ cho giai đoạn thực hiện
          </p>
        </DialogHeader>

        <div className="space-y-8 py-6 grid grid-cols-12 gap-2">
          {/* Step Details */}
          <Card className="shadow-sm border-gray-200 col-span-4 h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Chi tiết bước thực hiện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label
                    htmlFor="stepTitle"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Tiêu đề bước <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stepTitle"
                    value={formData.stepTitle}
                    onChange={(e) =>
                      handleInputChange("stepTitle", e.target.value)
                    }
                    placeholder="Nhập tiêu đề cho bước thực hiện"
                    className={`mt-2 ${
                      errors.stepTitle
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "focus:border-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Mô tả chi tiết <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Mô tả chi tiết về bước thực hiện này..."
                    rows={4}
                    className={`mt-2 resize-none ${
                      errors.description
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Upload */}
          <Card className="shadow-sm border-gray-200 col-span-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Hình ảnh tiến độ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* First row - 3 required images */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Ảnh bắt buộc (3 ảnh đầu)
                </h4>
                <div className="grid grid-cols-3 gap-6">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-3">
                      <div className="relative group">
                        <div
                          className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                            imagePreviews[index]
                              ? "border-green-300 bg-green-50"
                              : errors[`image${index}`]
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          {imagePreviews[index] ? (
                            <div className="relative">
                              <img
                                src={
                                  imagePreviews[index]! || "/placeholder.svg"
                                }
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg shadow-sm"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-2 left-2 right-2">
                                <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded truncate">
                                  {formData.images[index]?.name ||
                                    `Ảnh ${index + 1}`}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex flex-col items-center justify-center h-32 cursor-pointer group-hover:scale-105 transition-transform"
                              onClick={() => triggerFileInput(index)}
                            >
                              <Upload className="h-8 w-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                              <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors font-medium">
                                Chọn ảnh {index + 1}{" "}
                                <span className="text-red-500">*</span>
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                PNG, JPG, JPEG
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description input below each image */}
                      <div>
                        <Label
                          htmlFor={`description-${index}`}
                          className="text-xs font-medium text-gray-600"
                        >
                          Mô tả ảnh {index + 1}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`description-${index}`}
                          value={formData.imagesDescriptions[index]}
                          onChange={(e) =>
                            handleDescriptionChange(index, e.target.value)
                          }
                          placeholder={`Mô tả cho ảnh ${index + 1}...`}
                          className={`mt-1 text-sm ${
                            errors[`imageDescription${index}`]
                              ? "border-red-500 focus:border-red-500 bg-red-50"
                              : ""
                          }`}
                          disabled={!imagePreviews[index]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second row - 3 optional images */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Ảnh tùy chọn (3 ảnh sau)
                </h4>
                <div className="grid grid-cols-3 gap-6">
                  {[3, 4, 5].map((index) => (
                    <div key={index} className="space-y-3">
                      <div className="relative group">
                        <div
                          className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                            imagePreviews[index]
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          {imagePreviews[index] ? (
                            <div className="relative">
                              <img
                                src={
                                  imagePreviews[index]! || "/placeholder.svg"
                                }
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg shadow-sm"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-2 left-2 right-2">
                                <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded truncate">
                                  {formData.images[index]?.name ||
                                    `Ảnh ${index + 1}`}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex flex-col items-center justify-center h-32 cursor-pointer group-hover:scale-105 transition-transform"
                              onClick={() => triggerFileInput(index)}
                            >
                              <Upload className="h-8 w-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                              <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors font-medium">
                                Chọn ảnh {index + 1} (tùy chọn)
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                PNG, JPG, JPEG
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description input below each image */}
                      <div>
                        <Label
                          htmlFor={`description-${index}`}
                          className="text-xs font-medium text-gray-600"
                        >
                          Mô tả ảnh {index + 1}{" "}
                          {imagePreviews[index] && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          id={`description-${index}`}
                          value={formData.imagesDescriptions[index]}
                          onChange={(e) =>
                            handleDescriptionChange(index, e.target.value)
                          }
                          placeholder={`Mô tả cho ảnh ${index + 1}...`}
                          className={`mt-1 text-sm ${
                            errors[`imageDescription${index}`]
                              ? "border-red-500 focus:border-red-500 bg-red-50"
                              : ""
                          }`}
                          disabled={!imagePreviews[index]}
                        />
                        {errors[`imageDescription${index}`] && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors[`imageDescription${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Lưu ý:</span> 3 ảnh đầu và mô tả của
            chúng là bắt buộc
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 bg-transparent"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo tiến độ"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
