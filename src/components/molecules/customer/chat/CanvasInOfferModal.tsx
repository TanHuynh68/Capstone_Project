import React, { useState } from "react";
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
import { Upload, Loader2, Image, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasInOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSelectImage: (data: {
  //   images: {
  //     imageUrl: string;
  //     title: string;
  //     id?: string;
  //     description?: string;
  //     isCanvas?: boolean;
  //   }[];
  // }) => void;
  onSelectImage: any;
}

const CanvasInOfferModal: React.FC<CanvasInOfferModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedCanvases, setSelectedCanvases] = useState<
    { desc: string; title: string; id: string; preview: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "canvas">("upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Xử lý upload file từ máy (tối đa 3 file)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setUploadError(null);

    if (files.length + uploadedFiles.length > 3) {
      setUploadError("Chỉ được upload tối đa 3 file");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Chỉ chấp nhận file ảnh JPG, JPEG hoặc PNG");
        continue;
      }

      if (file.size > 1024 * 1024) {
        setUploadError("Kích thước file không được vượt quá 1MB");
        continue;
      }

      validFiles.push(file);
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push(previewUrl);
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setSelectedCanvases([]); // Reset canvas nếu chọn upload
  };

  // Khi chọn canvas (vẫn chỉ cho 1 canvas/lần chọn, nhưng có thể chọn nhiều lần tối đa 3)
  const handleSelectCanvas = async (desc: string, title: string, id: string) => {
    if (selectedCanvases.length + uploadedFiles.length >= 3) {
      alert("Chỉ được chọn tối đa 3 hình ảnh");
      return;
    }

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
        function (_: any, obj: fabric.Object) {
          if (obj?.type === "image") {
            // @ts-expect-error: crossOrigin is not in fabric.Object typings
            obj.crossOrigin = "anonymous";
          }
        }
      );
    });

    try {
      const dataURL = fabricCanvas.toDataURL({ format: "png" });
      setPreviews((prev) => [...prev, dataURL]);
      setSelectedCanvases((prev) => [...prev, { desc, title, id, preview: dataURL }]);
    } catch (error) {
      console.error("Tainted canvas, không thể xuất PNG", error);
      alert("Canvas chứa ảnh không hỗ trợ CORS, không thể preview.");
    }
  };

  // Xóa 1 ảnh trong preview
  const handleRemovePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (index < uploadedFiles.length) {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSelectedCanvases((prev) => prev.filter((_, i) => i !== index - uploadedFiles.length));
    }
  };

  // Khi xác nhận gửi
  const handleSend = async () => {
    if (previews.length === 0) return;

    setIsUploading(true);
    try {
      const images: {
        imageUrl: string;
        title: string;
        id?: string;
        description?: string;
        isCanvas?: boolean;
      }[] = [];

      // Xử lý file upload
      for (const file of uploadedFiles) {
        const reader = new FileReader();
        const imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        images.push({
          imageUrl,
          title: file.name,
          isCanvas: false,
        });
      }

      // Xử lý canvas
      for (const canvas of selectedCanvases) {
        const blob = await (await fetch(canvas.preview)).blob();
        const file = new File([blob], "canvas.png", { type: "image/png" });

        const reader = new FileReader();
        const imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        images.push({
          imageUrl,
          title: canvas.title,
          id: canvas.id,
          description: canvas.desc,
          isCanvas: true,
        });
      }

      onSelectImage({ images });
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi xử lý hình ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setPreviews([]);
    setSelectedCanvases([]);
    setUploadedFiles([]);
    setUploadError(null);
    setIsUploading(false);
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
            <Image className="h-5 w-5 text-blue-500" />
            Chọn hình mẫu minh họa (tối đa 3)
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload từ máy hoặc chọn từ canvas có sẵn.
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
          {previews.length === 0 ? (
            <div className="min-h-[200px]">
              {activeTab === "upload" ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Upload hình ảnh từ máy
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chọn tối đa 3 file JPG, JPEG hoặc PNG (≤1MB)
                  </p>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  {uploadError && (
                    <p className="text-xs text-destructive mt-2">{uploadError}</p>
                  )}
                </div>
              ) : (
                <div className="min-h-[200px]">
                  <CanvasList onSelect={handleSelectCanvas} />
                </div>
              )}
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4 bg-card flex flex-col items-center">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-contain rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-border text-foreground hover:bg-muted hover:text-foreground"
                  disabled={isUploading}
                >
                  Huỷ
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
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

export default CanvasInOfferModal;
