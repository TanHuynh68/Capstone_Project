"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, X, Eye, CalendarIcon, Edit, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import PostService from "@/services/PostService";
import {
  type CreatePostFormValues,
  createPostSchema,
} from "@/schemas/postSchema";
import type { UpdatePostFormValues } from "@/schemas/updatePostSchema";

interface CreatePostDialogProps {
  onPostCreated?: () => void;
  fetchPosts?: any;
  // Update mode props
  isUpdateMode?: boolean;
  updateData?: UpdatePostFormValues;
  projectPostId?: string;
  children?: React.ReactNode;
}

export default function CreateUpdatePostDialog({
  onPostCreated,
  fetchPosts,
  isUpdateMode = false,
  updateData,
  projectPostId,
  children,
}: CreatePostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [requestedFiles, setRequestedFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { createPost, updatePost } = PostService();

  // File constraints
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const MAX_FILES = 3;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
  const MIN_DIMENSIONS = { width: 100, height: 100 };

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      Title: "",
      Description: "",
      ItemValue: 1000,
      SuggestedPrice: 1000,
      FinishDate: undefined,
      OriginalAttachmentFiles: [],
      RequestedAttachmentFiles: [],
      Length: 1,
      Width: 1,
      Height: 1,
      Weight: 1,
    },
  });

  // Populate form with update data
  useEffect(() => {
    if (isUpdateMode && updateData) {
      form.setValue("Title", updateData.title || "");
      form.setValue("Description", updateData.description || "");
      form.setValue("ItemValue", updateData.itemValue || 1000);
      form.setValue("SuggestedPrice", updateData.suggestedPrice || 1000);
      form.setValue("Length", Number(updateData.length) || 1);
      form.setValue("Width", Number(updateData.width) || 1);
      form.setValue("Height", Number(updateData.height) || 1);
      form.setValue("Weight", Number(updateData.weight) || 1);

      // Convert finishDate string to Date object
      if (updateData.finishDate) {
        const finishDate = new Date(updateData.finishDate);
        form.setValue("FinishDate", finishDate);
      }
    }
  }, [isUpdateMode, updateData, form]);

  // Enhanced file validation functions
  const validateFileFormat = (file: File): boolean => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    return (
      ALLOWED_TYPES.includes(file.type) &&
      ALLOWED_EXTENSIONS.includes(fileExtension)
    );
  };

  const validateFileSize = (file: File): boolean => {
    return file.size <= MAX_FILE_SIZE && file.size > 0;
  };

  const validateImageDimensions = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(
          img.width >= MIN_DIMENSIONS.width &&
            img.height >= MIN_DIMENSIONS.height
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
  };

  const handleFileUpload = async (
    files: FileList | null,
    type: "original" | "requested"
  ) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const currentFiles = type === "original" ? originalFiles : requestedFiles;

    // Check file limit
    if (currentFiles.length + fileArray.length > MAX_FILES) {
      toast.error(`Chỉ được tải lên tối đa ${MAX_FILES} ảnh cho mỗi loại`);
      return;
    }

    // Pre-filter files by format and size
    const validFiles: File[] = [];
    const invalidFiles: { file: File; reason: string }[] = [];

    for (const file of fileArray) {
      if (!validateFileFormat(file)) {
        invalidFiles.push({
          file,
          reason: `Định dạng không hợp lệ (${file.name
            .split(".")
            .pop()
            ?.toUpperCase()})`,
        });
        continue;
      }

      if (!validateFileSize(file)) {
        invalidFiles.push({
          file,
          reason: `Kích thước ${formatFileSize(file.size)} > 1MB`,
        });
        continue;
      }

      validFiles.push(file);
    }

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles
        .map((item) => `${item.file.name}: ${item.reason}`)
        .join("\n");
      toast.error(`Một số file không hợp lệ:\n${errorMessages}`, {
        duration: 5000,
      });
    }

    if (validFiles.length === 0) {
      return;
    }

    // Validate image dimensions for valid files
    try {
      const dimensionValidationPromises = validFiles.map(async (file) => {
        const isValidDimensions = await validateImageDimensions(file);
        return { file, isValid: isValidDimensions };
      });

      const dimensionResults = await Promise.all(dimensionValidationPromises);
      const finalValidFiles = dimensionResults
        .filter((result) => result.isValid)
        .map((result) => result.file);
      const invalidDimensionFiles = dimensionResults
        .filter((result) => !result.isValid)
        .map((result) => result.file);

      if (invalidDimensionFiles.length > 0) {
        const invalidNames = invalidDimensionFiles
          .map((file) => file.name)
          .join(", ");
        toast.error(
          `Ảnh có kích thước quá nhỏ: ${invalidNames}\nKích thước tối thiểu: ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}px`
        );
      }

      if (finalValidFiles.length === 0) {
        return;
      }

      // Add valid files
      if (type === "original") {
        const newFiles = [...originalFiles, ...finalValidFiles].slice(
          0,
          MAX_FILES
        );
        setOriginalFiles(newFiles);
        form.setValue("OriginalAttachmentFiles", newFiles);
      } else {
        const newFiles = [...requestedFiles, ...finalValidFiles].slice(
          0,
          MAX_FILES
        );
        setRequestedFiles(newFiles);
        form.setValue("RequestedAttachmentFiles", newFiles);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý ảnh");
      console.error("Error validating images:", error);
    }
  };

  const removeFile = (index: number, type: "original" | "requested") => {
    if (type === "original") {
      const newFiles = originalFiles.filter((_, i) => i !== index);
      setOriginalFiles(newFiles);
      form.setValue("OriginalAttachmentFiles", newFiles);
    } else {
      const newFiles = requestedFiles.filter((_, i) => i !== index);
      setRequestedFiles(newFiles);
      form.setValue("RequestedAttachmentFiles", newFiles);
    }
  };

  const previewFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  const onSubmit = async (data: CreatePostFormValues) => {
    setIsSubmitting(true);
    try {
      let response;

      if (isUpdateMode && projectPostId) {
        // Update mode - use new uploaded files
        const updatePayload = {
          projectPostId,
          title: data.Title,
          description: data.Description,
          itemValue: data.ItemValue,
          finishDate: data.FinishDate.toISOString(),
          suggestedPrice: data.SuggestedPrice,
          originalAttachmentFiles: originalFiles,
          requestedAttachmentFiles: requestedFiles,
          length: data.Length,
          width: data.Width,
          height: data.Height,
          weight: data.Weight,
        };
        response = await updatePost(updatePayload);
        if (response) {
          toast.success("Cập nhật bài đăng thành công!");
        }
      } else {
        // Create mode
        response = await createPost(data);
        if (response) {
          toast.success("Tạo bài đăng thành công!");
        }
      }

      if (response) {
        setIsOpen(false);
        form.reset();
        setOriginalFiles([]);
        setRequestedFiles([]);
        onPostCreated?.();
        if (fetchPosts) {
          await fetchPosts();
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadSection = ({
    title,
    files,
    type,
    required = false,
  }: {
    title: string;
    files: File[];
    type: "original" | "requested";
    required?: boolean;
  }) => (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {title}{" "}
        {(required || isUpdateMode) && <span className="text-red-500">*</span>}
      </Label>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={(e) => handleFileUpload(e.target.files, type)}
          className="hidden"
          id={`${type}-upload`}
        />
        <label
          htmlFor={`${type}-upload`}
          className="flex flex-col items-center justify-center cursor-pointer group"
        >
          <div className="p-4 rounded-full bg-blue-50  transition-colors mb-3">
            <ImageIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Đã chọn {files.length}/{MAX_FILES} ảnh
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => previewFile(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFile(index, type)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="absolute bottom-1 left-1 right-1">
                  <div className=" bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center justify-between">
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="ml-1 text-green-300">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const onClose = () => {
    setIsOpen(!isOpen);
    setOriginalFiles([]);
    setRequestedFiles([]);
    if (!isUpdateMode) {
      form.reset();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger>
          {children || (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isUpdateMode ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Cập nhật bài đăng
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bài đăng
                </>
              )}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="min-w-[850px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isUpdateMode ? "Cập nhật bài đăng" : "Tạo bài đăng mới"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tiêu đề <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tiêu đề bài đăng" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="Description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mô tả <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập mô tả chi tiết"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ItemValue & SuggestedPrice */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ItemValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Giá trị sản phẩm
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step={1000} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="SuggestedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Ngân sách <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step={1000} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* FinishDate */}
                <FormField
                  control={form.control}
                  name="FinishDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Ngày hoàn thành <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", {
                                  locale: vi,
                                })
                              ) : (
                                <span>Chọn ngày hoàn thành</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                            locale={vi}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional Dimensions */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Kích thước</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="Length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chiều dài (cm)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="Width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chiều rộng (cm)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="Height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chiều cao (cm)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="Weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cân nặng (gram)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* File Uploads */}
                <FileUploadSection
                  title="Ảnh gốc sản phẩm"
                  files={originalFiles}
                  type="original"
                  required={!isUpdateMode}
                />

                <FileUploadSection
                  title="Ảnh yêu cầu"
                  files={requestedFiles}
                  type="requested"
                  required={!isUpdateMode}
                />

                {/* Submit Button */}
                <div className="flex justify-end items-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? isUpdateMode
                        ? "Đang cập nhật..."
                        : "Đang tạo..."
                      : isUpdateMode
                      ? "Cập nhật bài đăng"
                      : "Tạo bài đăng"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      {previewImage && (
        <Dialog
          open={!!previewImage}
          onOpenChange={() => setPreviewImage(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Xem trước ảnh</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
