import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import OfferService from "@/services/OfferService";
import { toast } from "sonner";

interface OfferEditImageProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  offerId: string;
  currentImageUrl?: string;
  onSuccess?: () => void;
}

export function OfferEditImage({
  open,
  onOpenChange,
  offerId,
  onSuccess,
}: OfferEditImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { editOfferImage } = OfferService();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG");
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 1MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh để tải lên");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("OfferID", offerId);
      formData.append("AttachmentFile", selectedFile);

      const response = await editOfferImage(formData);

      if (response) {
        toast.success("Cập nhật ảnh thành công");
        onSuccess?.();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating offer image:", error);
      toast.error("Cập nhật ảnh thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Cập nhật ảnh đề xuất
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tải lên ảnh mới cho đề xuất của bạn. Hỗ trợ định dạng JPG, JPEG,
            PNG. Kích thước tối đa 1MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Image Upload Area */}
          <div className="space-y-2">
            <Label>Ảnh đề xuất</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center",
                "hover:border-primary/50 transition-colors",
                "relative min-h-[200px] flex flex-col items-center justify-center"
              )}
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[300px] mx-auto object-contain rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Kéo thả ảnh vào đây hoặc click để chọn
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Chọn ảnh
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className="bg-primary text-white"
            >
              {isLoading ? "Đang tải lên..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
