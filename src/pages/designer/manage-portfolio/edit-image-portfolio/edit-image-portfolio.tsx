import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortfolioService from "@/services/PortfolioService";
import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";
import { toast } from "sonner";

// Constants
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"] as const;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

// Types
interface EditImagePortfolioProps {
  imageId: string;
  currentTitle: string;
  currentImageUrl: string;
  onSuccess: () => void;
}

type FileValidationError = "NO_FILE" | "INVALID_TYPE" | "TOO_LARGE" | null;

export function EditImagePortfolio({
  imageId,
  currentTitle,
  currentImageUrl,
  onSuccess,
}: EditImagePortfolioProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Services
  const { editImagePortfolio } = PortfolioService();

  // Utility functions
  const validateFile = (file: File): FileValidationError => {
    if (!file) return "NO_FILE";
    if (
      !ALLOWED_FILE_TYPES.includes(
        file.type as (typeof ALLOWED_FILE_TYPES)[number]
      )
    )
      return "INVALID_TYPE";
    if (file.size > MAX_FILE_SIZE) return "TOO_LARGE";
    return null;
  };

  const getErrorMessage = (error: FileValidationError): string => {
    switch (error) {
      // case "NO_FILE":
      //   return "Vui lòng chọn file hình ảnh";
      case "INVALID_TYPE":
        return "Chỉ chấp nhận file PNG, JPEG hoặc JPG";
      case "TOO_LARGE":
        return "Kích thước file không được vượt quá 1MB";
      default:
        return "";
    }
  };

  const resetForm = () => {
    setTitle(currentTitle);
    setFile(null);
    setPreviewUrl(currentImageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cleanupPreviewUrl = () => {
    if (previewUrl && previewUrl !== currentImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Event handlers
  const handleOpenDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    cleanupPreviewUrl();
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    // if (!selectedFile) {
    //   toast.error(getErrorMessage("NO_FILE"));
    //   e.target.value = "";
    //   return;
    // }

    const validationError = selectedFile ? validateFile(selectedFile) : null;
    if (validationError) {
      toast.error(getErrorMessage(validationError));
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    const url = selectedFile ? URL.createObjectURL(selectedFile) : null;
    setPreviewUrl(url);
  };

  const handleEdit = async () => {
    try {
      // Validate form
      if (!title.trim()) {
        toast.error("Vui lòng nhập mô tả hình ảnh");
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("portfolioImageID", imageId);
      formData.append("imageDescription", title.trim());

      if (file) {
        formData.append("attachmentFile", file);
      }


      const res = await editImagePortfolio(formData);
      if (res?.statusCode === 200) {
        toast.success("Hình ảnh đã được cập nhật thành công");
        onSuccess();
        handleClose();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hình ảnh portfolio:", error);
      toast.error("Không thể cập nhật hình ảnh. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render
  return (
    <>
      <button
        onClick={handleOpenDialog}
        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100"
        aria-label="Chỉnh sửa hình ảnh"
      >
        <Pencil className="w-4 h-4 text-gray-700" />
      </button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby="edit-image-description"
        >
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
          </DialogHeader>

          <div id="edit-image-description" className="sr-only">
            Form chỉnh sửa hình ảnh portfolio. Cho phép thay đổi hình ảnh và mô
            tả. Chỉ chấp nhận file PNG, JPEG hoặc JPG, tối đa 1MB.
          </div>

          <div className="grid gap-4 py-4">
            <input type="hidden" name="portfolioImageID" value={imageId} />

            {/* File Input */}
            <div className="grid gap-2">
              <Label htmlFor="attachmentFile">
                Ảnh <span className="text-red-500">*</span>
              </Label>
              <Input
                ref={fileInputRef}
                id="attachmentFile"
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={handleFileChange}
                required
              />
              <p className="text-xs text-gray-500">
                Chỉ chấp nhận file PNG, JPEG hoặc JPG, tối đa 1MB.
              </p>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-2">
                <SingleImageGallery
                  imageUrl={previewUrl}
                  title=""
                  className="w-full"
                />
              </div>
            )}

            {/* Title Input */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Mô tả hình ảnh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập mô tả hình ảnh"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
