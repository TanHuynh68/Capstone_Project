import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SingleImageGallerySmall from "@/components/molecules/post/post-detail/SingleImageGallerySmall";

interface UploadDeliveryImageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File, description: string) => void;
}

const UploadDeliveryImageDialog: React.FC<UploadDeliveryImageDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError("");
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(f);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh!");
      return;
    }
    if (!description.trim()) {
      setError("Vui lòng nhập mô tả!");
      return;
    }
    setIsUploading(true);
    await onSubmit(file, description);
    setIsUploading(false);
    setFile(null);
    setPreviewUrl("");
    setDescription("");
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold mb-2">
            Tải ảnh minh chứng
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-foreground"
              htmlFor="upload-image"
            >
              Ảnh minh chứng <span className="text-red-500">*</span>
            </label>
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted"
            />
            {previewUrl && (
              <div className="flex justify-center mt-2">
                <SingleImageGallerySmall imageUrl={previewUrl} title="" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-foreground"
              htmlFor="upload-desc"
            >
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              id="upload-desc"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted resize-none"
              placeholder="Nhập mô tả cho ảnh minh chứng..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <DialogFooter className="flex flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full font-bold"
              disabled={!file || isUploading}
            >
              {isUploading ? "Đang tải lên..." : "Tải lên"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDeliveryImageDialog;
