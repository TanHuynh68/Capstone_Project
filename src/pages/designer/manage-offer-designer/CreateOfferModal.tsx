import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  post: Post;
}

export default function CreateOfferModal({
  open,
  onClose,
  onSubmit,
  post,
}: CreateOfferModalProps) {
  const [initPrice, setInitPrice] = useState("");
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = useSelector((state: RootState) => state.user.role);

  const resetForm = () => {
    setInitPrice("");
    setNote("");
    setDeadline("");
    setImage(null);
    setPriceError(null);
    setImageError(null);
    setIsSubmitting(false);
  };

  // Set giá trị mặc định cho input giá đề xuất khi mở modal hoặc đổi post
  useEffect(() => {
    if (open && post) {
      setInitPrice((post.itemValue + 1000).toString());
      setPriceError(null);
    }
  }, [open, post]);

  // Xử lý thay đổi giá đề xuất và báo lỗi ngay khi nhập sai
  const handleInitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInitPrice(value);
    const numberValue = parseFloat(value);
    if (!value || isNaN(numberValue) || numberValue <= post.itemValue) {
      setPriceError("Giá đề xuất phải lớn hơn giá trị sản phẩm.");
    } else {
      setPriceError(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (file) {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Chỉ chấp nhận file ảnh có định dạng JPG, JPEG hoặc PNG");
        setImage(null);
        return;
      }

      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setImageError("Kích thước file không được vượt quá 1MB");
        setImage(null);
        return;
      }

      setImage(file);
    }
  };

  const handleSubmit = () => {
    const initPriceNumber = parseFloat(initPrice);

    if (!initPrice || !note || !deadline || !image) {
      setPriceError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (imageError) {
      return;
    }

    if (initPriceNumber <= post.itemValue) {
      setPriceError("Giá đề xuất phải lớn hơn giá trị sản phẩm.");
      return;
    }

    const formData = new FormData();
    formData.append("InitPrice", initPrice);
    formData.append("Note", note);
    formData.append("DeadlineEndAt", new Date(deadline).toISOString());
    formData.append("SampleImage", image);
    setPriceError(null);
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
            <DialogTitle className="text-xl">Tạo offer mới</DialogTitle>
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
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm space-y-3 p-4 bg-white/50 rounded-lg border border-gray-100">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-gray-700">
                  Thông tin offer
                </h3>
                <p className="text-base text-gray-500 mt-1">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </p>
              </div>

              {/* Giá đề xuất */}
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Giá đề xuất
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Nhập giá đề xuất"
                    value={initPrice}
                    onChange={handleInitPriceChange}
                    min={post.itemValue + 1}
                    step="1000"
                    required
                    className="pr-20 h-9 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    đ
                  </div>
                </div>
                {priceError && (
                  <p className="text-xs text-red-600 mt-1">{priceError}</p>
                )}
              </div>

              {/* Ghi chú */}
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Ghi chú
                </Label>
                <Input
                  type="text"
                  placeholder="Ví dụ: Tôi có thể làm thiết kế này..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                  className="h-9 text-sm"
                />
              </div>

              {/* Deadline */}
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Thời hạn hoàn thành
                </Label>
                <div className="relative flex justify-center">
                  <Input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                    className="w-56 h-10 text-sm pr-10 mx-auto"
                  />
                </div>
              </div>

              {/* Hình ảnh mẫu */}
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Hình mẫu minh hoạ
                </Label>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageChange}
                  required
                  className="h-9 text-sm file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {imageError && (
                  <p className="text-xs text-red-600 mt-1">{imageError}</p>
                )}
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-9 mt-2 text-sm font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Gửi offer"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
