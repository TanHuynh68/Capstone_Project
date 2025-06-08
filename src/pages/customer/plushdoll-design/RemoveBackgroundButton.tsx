import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { fabric } from "fabric";
import { toast } from "sonner";
import ENV from "@/config/env";

interface RemoveBackgroundButtonProps {
  canvas: fabric.Canvas | null;
  onStateChange?: (isProcessing: boolean) => void;
  onSaveState?: () => void;
}

const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const RemoveBackgroundButton: React.FC<RemoveBackgroundButtonProps> = ({
  canvas,
  onStateChange,
  onSaveState,
}) => {
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const getImageFormat = (src: string): string => {
    const extension = src.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      default:
        return "image/png"; // Default to PNG
    }
  };

  const handleRemoveBackground = async () => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject || activeObject.type !== "image") {
      toast.error("Vui lòng chọn một hình ảnh");
      return;
    }

    const img = activeObject as fabric.Image;
    const imgSrc = img.getSrc();
    const format = getImageFormat(imgSrc);

    try {
      // Create a new image element to handle cross-origin
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";

      // Create a promise to handle image loading
      const loadImage = new Promise((resolve, reject) => {
        imgElement.onload = () => {
          // Check file size
          const canvas = document.createElement("canvas");
          canvas.width = imgElement.width;
          canvas.height = imgElement.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(imgElement, 0, 0);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Không thể tạo blob từ hình ảnh"));
              return;
            }

            if (blob.size > MAX_FILE_SIZE) {
              reject(new Error("Kích thước hình ảnh quá lớn (tối đa 10MB)"));
              return;
            }

            if (!SUPPORTED_FORMATS.includes(format)) {
              reject(
                new Error(
                  "Định dạng hình ảnh không được hỗ trợ (chỉ hỗ trợ PNG, JPEG, JPG)"
                )
              );
              return;
            }

            resolve(imgElement);
          }, format);
        };
        imgElement.onerror = () => reject(new Error("Không thể tải hình ảnh"));
        imgElement.src = imgSrc;
      });

      // Wait for the image to load
      await loadImage;

      // Create a temporary canvas to get the image data
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) throw new Error("Không thể tạo canvas context");

      tempCanvas.width = imgElement.width;
      tempCanvas.height = imgElement.height;
      tempCtx.drawImage(imgElement, 0, 0);

      const imgData = tempCanvas.toDataURL(format);

      setIsRemovingBg(true);
      onStateChange?.(true);

      // Convert base64 to blob
      const response = await fetch(imgData);
      const blob = await response.blob();

      // Create form data with proper file extension
      const formData = new FormData();
      const fileExtension = format === "image/png" ? "png" : "jpg";
      formData.append("image_file", blob, `image.${fileExtension}`);

      // Call remove.bg API
      const removeBgResponse = await fetch(
        "https://api.remove.bg/v1.0/removebg",
        {
          method: "POST",
          headers: {
            "X-Api-Key": ENV.VITE_REMOVE_BACKGROUND,
          },
          body: formData,
        }
      );

      if (!removeBgResponse.ok) {
        const errorData = await removeBgResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Không thể xóa nền");
      }

      const processedBlob = await removeBgResponse.blob();
      const processedUrl = URL.createObjectURL(processedBlob);

      // Replace the image on canvas
      fabric.Image.fromURL(
        processedUrl,
        (newImg) => {
          // Copy position and other properties
          newImg.set({
            left: img.left,
            top: img.top,
            angle: img.angle,
            selectable: true,
          });

          // Set same scaled size as original image
          newImg.scaleToWidth(img.getScaledWidth());
          newImg.scaleToHeight(img.getScaledHeight());

          // Replace image on canvas
          canvas?.remove(img);
          canvas?.add(newImg);
          canvas?.setActiveObject(newImg);
          canvas?.requestRenderAll();
          onSaveState?.();

          URL.revokeObjectURL(processedUrl);
          toast.success("Đã xóa nền thành công!");
        },
        { crossOrigin: "anonymous" }
      );
    } catch (error) {
      console.error("Error in remove background:", error);
      toast.error(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa nền"
      );
    } finally {
      setIsRemovingBg(false);
      onStateChange?.(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleRemoveBackground}
      disabled={isRemovingBg}
      className={isRemovingBg ? "opacity-50 cursor-not-allowed" : ""}
      title="Xóa nền (hỗ trợ PNG, JPEG, JPG)"
    >
      <Scissors className="w-4 h-4" />
    </Button>
  );
};

export default RemoveBackgroundButton;
