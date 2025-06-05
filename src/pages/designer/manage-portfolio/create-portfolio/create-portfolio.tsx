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
import {
  PlusCircle,
  AlertCircle,
  UserCircle2,
  Briefcase,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import PortfolioService from "@/services/PortfolioService";
import SingleImageGallerySmall from "@/components/molecules/post/post-detail/SingleImageGallerySmall";

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
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  const resetForm = () => {
    setFormData(initialFormData);
    setError("");
    setFormErrors(initialFormErrors);
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

    // Validate only current field
    handleInputBlur(field, typeof index === "number" ? [value] : value, index);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    let hasError = false;

    // Validate all fields
    const errors = {
      yearOfExperience: validateField(
        "yearOfExperience",
        formData.yearOfExperience
      ) as string,
      content: validateField("content", formData.content) as string,
      expertIn: validateField("expertIn", formData.expertIn) as string,
      sectionOneDescriptions: validateField(
        "sectionOneDescriptions",
        formData.sectionOneDescriptions
      ) as string[],
      sectionTwoDescriptions: validateField(
        "sectionTwoDescriptions",
        formData.sectionTwoDescriptions
      ) as string[],
      sectionOneImages: validateField(
        "sectionOneImages",
        formData.sectionOneAttachmentFiles
      ) as string[],
      sectionTwoImages: validateField(
        "sectionTwoImages",
        formData.sectionTwoAttachmentFiles
      ) as string[],
    };

    // Check if any field has error
    hasError = Object.values(errors).some((error) =>
      Array.isArray(error) ? error.some((e) => e !== "") : error !== ""
    );

    setFormErrors(errors);
    if (hasError) {
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
      setFormData(initialFormData);
      setFormErrors(initialFormErrors);
      setIsOpen(false);

      // Show success message
      toast.success("Tạo dự án thành công!");

      // Call onSuccess callback
      onSuccess();
    } catch (err) {
      console.error("Error creating portfolio:", err);
      setError("Có lỗi xảy ra khi tạo dự án. Vui lòng thử lại sau.");
      toast.error("Có lỗi xảy ra khi tạo dự án");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileFocus = (
    field: "sectionOneImages" | "sectionTwoImages",
    idx: number
  ) => {
    handleFocus(field, idx);
  };

  const handleFileBlur = (
    field: "sectionOneImages" | "sectionTwoImages",
    idx: number
  ) => {
    const fileField =
      field === "sectionOneImages"
        ? "sectionOneAttachmentFiles"
        : "sectionTwoAttachmentFiles";

    // Always validate on blur
    const files = [...formData[fileField]];
    handleBlur(field, files, idx);
  };

  const handleFileChange = (
    fileField: "sectionOneAttachmentFiles" | "sectionTwoAttachmentFiles",
    idx: number,
    file: File | null
  ) => {
    if (file) {
      const validationError = validateImage(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }
    }

    setFormData((prev) => {
      const arr = [...prev[fileField]];
      arr[idx] = file as File;
      return { ...prev, [fileField]: arr };
    });

    // Always validate after change
    const newFiles = [...formData[fileField]];
    newFiles[idx] = file as File;
    const validationField =
      fileField === "sectionOneAttachmentFiles"
        ? "sectionOneImages"
        : "sectionTwoImages";
    handleBlur(validationField, newFiles, idx);
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
      <DialogContent className="w-full min-w-[1100px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6 bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            Đăng thiết kế cá nhân
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cột 1: Thông tin chung */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r text-center from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold text-primary mb-1">
                  Thiết kế cá nhân
                </h3>
                <p className="text-sm text-primary/80">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="w-4 h-4 text-primary" />
                    <Label
                      htmlFor="yearOfExperience"
                      className="text-sm font-medium text-foreground"
                    >
                      Kinh nghiệm
                    </Label>
                  </div>
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
                    className="bg-background"
                  />
                  {formErrors.yearOfExperience && (
                    <p className="text-destructive text-sm">
                      {formErrors.yearOfExperience}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <Label
                      htmlFor="content"
                      className="text-sm font-medium text-foreground"
                    >
                      Mô tả dự án
                    </Label>
                  </div>
                  <Input
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    onFocus={() => handleFocus("content")}
                    onBlur={(e) => handleInputBlur("content", e.target.value)}
                    placeholder="Ví dụ: Từng thiết kế hơn 10 sản phẩm,..."
                    className="bg-background"
                  />
                  {formErrors.content && (
                    <p className="text-destructive text-sm">
                      {formErrors.content}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <Label
                      htmlFor="expertIn"
                      className="text-sm font-medium text-foreground"
                    >
                      Kỹ năng chuyên môn
                    </Label>
                  </div>
                  <Input
                    id="expertIn"
                    value={formData.expertIn}
                    onChange={(e) =>
                      handleInputChange("expertIn", e.target.value)
                    }
                    onFocus={() => handleFocus("expertIn")}
                    onBlur={(e) => handleInputBlur("expertIn", e.target.value)}
                    placeholder="Ví dụ: Chuyên thiết kế nón, váy, phụ kiện,.."
                    className="bg-background"
                  />
                  {formErrors.expertIn && (
                    <p className="text-destructive text-sm">
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
                    <ul className="text-xs text-primary/80 space-y-1 list-disc list-inside">
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
            </div>

            {/* Cột 2 và 3: Phần 1, Phần 2 và nút submit */}
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Cột 2: Phần 1 */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-foreground">
                    Phần 1
                  </Label>
                  <div className="grid gap-4">
                    {formData.sectionOneAttachmentFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 p-3 border rounded-lg bg-card"
                      >
                        <div className="space-y-2">
                          <Input
                            type="file"
                            onChange={(e) =>
                              handleFileChange(
                                "sectionOneAttachmentFiles",
                                idx,
                                e.target.files?.[0] || null
                              )
                            }
                            onFocus={() =>
                              handleFileFocus("sectionOneImages", idx)
                            }
                            onBlur={() =>
                              handleFileBlur("sectionOneImages", idx)
                            }
                            accept=".jpg,.jpeg,.png"
                            className="bg-background"
                          />
                          {formErrors.sectionOneImages[idx] && (
                            <p className="text-destructive text-sm">
                              {formErrors.sectionOneImages[idx]}
                            </p>
                          )}
                        </div>
                        {file && (
                          <SingleImageGallerySmall
                            imageUrl={URL.createObjectURL(file)}
                            title={`Hình ảnh ${idx + 1} - Phần 1`}
                            alt={`Hình ảnh ${idx + 1} của phần 1`}
                            className="w-full"
                          />
                        )}
                        <div className="space-y-2">
                          <Input
                            placeholder={`Nhập mô tả cho hình ảnh ${idx + 1}`}
                            value={formData.sectionOneDescriptions[idx]}
                            onChange={(e) =>
                              handleInputChange(
                                "sectionOneDescriptions",
                                e.target.value,
                                idx
                              )
                            }
                            onFocus={() =>
                              handleFocus("sectionOneDescriptions", idx)
                            }
                            onBlur={(e) =>
                              handleInputBlur(
                                "sectionOneDescriptions",
                                e.target.value,
                                idx
                              )
                            }
                            className="bg-background"
                          />
                          {formErrors.sectionOneDescriptions[idx] && (
                            <p className="text-destructive text-sm">
                              {formErrors.sectionOneDescriptions[idx]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cột 3: Phần 2 */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-foreground">
                    Phần 2
                  </Label>
                  <div className="grid gap-4">
                    {formData.sectionTwoAttachmentFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 p-3 border rounded-lg bg-card"
                      >
                        <div className="space-y-2">
                          <Input
                            type="file"
                            onChange={(e) =>
                              handleFileChange(
                                "sectionTwoAttachmentFiles",
                                idx,
                                e.target.files?.[0] || null
                              )
                            }
                            onFocus={() =>
                              handleFileFocus("sectionTwoImages", idx)
                            }
                            onBlur={() =>
                              handleFileBlur("sectionTwoImages", idx)
                            }
                            accept=".jpg,.jpeg,.png"
                            className="bg-background"
                          />
                          {formErrors.sectionTwoImages[idx] && (
                            <p className="text-destructive text-sm">
                              {formErrors.sectionTwoImages[idx]}
                            </p>
                          )}
                        </div>
                        {file && (
                          <SingleImageGallerySmall
                            imageUrl={URL.createObjectURL(file)}
                            title={`Hình ảnh ${idx + 1} - Phần 2`}
                            alt={`Hình ảnh ${idx + 1} của phần 2`}
                            className="w-full"
                          />
                        )}
                        <div className="space-y-2">
                          <Input
                            placeholder={`Nhập mô tả cho hình ảnh ${idx + 1}`}
                            value={formData.sectionTwoDescriptions[idx]}
                            onChange={(e) =>
                              handleInputChange(
                                "sectionTwoDescriptions",
                                e.target.value,
                                idx
                              )
                            }
                            onFocus={() =>
                              handleFocus("sectionTwoDescriptions", idx)
                            }
                            onBlur={(e) =>
                              handleInputBlur(
                                "sectionTwoDescriptions",
                                e.target.value,
                                idx
                              )
                            }
                            className="bg-background"
                          />
                          {formErrors.sectionTwoDescriptions[idx] && (
                            <p className="text-destructive text-sm">
                              {formErrors.sectionTwoDescriptions[idx]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-destructive font-medium text-sm text-center">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-[150px]"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="w-[200px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đăng thiết kế cá nhân"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
