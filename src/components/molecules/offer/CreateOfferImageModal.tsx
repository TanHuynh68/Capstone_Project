"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CanvasList from "@/pages/customer/plushdoll-design/get-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, ImageIcon, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateOfferImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (data: {
    imageUrl: string;
    title: string;
    id?: string;
    description?: string;
    isCanvas?: boolean;
  }) => void;
}

const CreateOfferImageModal: React.FC<CreateOfferImageModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCanvas, setSelectedCanvas] = useState<{
    desc: string;
    title: string;
    id: string;
    preview: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "canvas">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Xử lý upload file từ máy (chỉ 1 file)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Chỉ chấp nhận file ảnh JPG, JPEG hoặc PNG");
      return;
    }

    if (file.size > 1024 * 1024) {
      setUploadError("Kích thước file không được vượt quá 1MB");
      return;
    }

    setUploadedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setSelectedCanvas(null); // Reset canvas nếu chọn upload
  };

  // Khi chọn canvas (chỉ 1 canvas)
  const handleSelectCanvas = async (
    desc: string,
    title: string,
    id: string
  ) => {
    setIsProcessing(true);

    try {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 960;
      tempCanvas.height = 540;
      const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
        backgroundColor: "#fff",
      });

      const parsedDesc = JSON.parse(desc);
      parsedDesc.objects.forEach((obj: any) => {
        if (obj.type === "image") {
          obj.crossOrigin = "anonymous";
        }
      });

      await new Promise((resolve) => {
        fabricCanvas.loadFromJSON(
          parsedDesc,
          () => {
            setTimeout(() => {
              fabricCanvas.renderAll();
              resolve(null);
            }, 500);
          },
          (_: any, obj: fabric.Object) => {
            if (obj?.type === "image") {
              // @ts-expect-error: crossOrigin is not in fabric.Object typings
              obj.crossOrigin = "anonymous";
            }
          }
        );
      });

      const dataURL = fabricCanvas.toDataURL({ format: "png" });
      setPreview(dataURL);
      setSelectedCanvas({ desc, title, id, preview: dataURL });
      setUploadedFile(null); // Reset upload nếu chọn canvas
    } catch (error) {
      console.error("Lỗi khi xử lý canvas:", error);
      setUploadError("Không thể xử lý canvas này. Vui lòng thử canvas khác.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Xóa ảnh đã chọn
  const handleRemovePreview = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setUploadedFile(null);
    setSelectedCanvas(null);
  };

  // Khi xác nhận gửi
  const handleSend = async () => {
    if (!preview) return;

    setIsProcessing(true);
    try {
      let imageData: {
        imageUrl: string;
        title: string;
        id?: string;
        description?: string;
        isCanvas?: boolean;
      };

      if (uploadedFile) {
        // Xử lý file upload
        const reader = new FileReader();
        const imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Không thể đọc file"));
          reader.readAsDataURL(uploadedFile);
        });

        imageData = {
          imageUrl,
          title: uploadedFile.name,
          isCanvas: false,
        };
      } else if (selectedCanvas) {
        // Xử lý canvas
        imageData = {
          imageUrl: selectedCanvas.preview,
          title: selectedCanvas.title,
          id: selectedCanvas.id,
          description: selectedCanvas.desc,
          isCanvas: true,
        };
      } else {
        throw new Error("Không có ảnh được chọn");
      }

      onSelectImage(imageData);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Lỗi khi xử lý ảnh:", error);
      setUploadError("Có lỗi xảy ra khi xử lý hình ảnh. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const resetForm = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setSelectedCanvas(null);
    setUploadedFile(null);
    setUploadError(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            Chọn hình mẫu minh họa
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload từ máy hoặc chọn từ canvas có sẵn. Chỉ được chọn 1 ảnh.
          </DialogDescription>
        </DialogHeader>

        {/* Tab buttons */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          <Button
            variant={activeTab === "upload" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex-1",
              activeTab === "upload"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload từ máy
          </Button>
          <Button
            variant={activeTab === "canvas" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("canvas")}
            className={cn(
              "flex-1",
              activeTab === "canvas"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Palette className="h-4 w-4 mr-2" />
            Chọn từ Canvas
          </Button>
        </div>

        <div className="mt-4">
          {!preview ? (
            <div className="min-h-[200px]">
              {activeTab === "upload" ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Upload hình ảnh từ máy
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chọn 1 file JPG, JPEG hoặc PNG (≤1MB)
                  </p>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                    disabled={isProcessing}
                  />
                  {uploadError && (
                    <p className="text-xs text-destructive mt-2">
                      {uploadError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="min-h-[200px]">
                  {isProcessing ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Đang xử lý canvas...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <CanvasList onSelect={handleSelectCanvas} />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4 bg-card flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-64 h-64 object-contain rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center mb-4">
                <p className="text-sm font-medium text-foreground">
                  {uploadedFile
                    ? uploadedFile.name
                    : selectedCanvas?.title || "Ảnh đã chọn"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {uploadedFile ? "Từ máy tính" : "Từ Canvas"}
                </p>
              </div>

              <div className="flex gap-2 w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemovePreview}
                  className="border-border text-foreground hover:bg-muted hover:text-foreground bg-transparent"
                  disabled={isProcessing}
                >
                  Chọn lại
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Xác nhận
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferImageModal;
