import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SingleImageGallerySmall from "@/components/molecules/post/post-detail/SingleImageGallerySmall";

interface UploadDeliveryImageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (files: File[], descriptions: string[], isConfirm: boolean) => void;
}

const MAX_FILES = 3;

const UploadDeliveryImageDialog: React.FC<UploadDeliveryImageDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [files, setFiles] = useState<(File | undefined)[]>([undefined]);
  const [previews, setPreviews] = useState<string[]>([""]);
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [errors, setErrors] = useState<string[]>([""]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (idx: number, file: File | null) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    if (file) {
      newFiles[idx] = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviews[idx] = ev.target?.result as string;
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    } else {
      newFiles[idx] = undefined;
      newPreviews[idx] = "";
      setPreviews([...newPreviews]);
    }
    setFiles(newFiles);
    setErrors((prev) => {
      const arr = [...prev];
      arr[idx] = "";
      return arr;
    });
  };

  const handleDescriptionChange = (idx: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[idx] = value;
    setDescriptions(newDescriptions);
    setErrors((prev) => {
      const arr = [...prev];
      arr[idx] = "";
      return arr;
    });
  };

  const handleRemove = (idx: number) => {
    if (files.length === 1) {
      // Nếu chỉ còn 1 ô thì reset về rỗng
      setFiles([undefined]);
      setPreviews([""]);
      setDescriptions([""]);
      setErrors([""]);
      return;
    }
    setFiles(files.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
    setDescriptions(descriptions.filter((_, i) => i !== idx));
    setErrors(errors.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    if (files.length < MAX_FILES) {
      setFiles([...files, undefined]);
      setPreviews([...previews, ""]);
      setDescriptions([...descriptions, ""]);
      setErrors([...errors, ""]);
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = files.map((file, i) => {
      if (!file) {
        valid = false;
        return "Vui lòng chọn ảnh!";
      } else if (!descriptions[i]?.trim()) {
        valid = false;
        return "Vui lòng nhập mô tả!";
      }
      return "";
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsUploading(true);
    await onSubmit(files as File[], descriptions, isConfirm);
    setIsUploading(false);
    setFiles([undefined]);
    setPreviews([""]);
    setDescriptions([""]);
    setErrors([""]);
    setIsConfirm(false);
  };

  const handleClose = () => {
    setFiles([undefined]);
    setPreviews([""]);
    setDescriptions([""]);
    setErrors([""]);
    setIsConfirm(false);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] rounded-2xl p-6 border border-border bg-background">
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
            <label className="block text-sm font-medium text-foreground">
              Ảnh minh chứng <span className="text-red-500">*</span> (Tối thiểu
              1 ảnh, tối đa 3 ảnh)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {files.map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 p-3 border rounded-lg bg-card w-full min-h-[300px] items-center"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(idx, e.target.files?.[0] || null)
                    }
                    className="w-full cursor-pointer border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted"
                  />

                  {previews[idx] && (
                    <div className="relative mx-auto my-2 justify-center items-center p-2">
                      <SingleImageGallerySmall
                        imageUrl={previews[idx]}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg justify-center items-center"
                      />
                      <button
                        type="button"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-red-100 rounded-full p-1 shadow cursor-pointer"
                        onClick={() => handleRemove(idx)}
                        tabIndex={-1}
                        aria-label="Xóa ảnh"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}

                  <textarea
                    className="w-full border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted resize-none"
                    placeholder="Nhập mô tả cho ảnh này..."
                    value={descriptions[idx]}
                    onChange={(e) =>
                      handleDescriptionChange(idx, e.target.value)
                    }
                    rows={2}
                  />
                  {errors[idx] && (
                    <div className="text-red-500 text-xs text-center w-full">
                      {errors[idx]}
                    </div>
                  )}
                </div>
              ))}
              {files.length < MAX_FILES && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex flex-col cursor-pointer items-center justify-center border-2 border-dashed border-primary rounded-lg min-h-[300px] w-full text-primary hover:bg-primary/10 transition-colors"
                  style={{ fontSize: 48, fontWeight: "bold" }}
                  aria-label="Thêm ảnh"
                >
                  +<span className="text-base font-medium mt-2">Thêm ảnh</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <input
              id="is-confirm"
              type="checkbox"
              checked={isConfirm}
              onChange={(e) => setIsConfirm(e.target.checked)}
              className="accent-primary cursor-pointer"
            />
            <label
              htmlFor="is-confirm"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Xác nhận đã nhận hàng
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <DialogFooter className="flex flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full font-bold cursor-pointer"
              disabled={isUploading}
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
