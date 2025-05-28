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

const RemoveBackgroundButton: React.FC<RemoveBackgroundButtonProps> = ({
  canvas,
  onStateChange,
  onSaveState,
}) => {
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const handleRemoveBackground = async () => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject || activeObject.type !== "image") {
      toast.error("Vui lòng chọn một hình ảnh");
      return;
    }

    const img = activeObject as fabric.Image;
    const imgData = img.toDataURL({ format: "png" });

    setIsRemovingBg(true);
    onStateChange?.(true);

    try {
      // Convert base64 to blob
      const response = await fetch(imgData);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("image_file", blob, "image.png");

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
        throw new Error("Failed to remove background");
      }

      const processedBlob = await removeBgResponse.blob();
      const processedUrl = URL.createObjectURL(processedBlob);

      // Replace the image on canvas
      fabric.Image.fromURL(processedUrl, (newImg) => {
        // Copy properties from old image
        newImg.set({
          left: img.left,
          top: img.top,
          scaleX: img.scaleX,
          scaleY: img.scaleY,
          angle: img.angle,
          selectable: true,
        });

        // Remove old image and add new one
        canvas?.remove(img);
        canvas?.add(newImg);
        canvas?.setActiveObject(newImg);
        canvas?.requestRenderAll();
        onSaveState?.();

        // Clean up
        toast.success("Đã xóa nền thành công!");
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa nền");
      toast.error(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa nền"
      );
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
      title="Xóa nền"
    >
      <Scissors className="w-4 h-4" />
    </Button>
  );
};

export default RemoveBackgroundButton;
