import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Player } from "@lottiefiles/react-lottie-player";
import ImageUploadWithDescriptions, {
  MediaUploadData,
} from "@/components/molecules/getdelivery/ImageUploadWithDescriptions";

interface UploadDeliveryImageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    files: File[],
    descriptions: string[],
    isConfirm: boolean
  ) => Promise<{ statusCode: number }>;
}

const UploadDeliveryImageDialog: React.FC<UploadDeliveryImageDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [images, setImages] = useState<MediaUploadData[]>([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const lottieRef = useRef<Player>(null);

  useEffect(() => {
    if (lottieRef.current) {
      if (isConfirm) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
        lottieRef.current.setSeeker(0, false);
      }
    }
  }, [isConfirm]);

  const handleImagesChange = (newImages: MediaUploadData[]) => {
    setImages(newImages);
  };

  const validateForm = (): boolean => {
    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh hoặc video", {
        description: "Ảnh/video minh chứng là bắt buộc",
      });
      return false;
    }

    const hasEmptyDescription = images.some((img) => !img.description.trim());
    if (hasEmptyDescription) {
      toast.error("Vui lòng nhập mô tả cho tất cả ảnh/video", {
        description: "Mô tả ảnh/video là bắt buộc",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Trigger validation khi nhấn submit
    setShowValidation(true);

    if (!validateForm()) {
      return;
    }

    // Hiển thị confirm dialog trước khi submit
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async (isConfirm: boolean) => {
    setShowConfirmDialog(false);
    setIsConfirm(isConfirm); // Update isConfirm state
    setIsUploading(true);
    try {
      const files = images.map((img) => img.file);
      const descriptions = images.map((img) => img.description);

      const result = await onSubmit(files, descriptions, isConfirm);
      if (result?.statusCode === 200) {
        toast.success("Tải minh chứng giao hàng thành công!");
        handleClose();
      }
    } catch (error) {
      console.error("Error uploading delivery images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setImages([]);
    setIsConfirm(false);
    setShowValidation(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="min-w-[1000px] max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-0">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Upload className="h-6 w-6 text-primary" />
              Tải lên minh chứng giao hàng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2 pt-0">
            {/* Images Upload */}
            <ImageUploadWithDescriptions
              title=""
              subtitle="Tải lên minh chứng giao hàng (tối thiểu 1 ảnh, tối đa 3 ảnh; chỉ PNG/JPEG/JPG, ≤ 1MB mỗi ảnh)"
              maxFiles={3}
              minFiles={1}
              required={true}
              onImagesChange={handleImagesChange}
              disabled={isUploading}
              showValidation={showValidation}
              validationErrors={
                showValidation
                  ? images.map((img, index) =>
                      !img.description.trim()
                        ? `Vui lòng nhập mô tả cho ${
                            img.type === "video" ? "video" : "ảnh"
                          } ${index + 1}`
                        : ""
                    )
                  : []
              }
            />

            {/* Confirmation Checkbox and Submit Button */}
            <div className="flex items-center justify-end pt-4 border-t">
              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={
                  isUploading ||
                  images.length < 1 ||
                  !images.every((img) => img.description.trim() !== "")
                }
                className={`min-w-[120px] transition-all duration-200 ${
                  isUploading ||
                  images.length < 1 ||
                  !images.every((img) => img.description.trim() !== "")
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  `Tải lên minh chứng (${images.length} file)`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Xác nhận tải lên minh chứng
            </AlertDialogTitle>
            <AlertDialogDescription>
              Người gửi đã gửi đúng hàng chưa?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                handleConfirmSubmit(false);
              }}
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Không - Gửi sai hàng
            </Button>
            <Button
              onClick={() => {
                setShowConfirmDialog(false);
                handleConfirmSubmit(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Có - Gửi đúng hàng
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UploadDeliveryImageDialog;
