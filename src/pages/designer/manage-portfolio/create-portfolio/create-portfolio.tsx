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
import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";

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
    field: string,
    value: string | string[] | (File | undefined)[]
  ): string | string[] => {
    if (Array.isArray(value)) {
      if (field.includes("Images")) {
        return value.map((v) => (!v ? "Vui lòng chọn ảnh" : ""));
      }
      return value.map((v) => (!v ? "Vui lòng nhập mô tả" : ""));
    }

    switch (field) {
      case "yearOfExperience":
        return !value ? "Vui lòng nhập  kinh nghiệm" : "";
      case "content":
        return !value ? "Vui lòng nhập mô tả dự án" : "";
      case "expertIn":
        return !value ? "Vui lòng nhập kỹ năng chuyên môn" : "";
      default:
        return "";
    }
  };

  const handleBlur = (
    field: string,
    value: string | string[] | (File | undefined)[]
  ) => {
    const error = validateField(field, value);
    setFormErrors((prev) => {
      if (Array.isArray(error)) {
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

    const errors = {
      yearOfExperience: "",
      content: "",
      expertIn: "",
      sectionOneDescriptions: ["", "", ""],
      sectionTwoDescriptions: ["", "", ""],
      sectionOneImages: ["", "", ""],
      sectionTwoImages: ["", "", ""],
    };

    if (!formData.yearOfExperience) {
      errors.yearOfExperience = "Vui lòng nhập kinh nghiệm";
      hasError = true;
    }

    if (!formData.content) {
      errors.content = "Vui lòng nhập mô tả dự án";
      hasError = true;
    }

    if (!formData.expertIn) {
      errors.expertIn = "Vui lòng nhập kỹ năng chuyên môn";
      hasError = true;
    }

    formData.sectionOneDescriptions.forEach((desc, i) => {
      if (!desc) {
        errors.sectionOneDescriptions[i] = "Vui lòng nhập mô tả";
        hasError = true;
      }
    });

    formData.sectionTwoDescriptions.forEach((desc, i) => {
      if (!desc) {
        errors.sectionTwoDescriptions[i] = "Vui lòng nhập mô tả";
        hasError = true;
      }
    });

    // Validate each image input individually
    formData.sectionOneAttachmentFiles.forEach((file, index) => {
      if (!file) {
        errors.sectionOneImages[index] = "Vui lòng chọn ảnh";
        hasError = true;
      }
    });

    formData.sectionTwoAttachmentFiles.forEach((file, index) => {
      if (!file) {
        errors.sectionTwoImages[index] = "Vui lòng chọn ảnh";
        hasError = true;
      }
    });

    setFormErrors(errors);
    if (hasError) return;

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

  const handleFileChange = (
    field: "sectionOneAttachmentFiles" | "sectionTwoAttachmentFiles",
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
      const arr = [...prev[field]];
      arr[idx] = file as File;
      return { ...prev, [field]: arr };
    });

    // Update image validation errors
    const newFiles = [...formData[field]];
    newFiles[idx] = file as File;
    handleBlur(field, newFiles);
  };

  const handleFileBlur = (
    field: "sectionOneAttachmentFiles" | "sectionTwoAttachmentFiles"
  ) => {
    handleBlur(field, formData[field]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="col-span-full w-full max-w-[450px] min-w-[300px] mx-auto mb-2 h-[400px] flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <PlusCircle className="w-12 h-12 text-gray-400" />
            <span className="text-lg text-gray-500">Tạo dự án mới</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-full min-w-[1100px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tạo dự án mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cột 1: Thông tin chung */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r text-center from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  Thông tin dự án
                </h3>
                <p className="text-sm text-blue-700">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="w-4 h-4 text-blue-600" />
                    <Label
                      htmlFor="yearOfExperience"
                      className="text-sm font-medium text-gray-700"
                    >
                     kinh nghiệm
                    </Label>
                  </div>
                  <Input
                    id="yearOfExperience"
                    value={formData.yearOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearOfExperience: e.target.value,
                      })
                    }
                    onFocus={() => handleFocus("yearOfExperience")}
                    onBlur={(e) =>
                      handleBlur("yearOfExperience", e.target.value)
                    }
                    placeholder="Ví dụ: 3 năm"
                    className="bg-gray-50"
                  />
                  {formErrors.yearOfExperience && (
                    <p className="text-red-500 text-sm">
                      {formErrors.yearOfExperience}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <Label
                      htmlFor="content"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mô tả dự án
                    </Label>
                  </div>
                  <Input
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    onFocus={() => handleFocus("content")}
                    onBlur={(e) => handleBlur("content", e.target.value)}
                    placeholder="Ví dụ: Từng thiết kế hơn 10 sản phẩm,..."
                    className="bg-gray-50"
                  />
                  {formErrors.content && (
                    <p className="text-red-500 text-sm">{formErrors.content}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <Label
                      htmlFor="expertIn"
                      className="text-sm font-medium text-gray-700"
                    >
                      Kỹ năng chuyên môn
                    </Label>
                  </div>
                  <Input
                    id="expertIn"
                    value={formData.expertIn}
                    onChange={(e) =>
                      setFormData({ ...formData, expertIn: e.target.value })
                    }
                    onFocus={() => handleFocus("expertIn")}
                    onBlur={(e) => handleBlur("expertIn", e.target.value)}
                    placeholder="Ví dụ: Chuyên thiết kế nón, váy, phụ kiện,.."
                    className="bg-gray-50"
                  />
                  {formErrors.expertIn && (
                    <p className="text-red-500 text-sm">
                      {formErrors.expertIn}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-blue-900">
                      Lưu ý khi tải ảnh lên
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
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

            {/* Cột 2: Phần 1 */}
            <div className="col-span-1 space-y-2">
              <Label className="text-base font-semibold">Phần 1</Label>
              <div className="grid gap-4">
                {formData.sectionOneAttachmentFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50"
                  >
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          "sectionOneAttachmentFiles",
                          idx,
                          e.target.files?.[0] || null
                        )
                      }
                      onFocus={() => handleFocus("sectionOneImages", idx)}
                      onBlur={() => handleFileBlur("sectionOneAttachmentFiles")}
                      accept=".jpg,.jpeg,.png"
                    />
                    {file && (
                      <SingleImageGallery
                        imageUrl={URL.createObjectURL(file)}
                        title={`Hình ảnh ${idx + 1} - Phần 1`}
                        alt={`Hình ảnh ${idx + 1} của phần 1`}
                        className="w-full"
                      />
                    )}
                    <Input
                      placeholder={`Nhập mô tả cho hình ảnh ${idx + 1}`}
                      value={formData.sectionOneDescriptions[idx]}
                      onChange={(e) => {
                        const newDesc = [...formData.sectionOneDescriptions];
                        newDesc[idx] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          sectionOneDescriptions: newDesc,
                        }));
                      }}
                      onFocus={() => handleFocus("sectionOneDescriptions", idx)}
                      onBlur={(e) => {
                        const newDesc = [...formData.sectionOneDescriptions];
                        newDesc[idx] = e.target.value;
                        handleBlur("sectionOneDescriptions", newDesc);
                      }}
                    />
                    {formErrors.sectionOneDescriptions[idx] && (
                      <p className="text-red-500 text-sm">
                        {formErrors.sectionOneDescriptions[idx]}
                      </p>
                    )}
                    {formErrors.sectionOneImages[idx] && (
                      <p className="text-red-500 text-sm">
                        {formErrors.sectionOneImages[idx]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cột 3: Phần 2 */}
            <div className="col-span-1 space-y-2">
              <Label className="text-base font-semibold">Phần 2</Label>
              <div className="grid gap-4">
                {formData.sectionTwoAttachmentFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50"
                  >
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          "sectionTwoAttachmentFiles",
                          idx,
                          e.target.files?.[0] || null
                        )
                      }
                      onFocus={() => handleFocus("sectionTwoImages", idx)}
                      onBlur={() => handleFileBlur("sectionTwoAttachmentFiles")}
                      accept=".jpg,.jpeg,.png"
                    />
                    {file && (
                      <SingleImageGallery
                        imageUrl={URL.createObjectURL(file)}
                        title={`Hình ảnh ${idx + 1} - Phần 2`}
                        alt={`Hình ảnh ${idx + 1} của phần 2`}
                        className="w-full"
                      />
                    )}
                    <Input
                      placeholder={`Nhập mô tả cho hình ảnh ${idx + 1}`}
                      value={formData.sectionTwoDescriptions[idx]}
                      onChange={(e) => {
                        const newDesc = [...formData.sectionTwoDescriptions];
                        newDesc[idx] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          sectionTwoDescriptions: newDesc,
                        }));
                      }}
                      onFocus={() => handleFocus("sectionTwoDescriptions", idx)}
                      onBlur={(e) => {
                        const newDesc = [...formData.sectionTwoDescriptions];
                        newDesc[idx] = e.target.value;
                        handleBlur("sectionTwoDescriptions", newDesc);
                      }}
                    />
                    {formErrors.sectionTwoDescriptions[idx] && (
                      <p className="text-red-500 text-sm">
                        {formErrors.sectionTwoDescriptions[idx]}
                      </p>
                    )}
                    {formErrors.sectionTwoImages[idx] && (
                      <p className="text-red-500 text-sm">
                        {formErrors.sectionTwoImages[idx]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 font-medium text-sm text-center">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Tạo  dự án"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
