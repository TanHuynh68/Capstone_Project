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
import {
  X,
  Upload,
  Loader2,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
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

  // Image preview modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

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

  const handleMultipleFileChange = (files: FileList) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    const newDescriptions = [...formData.imagesDescriptions];

    // Calculate how many more images we can add
    const currentImageCount = newImages.filter(Boolean).length;
    const maxAdditional = 6 - currentImageCount;
    const filesToAdd = Math.min(files.length, maxAdditional);

    if (filesToAdd < files.length) {
      toast.warning(
        `Chỉ có thể thêm ${maxAdditional} ảnh nữa. Đã chọn ${filesToAdd} ảnh đầu tiên.`
      );
    }

    // Find empty slots and fill them
    let fileIndex = 0;
    for (let i = 0; i < 6 && fileIndex < filesToAdd; i++) {
      if (!newImages[i]) {
        const file = files[fileIndex];
        newImages[i] = file;
        newPreviews[i] = URL.createObjectURL(file);
        fileIndex++;
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imagesDescriptions: newDescriptions,
    }));
    setImagePreviews(newPreviews);

    // Clear image errors
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
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

    // Count actual images
    const actualImages = formData.images.filter(Boolean);
    if (actualImages.length < 3) {
      newErrors.images = "Cần ít nhất 3 ảnh";
    }

    // Validate descriptions for existing images
    formData.images.forEach((image, index) => {
      if (image && !formData.imagesDescriptions[index].trim()) {
        newErrors[`imageDescription${index}`] = `Mô tả ảnh ${
          index + 1
        } là bắt buộc`;
      }
    });

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
        (desc, index) => formData.images[index] && desc.trim() !== ""
      );

      const submitData = {
        ...formData,
        images: filledImages,
        imagesDescriptions: filledDescriptions,
      };

      await onSubmit(submitData);
      handleClose();
      resetForm();
    } catch (error) {
      console.error("Error creating progress step:", error);
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

  const triggerFileInput = () => {
    const currentImageCount = formData.images.filter(Boolean).length;
    const maxAdditional = 6 - currentImageCount;

    if (maxAdditional === 0) {
      toast.warning("Đã đạt giới hạn tối đa 6 ảnh");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        handleMultipleFileChange(files);
      }
    };
    input.click();
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    const newDescriptions = [...formData.imagesDescriptions];

    // Revoke URL to prevent memory leaks
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]!);
    }

    // Remove image and shift remaining images
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    newDescriptions.splice(index, 1);

    // Add empty slots at the end
    while (newImages.length < 6) {
      newImages.push(null as any);
      newPreviews.push(null);
      newDescriptions.push("");
    }

    setFormData((prev) => ({
      ...prev,
      images: newImages.filter(Boolean),
      imagesDescriptions: newDescriptions,
    }));
    setImagePreviews(newPreviews);
    handleDescriptionChange(index, "");
  };

  const openPreview = (index: number) => {
    setCurrentPreviewIndex(index);
    setPreviewModalOpen(true);
  };

  const nextPreview = () => {
    const validImages = imagePreviews.filter(Boolean);
    const currentValidIndex = imagePreviews.findIndex(
      (_, i) => i === currentPreviewIndex
    );
    const nextValidIndex = (currentValidIndex + 1) % validImages.length;
    setCurrentPreviewIndex(
      imagePreviews.findIndex(
        (img, i) =>
          img &&
          imagePreviews.slice(0, i + 1).filter(Boolean).length ===
            nextValidIndex + 1
      )
    );
  };

  const prevPreview = () => {
    const validImages = imagePreviews.filter(Boolean);
    const currentValidIndex = imagePreviews.findIndex(
      (_, i) => i === currentPreviewIndex
    );
    const prevValidIndex =
      currentValidIndex === 0 ? validImages.length - 1 : currentValidIndex - 1;
    setCurrentPreviewIndex(
      imagePreviews.findIndex(
        (img, i) =>
          img &&
          imagePreviews.slice(0, i + 1).filter(Boolean).length ===
            prevValidIndex + 1
      )
    );
  };

  const validImageCount = imagePreviews.filter(Boolean).length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="min-w-[1100px] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              Tạo tiến độ mới
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6  grid grid-cols-12 gap-2">
            {/* Step Details */}
            <Card className="shadow-sm border-gray-200 col-span-5 h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Chi tiết bước thực hiện
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 gap-4">
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
                    {errors.stepTitle && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.stepTitle}
                      </p>
                    )}
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
                      rows={3}
                      className={`mt-2 resize-none ${
                        errors.description
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "focus:border-blue-500"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images Upload */}
            <Card className="shadow-sm border-gray-200 col-span-7">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Hình ảnh tiến độ ({validImageCount}/6)
                  </div>
                  <Button
                    type="button"
                    onClick={triggerFileInput}
                    className="h-8 px-3 text-sm bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Chọn ảnh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {errors.images && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      {errors.images}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="space-y-3">
                      <div className="relative group">
                        <div
                          className={`border-2 border-dashed rounded-xl p-3 transition-all duration-200 ${
                            imagePreviews[index]
                              ? "border-green-300 bg-green-50"
                              : index < 3
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
                                className="w-full h-24 object-cover rounded-lg shadow-sm cursor-pointer"
                                onClick={() => openPreview(index)}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute top-1 left-1 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => openPreview(index)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-1 left-1 right-1">
                                <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded truncate">
                                  {formData.images[index]?.name ||
                                    `Ảnh ${index + 1}`}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-24 text-center">
                              <Upload className="h-6 w-6 text-gray-400 mb-1" />
                              <p className="text-xs text-gray-500 font-medium">
                                Ảnh {index + 1}
                                {index < 3 && (
                                  <span className="text-red-500"> *</span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description input */}
                      {imagePreviews[index] && (
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
                          />
                          {errors[`imageDescription${index}`] && (
                            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {errors[`imageDescription${index}`]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
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

      {/* Image Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Xem trước ảnh {currentPreviewIndex + 1}</span>
              <div className="text-sm text-gray-500">
                {imagePreviews
                  .filter(Boolean)
                  .findIndex(
                    (_, i) =>
                      imagePreviews[i] === imagePreviews[currentPreviewIndex]
                  ) + 1}{" "}
                / {validImageCount}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="relative p-6">
            {imagePreviews[currentPreviewIndex] && (
              <div className="relative">
                <img
                  src={
                    imagePreviews[currentPreviewIndex]! || "/placeholder.svg"
                  }
                  alt={`Preview ${currentPreviewIndex + 1}`}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />

                {validImageCount > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevPreview}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextPreview}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}

            {formData.imagesDescriptions[currentPreviewIndex] && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Mô tả ảnh:</h4>
                <p className="text-gray-700">
                  {formData.imagesDescriptions[currentPreviewIndex]}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
