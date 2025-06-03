import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery";
import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  post: Post;
}

// Update formatDate to only show date
const formatDate = (date: string) => {
  return format(new Date(date), "PPP", { locale: vi });
};

export default function CreateOfferModal({
  open,
  onClose,
  onSubmit,
  post,
}: CreateOfferModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const role = useSelector((state: RootState) => state.user.role);

  const formSchema = z.object({
    initPrice: z
      .string()
      .refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 1000,
        "Giá đề xuất phải là số hợp lệ và lớn hơn hoặc bằng 1000"
      ),
    note: z.string().min(1, "Vui lòng nhập ghi chú"),
    deadline: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initPrice: "1000",
      note: "",
      deadline: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const resetForm = () => {
    form.reset({
      initPrice: "1000",
      note: "",
      deadline: "",
    });
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageError(null);
    setIsSubmitting(false);
  };

  // Set giá trị mặc định cho input giá đề xuất khi mở modal hoặc đổi post
  useEffect(() => {
    if (open && post) {
      form.setValue("initPrice", "1000");
    }
  }, [open, post, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (file) {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Chỉ chấp nhận file ảnh có định dạng JPG, JPEG hoặc PNG");
        setImage(null);
        setImagePreview(null);
        return;
      }

      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setImageError("Kích thước file không được vượt quá 1MB");
        setImage(null);
        setImagePreview(null);
        return;
      }

      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = (values: FormValues) => {
    if (!image) {
      setImageError("Vui lòng chọn hình ảnh mẫu");
      return;
    }

    if (imageError) {
      return;
    }

    if (!values.deadline) {
      form.setError("deadline", { message: "Vui lòng chọn thời hạn" });
      return;
    }

    const formData = new FormData();
    formData.append("InitPrice", values.initPrice);
    formData.append("Note", values.note);

    try {
      const deadlineDate = new Date(values.deadline);
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid date");
      }
      formData.append("DeadlineEndAt", deadlineDate.toISOString());
    } catch (error) {
      console.error("Invalid deadline date:", error);
      return;
    }

    formData.append("SampleImage", image);
    setIsSubmitting(true);
    onSubmit(formData);
    resetForm();
    onClose();
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  if (role !== "Designer") return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-none min-w-[1000px]">
        <DialogHeader className="pb-2">
          {role === "Designer" && (
            <DialogTitle className="text-xl">Tạo đề xuất mới</DialogTitle>
          )}
        </DialogHeader>

        <div className="grid grid-cols-[1.5fr_1fr] gap-8 items-center">
          {/* Cột trái - Thông tin bài post */}
          <div className="border rounded-md bg-gray-50/80 p-4 max-h-[70vh] overflow-y-auto">
            {/* Header với avatar và thông tin cơ bản */}
            <div className="flex items-start gap-3 mb-3">
              {post.avatar && (
                <img
                  src={post.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
                  {post.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">
                    {post.fullName}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Mô tả và hình ảnh */}
            <div className="space-y-3">
              {post.description && (
                <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Mô tả sản phẩm
                    </span>
                    <span className="text-sm text-gray-600 font-semibold  border-gray-100">
                      {post.description}
                    </span>
                  </div>
                </div>
              )}

              <div className="">
                <div className="grid grid-cols-2 gap-4">
                  {/* Cột thông tin giá */}
                  <div className="space-y-2">
                    <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Giá trị sản phẩm
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {post.itemValue.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Giá đề xuất
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {post.suggestedPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cột thông tin thời hạn */}
                  <div className="space-y-2">
                    <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Thời hạn hoàn thành
                        </span>
                        <span className="text-sm font-semibold text-amber-600">
                          {post.finishDate
                            ? new Date(post.finishDate).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "Chưa có"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Trạng thái
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            post.postStatus === 1
                              ? "text-green-600"
                              : post.postStatus === 2
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {post.postStatus === 1
                            ? "Đang hoạt động"
                            : post.postStatus === 2
                            ? "Đang thực hiện"
                            : "Đã đóng"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              {(post.originalImages?.length > 0 ||
                post.requestedImages?.length > 0) && (
                <div className="relative w-full">
                  {post.originalImages?.length > 0 && (
                    <ImageGallery
                      images={post.originalImages}
                      title="Hình ảnh gốc"
                      className="mt-2"
                    />
                  )}
                  {post.requestedImages?.length > 0 && (
                    <ImageGallery
                      images={post.requestedImages}
                      title="Hình ảnh yêu cầu"
                      className="mt-2"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Thông tin giá và thời hạn */}
          </div>

          {/* Cột phải - Form nhập thông tin */}
          <div className="flex flex-col items-center max-h-[70vh] overflow-y-auto">
            <div className="w-full max-w-sm space-y-3 p-4 bg-white/50 rounded-lg border border-gray-100">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-gray-700">
                  Thông tin đề xuất
                </h3>
                <p className="text-base text-gray-500 mt-1">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-3"
                >
                  {/* Giá đề xuất */}
                  <FormField
                    control={form.control}
                    name="initPrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Giá đề xuất</FormLabel>
                        <div className="relative w-full flex items-center gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Nhập giá đề xuất"
                              {...field}
                              min={1000}
                              step="1000"
                              className="w-full h-9 text-sm "
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ghi chú */}
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Ví dụ: Tôi có thể làm thiết kế này..."
                            {...field}
                            className="w-full h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deadline */}
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời hạn hoàn thành</FormLabel>
                        <Popover
                          open={isCalendarOpen}
                          onOpenChange={setIsCalendarOpen}
                        >
                          <PopoverTrigger>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-white",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Chọn thời hạn</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0"
                            align="center"
                            side="top"
                            sideOffset={5}
                          >
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  date.setHours(23, 59, 59, 999);
                                  field.onChange(date.toISOString());
                                  setIsCalendarOpen(false);
                                }
                              }}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const finishDate = post.finishDate
                                  ? new Date(post.finishDate)
                                  : null;
                                if (finishDate) {
                                  finishDate.setHours(23, 59, 59, 999);
                                  return date < today || date > finishDate;
                                }
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

                  {/* Hình ảnh mẫu */}
                  <div className="w-full space-y-3">
                    <FormLabel>Hình mẫu minh hoạ</FormLabel>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                        className="w-full h-9 text-sm file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                      {imageError && (
                        <p className="text-xs text-red-600">{imageError}</p>
                      )}
                      {imagePreview && (
                        <SingleImageGallery
                          imageUrl={imagePreview}
                          title="Hình mẫu đã chọn"
                          className="mt-2"
                          alt="Hình mẫu minh hoạ"
                        />
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full h-9 mt-2 text-sm font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Gửi đề xuất"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
