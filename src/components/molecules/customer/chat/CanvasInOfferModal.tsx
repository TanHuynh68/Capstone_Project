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
import { Upload, Loader2, Image, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasInOfferModalProps {
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

const CanvasInOfferModal: React.FC<CanvasInOfferModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    desc: string;
    title: string;
    id: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "canvas">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Xử lý upload file từ máy
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      // Kiểm tra loại file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Chỉ chấp nhận file ảnh có định dạng JPG, JPEG hoặc PNG");
        setUploadedFile(null);
        setPreview(null);
        return;
      }

      // Kiểm tra kích thước file (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setUploadError("Kích thước file không được vượt quá 1MB");
        setUploadedFile(null);
        setPreview(null);
        return;
      }

      setUploadedFile(file);
      // Tạo preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setSelected(null); // Reset canvas selection
    }
  };

  // Khi chọn canvas, render preview PNG
  const handleSelectCanvas = async (desc: string, title: string, id: string) => {
    console.log(desc, "desc");
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 960;
    tempCanvas.height = 540;
    const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
      backgroundColor: "#fff",
    });

    // Sửa crossOrigin trong JSON
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
      setPreview(dataURL);
      setSelected({ desc, title, id });
      setUploadedFile(null); // Reset file upload
    } catch (error) {
      console.error("Tainted canvas, không thể xuất PNG", error);
      alert("Canvas chứa ảnh không hỗ trợ CORS, không thể preview.");
    }
  };

  // Khi xác nhận gửi
  const handleSend = async () => {
    if (!preview) return;
    
    setIsUploading(true);
    try {
      let imageUrl: string;
      let title: string;
      let id: string | undefined;
      let description: string | undefined;
      let isCanvas: boolean = false;

      if (selected) {
        // Nếu chọn từ canvas
        const blob = await (await fetch(preview)).blob();
        const file = new File([blob], "canvas.png", { type: "image/png" });
        
        // Convert to base64 for now (you can modify this to upload to cloudinary if needed)
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        title = selected.title;
        id = selected.id;
        description = selected.desc;
        isCanvas = true;
      } else if (uploadedFile) {
        // Nếu upload từ máy
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(uploadedFile);
        });
        
        title = uploadedFile.name;
        isCanvas = false;
      } else {
        throw new Error("Không có hình ảnh nào được chọn");
      }

      onSelectImage({
        imageUrl,
        title,
        id,
        description,
        isCanvas,
      });
      
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
    setPreview(null);
    setSelected(null);
    setUploadedFile(null);
    setUploadError(null);
    setIsUploading(false);
  };

  // Khi đóng modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (preview && !selected) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, selected]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Image className="h-5 w-5 text-blue-500" />
            Chọn hình mẫu minh họa
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload hình từ máy hoặc chọn từ canvas có sẵn.
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
            // Tab content khi chưa có preview
            <div className="min-h-[200px]">
              {activeTab === "upload" ? (
                // Tab upload từ máy
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Upload hình ảnh từ máy
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chọn file JPG, JPEG hoặc PNG (tối đa 1MB)
                  </p>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  {uploadError && (
                    <p className="text-xs text-destructive mt-2">{uploadError}</p>
                  )}
                </div>
              ) : (
                // Tab chọn từ canvas
                <div className="min-h-[200px]">
                  <CanvasList onSelect={handleSelectCanvas} />
                </div>
              )}
            </div>
          ) : (
            // Preview và nút xác nhận
            <div className="border border-border rounded-lg p-4 bg-card flex flex-col items-center">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-[200px] h-auto object-contain rounded-lg mb-4"
              />
              
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {selected ? "Canvas đã chọn:" : "Hình ảnh đã upload:"}
                </p>
                <p className="text-sm font-medium text-foreground break-words">
                  {selected ? selected.title : uploadedFile?.name}
                </p>
              </div>

              <div className="flex gap-2 w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPreview(null);
                    setSelected(null);
                    setUploadedFile(null);
                    setUploadError(null);
                  }}
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
