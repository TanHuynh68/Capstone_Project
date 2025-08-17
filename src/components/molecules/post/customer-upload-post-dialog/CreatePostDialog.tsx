"use client";

import { useState } from "react";
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
import { Plus, Upload, X, Eye, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import PostService from "@/services/PostService";
import {
  type CreatePostFormValues,
  createPostSchema,
} from "@/schemas/postSchema";

interface CreatePostDialogProps {
  onPostCreated?: () => void;
  fetchPosts: any;
}

export default function CreatePostDialog({
  onPostCreated,
  fetchPosts,
}: CreatePostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [requestedFiles, setRequestedFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { createPost } = PostService();

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

  const handleFileUpload = (
    files: FileList | null,
    type: "original" | "requested"
  ) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    if (type === "original") {
      const newFiles = [...originalFiles, ...imageFiles].slice(0, 3);
      setOriginalFiles(newFiles);
      form.setValue("OriginalAttachmentFiles", newFiles);
    } else {
      const newFiles = [...requestedFiles, ...imageFiles].slice(0, 3);
      setRequestedFiles(newFiles);
      form.setValue("RequestedAttachmentFiles", newFiles);
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
      const response = await createPost(data);

      if (response) {
        toast.success("Tạo bài đăng thành công!");
        setIsOpen(false);
        form.reset();
        setOriginalFiles([]);
        setRequestedFiles([]);
        onPostCreated?.();
        await fetchPosts();
      }
    } catch (error) {
      console.error("Error creating post:", error);
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
        {title} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files, type)}
          className="hidden"
          id={`${type}-upload`}
          
        />
        <label
          htmlFor={`${type}-upload`}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            Nhấn để chọn ảnh (tối đa 3 ảnh)
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center">
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
    </div>
  );

  const onClose = ()=>{
    setIsOpen(!isOpen)
    setOriginalFiles([])
    setRequestedFiles([])
    form.reset()
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Tạo bài đăng
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo bài đăng mới</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        Giá trị sản phẩm<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step={1000}
                          defaultValue={1000}
                        />
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
                        Giá đề xuất <span className="text-red-500">*</span>
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
                              format(field.value, "dd/MM/yyyy", { locale: vi })
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

              {/* File Uploads */}
              <FileUploadSection
                title="Ảnh gốc sản phẩm"
                files={originalFiles}
                type="original"
                required
              />

              <FileUploadSection
                title="Ảnh yêu cầu"
                files={requestedFiles}
                type="requested"
                required
              />

              {/* Optional Dimensions */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Kích thước
                </Label>
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

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang tạo..." : "Tạo bài đăng"}
                </Button>
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
    </>
  );
}
