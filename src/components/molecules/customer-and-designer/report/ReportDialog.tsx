"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  X,
  ImageIcon,
  Plus,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  reportSchema,
  type ReportFormData,
} from "@/schemas/report/reportSchema";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetID?: string;
  defaultReportType?: number;
  onSubmit: any;
}

export default function ReportDialog({
  isOpen,
  onClose,
  targetID,
  defaultReportType = 1,
  onSubmit,
}: ReportDialogProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      targetID: targetID || "",
      reportType: defaultReportType,
      title: "",
      content: "",
      images: [],
      imagesDescriptions: [],
    },
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    const newImages = [...uploadedImages];
    const newPreviews = [...imagePreviews];
    const newDescriptions = [...imageDescriptions];

    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);

    // Initialize description if not exists
    if (!newDescriptions[index]) {
      newDescriptions[index] = "";
    }

    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
    setImageDescriptions(newDescriptions);

    // Update form
    form.setValue("images", newImages.filter(Boolean));
  };

  const handleImageDescriptionChange = (index: number, description: string) => {
    const newDescriptions = [...imageDescriptions];
    newDescriptions[index] = description;
    setImageDescriptions(newDescriptions);

    // Update form
    form.setValue(
      "imagesDescriptions",
      newDescriptions.filter((desc) => desc.trim() !== "")
    );
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newDescriptions = imageDescriptions.filter((_, i) => i !== index);

    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
    setImageDescriptions(newDescriptions);

    // Update form
    form.setValue("images", newImages);
    form.setValue(
      "imagesDescriptions",
      newDescriptions.filter((desc) => desc.trim() !== "")
    );

    // Revoke URL to prevent memory leaks
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
  };

  const addMoreImages = () => {
    if (uploadedImages.length >= 5) {
      toast.error("Tối đa 5 hình ảnh");
      return;
    }

    setUploadedImages([...uploadedImages, null as any]);
    setImagePreviews([...imagePreviews, ""]);
    setImageDescriptions([...imageDescriptions, ""]);
  };

  const handleSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);

    try {
      // Filter out empty images and descriptions
      const filteredImages = uploadedImages.filter(Boolean);
      const filteredDescriptions = imageDescriptions.filter(
        (desc) => desc.trim() !== ""
      );
      const submitData = {
        ...data,
        images: filteredImages,
        imagesDescriptions: filteredDescriptions,
      };
      console.log("submitData: ", submitData);
      const success = await onSubmit(submitData);

      if (success && success.responseRequestModel) {
        // Reset form and close dialog
        form.reset();
        setUploadedImages([]);
        setImagePreviews([]);
        setImageDescriptions([]);

        // Cleanup URLs
        imagePreviews.forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });

        onClose();
        toast.success("Gửi báo cáo thành công");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gửi báo cáo thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Cleanup URLs when closing
      imagePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });

      form.reset();
      setUploadedImages([]);
      setImagePreviews([]);
      setImageDescriptions([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Báo cáo vi phạm
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Tiêu đề <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề báo cáo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Nội dung <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về vi phạm..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images Upload */}
            <div className="space-y-4">
              <FormLabel className="text-sm font-medium">
                Hình ảnh minh chứng
              </FormLabel>

              {/* First upload or when no images */}
              {uploadedImages.length === 0 && (
                <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600 mb-4">
                        Tải lên hình ảnh minh chứng (tùy chọn)
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 0)}
                        className="hidden"
                        id="first-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("first-image-upload")?.click()
                        }
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Chọn hình ảnh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Uploaded Images */}
              {uploadedImages.map((image, index) => (
                <Card key={index} className="border">
                  {/* The image is not used so there must be a line below to avoid warning err */}
                  <div hidden>{console.log(image) + ""}</div>
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                      {/* Image Preview or Upload */}
                      <div className="flex-shrink-0">
                        {imagePreviews[index] ? (
                          <div className="relative">
                            <img
                              src={imagePreviews[index] || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              className="hidden"
                              id={`image-upload-${index}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById(`image-upload-${index}`)
                                  ?.click()
                              }
                              className="h-full w-full"
                            >
                              <Upload className="h-6 w-6 text-gray-400" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Image Description */}
                      {imagePreviews[index] && (
                        <div className="flex-1">
                          <FormLabel className="text-sm font-medium mb-2 block">
                            Mô tả hình ảnh {index + 1}
                          </FormLabel>
                          <Textarea
                            placeholder="Mô tả nội dung hình ảnh..."
                            value={imageDescriptions[index] || ""}
                            onChange={(e) =>
                              handleImageDescriptionChange(
                                index,
                                e.target.value
                              )
                            }
                            className="min-h-[80px]"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add More Images Button */}
              {uploadedImages.length > 0 && uploadedImages.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMoreImages}
                  className="w-full bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm hình ảnh ({uploadedImages.length}/5)
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Gửi báo cáo
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
