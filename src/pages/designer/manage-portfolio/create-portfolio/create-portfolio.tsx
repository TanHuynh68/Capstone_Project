import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle,
  AlertCircle,
  Upload,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import PortfolioService from "@/services/PortfolioService";

interface CreatePortfolioProps {
  onSuccess: () => void;
}

export function CreatePortfolio({ onSuccess }: CreatePortfolioProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createPortfolio } = PortfolioService();

  const initialFormData = {
    yearOfExperience: "",
    content: "",
    expertIn: "",
    sectionOneDescriptions: ["", "", ""],
    sectionTwoDescriptions: ["", "", ""],
    sectionOneAttachmentFiles: [undefined, undefined, undefined] as (
      | File
      | undefined
    )[],
    sectionTwoAttachmentFiles: [undefined, undefined, undefined] as (
      | File
      | undefined
    )[],
  };

  const initialFormErrors = {
    yearOfExperience: "",
    content: "",
    expertIn: "",
    sectionOneDescriptions: ["", "", ""],
    sectionTwoDescriptions: ["", "", ""],
    sectionOneImages: ["", "", ""],
    sectionTwoImages: ["", "", ""],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [imagePreviews, setImagePreviews] = useState<{
    sectionOne: (string | null)[];
    sectionTwo: (string | null)[];
  }>({
    sectionOne: [null, null, null],
    sectionTwo: [null, null, null],
  });
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  const resetForm = () => {
    // Revoke all preview URLs
    imagePreviews.sectionOne.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    imagePreviews.sectionTwo.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });

    setFormData(initialFormData);
    setFormErrors(initialFormErrors);
    setImagePreviews({
      sectionOne: [null, null, null],
      sectionTwo: [null, null, null],
    });
    setShowValidationSummary(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const validateField = (
    field: keyof typeof initialFormErrors,
    value: string | string[] | (File | undefined)[],
    index?: number
  ): string | string[] => {
    if (Array.isArray(value)) {
      if (field.includes("Images")) {
        if (typeof index === "number") {
          const errors = Array(value.length).fill("");
          errors[index] = !value[index] ? "Vui lòng tải ảnh lên" : "";
          return errors;
        }
        return value.map((v) => (!v ? "Vui lòng tải ảnh lên" : ""));
      }
      if (typeof index === "number") {
        const errors = Array(value.length).fill("");
        const val = value[index];
        errors[index] =
          typeof val === "string" && !val.trim() ? "Vui lòng nhập mô tả" : "";
        return errors;
      }
      return value.map((v) =>
        typeof v === "string" && !v.trim() ? "Vui lòng nhập mô tả" : ""
      );
    }

    const strValue = value as string;
    switch (field) {
      case "yearOfExperience":
        return !strValue.trim() ? "Vui lòng nhập kinh nghiệm" : "";
      case "content":
        return !strValue.trim() ? "Vui lòng nhập mô tả dự án" : "";
      case "expertIn":
        return !strValue.trim() ? "Vui lòng nhập kỹ năng chuyên môn" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (
    field: keyof typeof initialFormData,
    value: string,
    index?: number
  ) => {
    setFormData((prev) => {
      if (typeof index === "number") {
        const newArray = [...prev[field]];
        newArray[index] = value;
        return { ...prev, [field]: newArray };
      }
      return { ...prev, [field]: value };
    });

    // Clear errors when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => {
        if (typeof index === "number") {
          const newErrors = [...prev[field as keyof typeof formErrors]];
          newErrors[index] = "";
          return { ...prev, [field]: newErrors };
        }
        return { ...prev, [field]: "" };
      });
    }

    if (showValidationSummary) {
      setShowValidationSummary(false);
    }
  };

  const handleBlur = (
    field: keyof typeof initialFormErrors,
    value: string | string[] | (File | undefined)[],
    index?: number
  ) => {
    const error = validateField(field, value, index);
    setFormErrors((prev) => {
      if (Array.isArray(error)) {
        if (typeof index === "number") {
          const newErrors = [...prev[field]];
          newErrors[index] = error[0];
          return {
            ...prev,
            [field]: newErrors,
          };
        }
        return {
          ...prev,
          [field]: error as string[],
        };
      }
      return {
        ...prev,
        [field]: error as string,
      };
    });
  };

  const handleInputBlur = (
    field: keyof typeof initialFormData,
    value: string | string[] | (File | undefined)[],
    index?: number
  ) => {
    // Map form data field to validation field
    let validationField: keyof typeof initialFormErrors;
    if (field === "sectionOneAttachmentFiles") {
      validationField = "sectionOneImages";
    } else if (field === "sectionTwoAttachmentFiles") {
      validationField = "sectionTwoImages";
    } else {
      validationField = field as keyof typeof initialFormErrors;
    }

    handleBlur(validationField, value, index);
  };

  const handleFocus = (
    field: keyof typeof initialFormErrors,
    index?: number
  ) => {
    setFormErrors((prev) => {
      if (typeof index === "number") {
        // Handle array fields (descriptions and images)
        const newErrors = [...prev[field]];
        newErrors[index] = "";
        return {
          ...prev,
          [field]: newErrors,
        };
      }
      // Handle single fields
      return {
        ...prev,
        [field]: "",
      };
    });
  };

  const validateImage = (file: File): string | null => {
    // Kiểm tra định dạng file
    const allowedTypes = [".jpg", ".jpeg", ".png"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(fileExtension)) {
      return "Chỉ chấp nhận file ảnh có định dạng .jpg, .jpeg, .png";
    }

    // Kiểm tra kích thước file (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size >= maxSize) {
      return "Kích thước file không được vượt quá 1MB";
    }

    return null;
  };

  const isFormComplete = (): boolean => {
    // Check required text fields
    if (
      !formData.yearOfExperience.trim() ||
      !formData.content.trim() ||
      !formData.expertIn.trim()
    ) {
      return false;
    }

    // Check section one images and descriptions
    for (let i = 0; i < 3; i++) {
      if (
        !imagePreviews.sectionOne[i] ||
        !formData.sectionOneDescriptions[i].trim()
      ) {
        return false;
      }
    }

    // Check section two images and descriptions
    for (let i = 0; i < 3; i++) {
      if (
        !imagePreviews.sectionTwo[i] ||
        !formData.sectionTwoDescriptions[i].trim()
      ) {
        return false;
      }
    }

    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | string[]> = {};

    // Validate required fields
    if (!formData.yearOfExperience.trim()) {
      newErrors.yearOfExperience = "Vui lòng nhập kinh nghiệm";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Vui lòng nhập mô tả dự án";
    }

    if (!formData.expertIn.trim()) {
      newErrors.expertIn = "Vui lòng nhập kỹ năng chuyên môn";
    }

    // Validate section one images and descriptions
    const sectionOneErrors = [];
    const sectionOneDescErrors = [];
    for (let i = 0; i < 3; i++) {
      if (!imagePreviews.sectionOne[i]) {
        sectionOneErrors.push(`Ảnh ${i + 1} của phần 1 là bắt buộc`);
      } else {
        if (!formData.sectionOneDescriptions[i].trim()) {
          sectionOneDescErrors.push(
            `Mô tả ảnh ${i + 1} của phần 1 là bắt buộc`
          );
        }
      }
    }
    if (sectionOneErrors.length > 0) {
      newErrors.sectionOneImages = sectionOneErrors;
    }
    if (sectionOneDescErrors.length > 0) {
      newErrors.sectionOneDescriptions = sectionOneDescErrors;
    }

    // Validate section two images and descriptions
    const sectionTwoErrors = [];
    const sectionTwoDescErrors = [];
    for (let i = 0; i < 3; i++) {
      if (!imagePreviews.sectionTwo[i]) {
        sectionTwoErrors.push(`Ảnh ${i + 1} của phần 2 là bắt buộc`);
      } else {
        if (!formData.sectionTwoDescriptions[i].trim()) {
          sectionTwoDescErrors.push(
            `Mô tả ảnh ${i + 1} của phần 2 là bắt buộc`
          );
        }
      }
    }
    if (sectionTwoErrors.length > 0) {
      newErrors.sectionTwoImages = sectionTwoErrors;
    }
    if (sectionTwoDescErrors.length > 0) {
      newErrors.sectionTwoDescriptions = sectionTwoDescErrors;
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors as typeof initialFormErrors);
      setShowValidationSummary(true);
      return false;
    }

    setFormErrors(initialFormErrors);
    setShowValidationSummary(false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to top to show validation summary
      const dialogContent = document.querySelector(
        '[role="dialog"] .overflow-y-auto'
      );
      if (dialogContent) {
        dialogContent.scrollTo({ top: 0, behavior: "smooth" });
      }
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData object to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append("YearOfExperience", formData.yearOfExperience);
      formDataToSend.append("Content", formData.content);
      formDataToSend.append("ExpertIn", formData.expertIn);

      // Append descriptions as multiple fields with same name
      formData.sectionOneDescriptions.forEach((desc) => {
        formDataToSend.append("SectionOneDescriptions", desc);
      });
      formData.sectionTwoDescriptions.forEach((desc) => {
        formDataToSend.append("SectionTwoDescriptions", desc);
      });

      // Append files as multiple fields with same name
      formData.sectionOneAttachmentFiles.forEach((file) => {
        if (file) {
          formDataToSend.append("SectionOneAttachmentFiles", file);
        }
      });
      formData.sectionTwoAttachmentFiles.forEach((file) => {
        if (file) {
          formDataToSend.append("SectionTwoAttachmentFiles", file);
        }
      });

      // Call the createPortfolio service
      await createPortfolio(formDataToSend);

      // Reset form and close dialog on success
      resetForm();
      setIsOpen(false);

      // Show success message
      toast.success("Tạo dự án thành công!");

      // Call onSuccess callback
      onSuccess();
    } catch (err) {
      console.error("Error creating portfolio:", err);
      // toast.error("Có lỗi xảy ra khi tạo dự án");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = (
    section: "sectionOne" | "sectionTwo",
    index: number
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileChange(section, index, file);
      }
    };
    input.click();
  };

  const handleFileChange = (
    section: "sectionOne" | "sectionTwo",
    index: number,
    file: File | null
  ) => {
    if (file) {
      const validationError = validateImage(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }
    }

    const fileField =
      section === "sectionOne"
        ? "sectionOneAttachmentFiles"
        : "sectionTwoAttachmentFiles";
    const previewField = section === "sectionOne" ? "sectionOne" : "sectionTwo";

    setFormData((prev) => {
      const arr = [...prev[fileField]];
      arr[index] = file as File;
      return { ...prev, [fileField]: arr };
    });

    // Update previews
    setImagePreviews((prev) => {
      const newPreviews = [...prev[previewField]];
      if (file) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        newPreviews[index] = previewUrl;
      } else {
        // Revoke old preview URL to prevent memory leaks
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index]!);
          newPreviews[index] = null;
        }
      }
      return { ...prev, [previewField]: newPreviews };
    });

    // Clear errors
    const validationField =
      section === "sectionOne" ? "sectionOneImages" : "sectionTwoImages";
    setFormErrors((prev) => {
      const newErrors = [...prev[validationField]];
      newErrors[index] = "";
      return { ...prev, [validationField]: newErrors };
    });

    if (showValidationSummary) {
      setShowValidationSummary(false);
    }
  };

  const removeImage = (section: "sectionOne" | "sectionTwo", index: number) => {
    handleFileChange(section, index, null);
    // Also clear the description
    const descField =
      section === "sectionOne"
        ? "sectionOneDescriptions"
        : "sectionTwoDescriptions";
    const newDescriptions = [...formData[descField]];
    newDescriptions[index] = "";
    setFormData((prev) => ({ ...prev, [descField]: newDescriptions }));
  };

  const handleDescriptionChange = (
    section: "sectionOne" | "sectionTwo",
    index: number,
    value: string
  ) => {
    const descField =
      section === "sectionOne"
        ? "sectionOneDescriptions"
        : "sectionTwoDescriptions";
    const newDescriptions = [...formData[descField]];
    newDescriptions[index] = value;
    setFormData((prev) => ({ ...prev, [descField]: newDescriptions }));

    // Clear description errors
    const validationField =
      section === "sectionOne"
        ? "sectionOneDescriptions"
        : "sectionTwoDescriptions";
    setFormErrors((prev) => {
      const newErrors = [...prev[validationField]];
      newErrors[index] = "";
      return { ...prev, [validationField]: newErrors };
    });

    if (showValidationSummary) {
      setShowValidationSummary(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="col-span-full w-full max-w-[450px] min-w-[300px] mx-auto mb-2 h-[400px] flex flex-col items-center justify-center bg-card rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <PlusCircle className="w-12 h-12 text-muted-foreground" />
            <span className="text-lg text-muted-foreground">
              Đăng thiết kế cá nhân
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[1200px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <ImageIcon className="h-6 w-6 text-primary" />
            Đăng thiết kế cá nhân
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Tạo thiết kế cá nhân phô diễn tài năng thiết kế của bạn
          </p>
        </DialogHeader>

        <div className="space-y-8  grid grid-cols-12 gap-6">
          {/* Portfolio Details */}
          <Card className="shadow-sm border-border col-span-4 h-full">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Thông tin thiết kế cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label
                    htmlFor="yearOfExperience"
                    className="text-sm font-semibold text-foreground"
                  >
                    Kinh nghiệm <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="yearOfExperience"
                    value={formData.yearOfExperience}
                    onChange={(e) =>
                      handleInputChange("yearOfExperience", e.target.value)
                    }
                    onFocus={() => handleFocus("yearOfExperience")}
                    onBlur={(e) =>
                      handleInputBlur("yearOfExperience", e.target.value)
                    }
                    placeholder="Ví dụ: 3 năm"
                    className={`mt-2 ${
                      formErrors.yearOfExperience
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "focus:border-blue-500"
                    }`}
                  />
                  {formErrors.yearOfExperience && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {formErrors.yearOfExperience}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="content"
                    className="text-sm font-semibold text-foreground"
                  >
                    Mô tả dự án <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    onFocus={() => handleFocus("content")}
                    onBlur={(e) => handleInputBlur("content", e.target.value)}
                    placeholder="Ví dụ: Từng thiết kế hơn 10 sản phẩm,..."
                    rows={3}
                    className={`mt-2 resize-none ${
                      formErrors.content
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "focus:border-blue-500"
                    }`}
                  />
                  {formErrors.content && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {formErrors.content}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="expertIn"
                    className="text-sm font-semibold text-foreground"
                  >
                    Kỹ năng chuyên môn{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="expertIn"
                    value={formData.expertIn}
                    onChange={(e) =>
                      handleInputChange("expertIn", e.target.value)
                    }
                    onFocus={() => handleFocus("expertIn")}
                    onBlur={(e) => handleInputBlur("expertIn", e.target.value)}
                    placeholder="Ví dụ: Chuyên thiết kế nón, váy, phụ kiện,.."
                    className={`mt-2 ${
                      formErrors.expertIn
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "focus:border-blue-500"
                    }`}
                  />
                  {formErrors.expertIn && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {formErrors.expertIn}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-primary">
                      Lưu ý khi tải ảnh lên
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>
                        Chỉ chấp nhận định dạng:{" "}
                        <span className="font-medium">.jpg, .jpeg, .png</span>
                      </li>
                      <li>
                        Dung lượng tối đa:{" "}
                        <span className="font-medium">1MB</span> cho mỗi ảnh
                      </li>
                      <li>
                        Cần tải lên đủ{" "}
                        <span className="font-medium">3 ảnh</span> cho mỗi phần
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Upload */}
          <Card className="shadow-sm border-border col-span-8">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Hình ảnh thiết kế cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Section One */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full"></span>
                    Phần 1 (3 ảnh bắt buộc)
                  </h4>
                  <div className="grid gap-4">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="space-y-3">
                        <div className="relative group">
                          <div
                            className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                              imagePreviews.sectionOne[index]
                                ? "border-primary bg-primary/10"
                                : formErrors.sectionOneImages[index]
                                ? "border-destructive bg-destructive/10"
                                : "border-border hover:border-primary hover:bg-primary/5"
                            }`}
                          >
                            {imagePreviews.sectionOne[index] ? (
                              <div className="relative">
                                <img
                                  src={imagePreviews.sectionOne[index]!}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-contain rounded-lg shadow-sm bg-muted"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() =>
                                    removeImage("sectionOne", index)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <div className="absolute bottom-2 left-2 right-2">
                                  <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded truncate">
                                    {formData.sectionOneAttachmentFiles[index]
                                      ?.name || `Ảnh ${index + 1}`}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="flex flex-col items-center justify-center h-32 cursor-pointer group-hover:scale-105 transition-transform"
                                onClick={() =>
                                  triggerFileInput("sectionOne", index)
                                }
                              >
                                <Upload className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                                  Chọn ảnh {index + 1}{" "}
                                  <span className="text-destructive">*</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PNG, JPG, JPEG
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description input below each image */}
                        <div>
                          <Label
                            htmlFor={`sectionOne-description-${index}`}
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Mô tả ảnh {index + 1}{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`sectionOne-description-${index}`}
                            value={formData.sectionOneDescriptions[index]}
                            onChange={(e) =>
                              handleDescriptionChange(
                                "sectionOne",
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Mô tả cho ảnh ${index + 1}...`}
                            className={`mt-1 text-sm ${
                              formErrors.sectionOneDescriptions[index]
                                ? "border-destructive focus:border-destructive bg-destructive/10"
                                : ""
                            }`}
                            disabled={!imagePreviews.sectionOne[index]}
                          />
                          {formErrors.sectionOneDescriptions[index] && (
                            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {formErrors.sectionOneDescriptions[index]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Two */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full"></span>
                    Phần 2 (3 ảnh bắt buộc)
                  </h4>
                  <div className="grid gap-4">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="space-y-3">
                        <div className="relative group">
                          <div
                            className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                              imagePreviews.sectionTwo[index]
                                ? "border-primary bg-primary/10"
                                : formErrors.sectionTwoImages[index]
                                ? "border-destructive bg-destructive/10"
                                : "border-border hover:border-primary hover:bg-primary/5"
                            }`}
                          >
                            {imagePreviews.sectionTwo[index] ? (
                              <div className="relative">
                                <img
                                  src={imagePreviews.sectionTwo[index]!}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-contain rounded-lg shadow-sm bg-muted"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() =>
                                    removeImage("sectionTwo", index)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <div className="absolute bottom-2 left-2 right-2">
                                  <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded truncate">
                                    {formData.sectionTwoAttachmentFiles[index]
                                      ?.name || `Ảnh ${index + 1}`}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="flex flex-col items-center justify-center h-32 cursor-pointer group-hover:scale-105 transition-transform"
                                onClick={() =>
                                  triggerFileInput("sectionTwo", index)
                                }
                              >
                                <Upload className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                                  Chọn ảnh {index + 1}{" "}
                                  <span className="text-destructive">*</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PNG, JPG, JPEG
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description input below each image */}
                        <div>
                          <Label
                            htmlFor={`sectionTwo-description-${index}`}
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Mô tả ảnh {index + 1}{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`sectionTwo-description-${index}`}
                            value={formData.sectionTwoDescriptions[index]}
                            onChange={(e) =>
                              handleDescriptionChange(
                                "sectionTwo",
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Mô tả cho ảnh ${index + 1}...`}
                            className={`mt-1 text-sm ${
                              formErrors.sectionTwoDescriptions[index]
                                ? "border-destructive focus:border-destructive bg-destructive/10"
                                : ""
                            }`}
                            disabled={!imagePreviews.sectionTwo[index]}
                          />
                          {formErrors.sectionTwoDescriptions[index] && (
                            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {formErrors.sectionTwoDescriptions[index]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t bg-muted/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Lưu ý:</span> Tất cả ảnh và mô tả là
            bắt buộc
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isFormComplete()}
              className={`px-8 transition-all duration-200 ${
                isFormComplete()
                  ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  {isFormComplete() ? (
                    <>Đăng thiết kế cá nhân</>
                  ) : (
                    "Đăng thiết kế cá nhân"
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
