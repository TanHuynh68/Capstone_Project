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
import { Plus, X, Eye, CalendarIcon, Edit, Palette } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import PostService from "@/services/PostService";
import {
  type CreatePostFormValues,
  createPostSchema,
} from "@/schemas/postSchema";
import { UpdatePostFormValues } from "@/schemas/updatePostSchema";
import CanvasInOfferModal from "@/components/molecules/customer/chat/CanvasInOfferModal";

interface CreatePostDialogProps {
  onPostCreated?: () => void;
  fetchPosts?: () => Promise<void>;
  // Update mode props
  isUpdateMode?: boolean;
  updateData?: UpdatePostFormValues & {
    originalAttachmentFiles?: (File | string)[];
    requestedAttachmentFiles?: (File | string)[];
  };
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
  const [isImageSelectorModalOpen, setIsImageSelectorModalOpen] = useState(false);
  const [imageSelectorType, setImageSelectorType] = useState<"original" | "requested">("original");
  console.log('updateData; ', updateData)
  const { createPost, updatePost } = PostService();

  // Xử lý khi chọn hình ảnh từ Image Selector Modal (CanvasInOfferModal)
  const handleImageSelect = (data: {
    imageUrl: string;
    title: string;
    id?: string;
    description?: string;
    isCanvas?: boolean;
  }) => {
    // Convert base64 thành File (cả canvas và upload từ máy đều trả về base64)
    const byteString = atob(data.imageUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Tạo file với tên phù hợp
    const fileName = data.isCanvas ? `${data.title}.png` : data.title;
    const file = new File([ab], fileName, { type: "image/png" });

    // Thêm vào danh sách tương ứng
    if (imageSelectorType === "original") {
      const newFiles = [...originalFiles, file].slice(0, 3);
      setOriginalFiles(newFiles);
      form.setValue("OriginalAttachmentFiles", newFiles);
    } else {
      const newFiles = [...requestedFiles, file].slice(0, 3);
      setRequestedFiles(newFiles);
      form.setValue("RequestedAttachmentFiles", newFiles);
    }

    setIsImageSelectorModalOpen(false);
  };

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
  console.log('updateData: ', updateData)
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

    // 🟢 Map hình ảnh từ API sang form field
    // if (updateData.originalImages) {
    //   const originalUrls = updateData.originalImages.map((img: any) => img.imageUrl);
    //   form.setValue("OriginalAttachmentFiles", originalUrls);
    // }

    // if (updateData.requestedImages) {
    //   const requestedUrls = updateData.requestedImages.map((img: any) => img.imageUrl);
    //   form.setValue("RequestedAttachmentFiles", requestedUrls);
    // }
  }
}, [isUpdateMode, updateData, form]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);




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
        // Update mode
        const updatePayload = {
          projectPostId,
          title: data.Title,
          description: data.Description,
          itemValue: data.ItemValue,
          finishDate: data.FinishDate.toISOString(),
          suggestedPrice: data.SuggestedPrice,
          originalAttachmentFiles: updateData?.originalAttachmentFiles || [],
          requestedAttachmentFiles: updateData?.requestedAttachmentFiles || [],
          length: data.Length,
          width: data.Width,
          height: data.Height,
          weight: data.Weight,
        };
        response = await updatePost(updatePayload);
        toast.success("Cập nhật bài đăng thành công!");
      } else {
        // Create mode
        response = await createPost(data);
        if (response?.statusCode === 200) {
          toast.success("Tạo bài đăng thành công!");
        }
      }

      if (response) {
        setIsOpen(false);
        form.reset();
        setOriginalFiles([]);
        setRequestedFiles([]);
        setIsImageSelectorModalOpen(false);
        onPostCreated?.();
        if (fetchPosts) {
          await fetchPosts();
        }
      }
    } catch (error) {
      toast.error(
        isUpdateMode
          ? "Có lỗi xảy ra khi cập nhật bài đăng"
          : "Có lỗi xảy ra khi tạo bài đăng"
      );
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
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        {title}{" "}
        {required && !isUpdateMode && <span className="text-red-500">*</span>}
      </Label>

      {/* Nút chọn ảnh đẹp với gradient và shadow */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r  rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setImageSelectorType(type);
            setIsImageSelectorModalOpen(true);
          }}
          className="relative w-full h-20 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-center space-x-4">
              {/* Icon với background đẹp */}
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                <Palette className="h-6 w-6 text-white" />
              </div>

              {/* Text content */}
              <div className="text-left">
                <div className="text-lg font-semibold text-gray-800">
                  {isUpdateMode
                    ? "Thay đổi ảnh"
                    : "Chọn ảnh"}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Từ máy hoặc Canvas • Tối đa 3 ảnh
                </div>
              </div>

              {/* Arrow icon */}
              <div className="ml-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-contain rounded border"
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => previewFile(file)}
                    className="h-6 w-6 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFile(index, type)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show existing images for update mode */}
      {isUpdateMode && (
        <div className="space-y-2">
          {type === "original" &&
            updateData?.originalAttachmentFiles &&
            updateData.originalAttachmentFiles.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Ảnh gốc hiện tại:</p>
                <div className="grid grid-cols-3 gap-2">
                  {updateData.originalAttachmentFiles.map(
                    (imageUrl, index) => (
                      <img
                        key={index}
                        src={typeof imageUrl === 'string' ? imageUrl : URL.createObjectURL(imageUrl) || "/placeholder.svg"}
                        alt={`Current original ${index + 1}`}
                        className="w-full h-20 object-contain rounded border"
                      />
                    )
                  )}
                </div>
              </div>
            )}
          {type === "requested" &&
            updateData?.requestedAttachmentFiles &&
            updateData.requestedAttachmentFiles.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Ảnh yêu cầu hiện tại:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {updateData.requestedAttachmentFiles.map(
                    (imageUrl, index) => (
                      <img
                        key={index}
                        src={typeof imageUrl === 'string' ? imageUrl : URL.createObjectURL(imageUrl) || "/placeholder.svg"}
                        alt={`Current requested ${index + 1}`}
                        className="w-full h-20 object-contain rounded border"
                      />
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );

  const onClose = () => {
    setIsOpen(!isOpen);
    setOriginalFiles([]);
    setRequestedFiles([]);
    setIsImageSelectorModalOpen(false);
    setPreviewImage(null);
    if (!isUpdateMode) {
      form.reset();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
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
        <DialogContent className="min-w-[850px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isUpdateMode ? "Cập nhật bài đăng" : "Tạo bài đăng mới"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4"
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Xem trước ảnh</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Selector Modal (CanvasInOfferModal) */}
      <CanvasInOfferModal
        isOpen={isImageSelectorModalOpen}
        onClose={() => setIsImageSelectorModalOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </>
  );
}
