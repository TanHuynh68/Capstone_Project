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
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SingleImageGallerySmall from "@/components/molecules/post/post-detail/SingleImageGallerySmall";
import CreateOfferImageModal from "@/components/molecules/offer/CreateOfferImageModal";

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
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const role = useSelector((state: RootState) => state.user.role);

  const formSchema = z.object({
    initPrice: z
      .string()
      .refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 1000,
        "Giá đề xuất phải lớn hơn hoặc bằng 1000"
      ),
    note: z.string().min(1, "Vui lòng nhập ghi chú"),
    deadline: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initPrice: "",
      note: "",
      deadline: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const resetForm = () => {
    form.reset({
      initPrice: "",
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
      form.setValue("initPrice", "");
    }
  }, [open, post, form]);

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = (values: FormValues) => {
    if (isCalendarOpen) {
      // Nếu đang mở popover, không cho submit
      return;
    }

    setImageError(null);
    if (!image) {
      setImageError("Vui lòng chọn hình ảnh mẫu");
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

  // Xử lý khi chọn hình ảnh từ CanvasInOfferModal
  const handleImageSelect = (data: {
    imageUrl: string;
    title: string;
    id?: string;
    description?: string;
    isCanvas?: boolean;
  }) => {
    // Nếu là canvas, convert base64 thành File
    if (data.isCanvas) {
      // Convert base64 to File
      const byteString = atob(data.imageUrl.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new File([ab], `${data.title}.png`, { type: "image/png" });
      setImage(file);
      setImagePreview(data.imageUrl);
    } else {
      // Nếu là file upload, sử dụng trực tiếp
      setImagePreview(data.imageUrl);
      // Tạo File object từ base64 nếu cần
      const byteString = atob(data.imageUrl.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new File([ab], data.title, { type: "image/png" });
      setImage(file);
    }
    setImageError(null);
    setIsCanvasModalOpen(false);
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
      <DialogContent className="max-w-none min-w-[1000px] bg-card text-card-foreground border-border">
        <DialogHeader className="pb-2">
          {role === "Designer" && (
            <DialogTitle className="text-xl text-foreground">
              Tạo đề xuất mới
            </DialogTitle>
          )}
        </DialogHeader>

        <div className="grid grid-cols-[1.5fr_1fr] gap-8 items-center">
          {/* Cột trái - Thông tin bài post */}
          <div className="border rounded-md bg-muted/50 border-border p-4 max-h-[70vh] overflow-y-auto">
            {/* Header với avatar và thông tin cơ bản */}
            <div className="flex items-start gap-3 mb-3">
              {post.avatar && (
                <img
                  src={post.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground line-clamp-1 mb-1">
                  {post.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {post.fullName}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Mô tả và hình ảnh */}
            <div className="space-y-3">
              {post.description && (
                <div className="bg-card/50 rounded-md px-3 py-2 border border-border">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground font-medium">
                      Mô tả sản phẩm
                    </span>
                    <p className="w-full text-sm text-foreground leading-relaxed whitespace-normal break-normal">
                      {post.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="">
                <div className="grid grid-cols-2 gap-4">
                  {/* Cột thông tin giá */}
                  <div className="space-y-2">
                    <div className="bg-card/50 rounded-md px-3 py-2 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Giá trị sản phẩm
                        </span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {post.itemValue.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="bg-card/50 rounded-md px-3 py-2 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Giá đề xuất
                        </span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
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
                    <div className="bg-card/50 rounded-md px-3 py-2 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Thời hạn hoàn thành
                        </span>
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
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
                    <div className="bg-card/50 rounded-md px-3 py-2 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Trạng thái
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            post.postStatus === 1
                              ? "text-green-600 dark:text-green-400"
                              : post.postStatus === 2
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-muted-foreground"
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
            <div className="w-full max-w-sm space-y-3 p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-foreground">
                  Thông tin đề xuất
                </h3>
                <p className="text-base text-muted-foreground mt-1">
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
                        <FormLabel className="text-foreground">
                          Giá đề xuất
                        </FormLabel>
                        <div className="relative w-full flex items-center gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Nhập giá đề xuất"
                              {...field}
                              min={1000}
                              className="w-full h-9 text-sm bg-background border-border text-foreground placeholder:text-muted-foreground"
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
                        <FormLabel className="text-foreground">
                          Ghi chú
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Ví dụ: Tôi có thể làm thiết kế này..."
                            {...field}
                            className="w-full h-9 text-sm bg-background border-border text-foreground placeholder:text-muted-foreground"
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
                        <FormLabel className="text-foreground">
                          Thời hạn hoàn thành
                        </FormLabel>
                        <Popover
                          open={isCalendarOpen}
                          onOpenChange={setIsCalendarOpen}
                        >
                          <PopoverTrigger>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Chọn thời hạn</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-muted-foreground" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-popover border-border text-popover-foreground"
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
                              className="bg-popover text-popover-foreground"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hình ảnh mẫu */}
                  <div className="w-full space-y-3">
                    <FormLabel className="text-foreground">
                      Hình mẫu minh hoạ
                    </FormLabel>
                    <div className="space-y-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCanvasModalOpen(true)}
                        className="w-full h-9 text-sm bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        Chọn hình mẫu minh họa
                      </Button>
                      {imageError && (
                        <p className="text-xs text-destructive">{imageError}</p>
                      )}
                      {imagePreview && (
                        <SingleImageGallerySmall
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
                    className="w-full h-9 mt-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!form.watch("deadline") || isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Gửi đề xuất"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* CanvasInOfferModal */}
      <CreateOfferImageModal
        isOpen={isCanvasModalOpen}
        onClose={() => setIsCanvasModalOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </Dialog>
  );
}
