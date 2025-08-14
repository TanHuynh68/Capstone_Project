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

      // Convert blob to base64 data URL to avoid blob URL issues
      const reader = new FileReader();
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          console.log('Converted blob to data URL, length:', result.length);
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
      });
      reader.readAsDataURL(processedBlob);

      const processedDataUrl = await dataUrlPromise;

      // Replace the image on canvas with proper error handling
      fabric.Image.fromURL(
        processedDataUrl,
        (newImg) => {
          if (!newImg || !canvas) {
            toast.error("Không thể tải hình ảnh đã xóa nền");
            return;
          }

          try {
            // Wait for the image to be fully loaded before proceeding
            const waitForImageLoad = new Promise<void>((resolve) => {
              const imgElement = newImg.getElement() as HTMLImageElement;
              if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
                resolve();
              } else if (imgElement) {
                imgElement.onload = () => resolve();
                imgElement.onerror = () => {
                  toast.error("Không thể tải hình ảnh đã xóa nền");
                };
              } else {
                // If no element, wait a bit and resolve anyway
                setTimeout(() => resolve(), 100);
              }
            });

            waitForImageLoad.then(() => {
              // Copy position and other properties from original image
              newImg.set({
                left: img.left,
                top: img.top,
                angle: img.angle,
                selectable: true,
              });

              // Set same scaled size as original image
              newImg.scaleToWidth(img.getScaledWidth());
              newImg.scaleToHeight(img.getScaledHeight());

              // Ensure the new image has proper cross-origin settings
              (newImg as fabric.Image & { crossOrigin?: string }).crossOrigin = "anonymous";

              // Remove the original image and add the new one
              canvas.remove(img);
              canvas.add(newImg);
              canvas.setActiveObject(newImg);

              // Force canvas to render and update
              canvas.requestRenderAll();
              canvas.fire('object:modified', { target: newImg });

              // Additional render to ensure everything is displayed
              setTimeout(() => {
                canvas.requestRenderAll();
              }, 50);

              // Debug: Log canvas state after adding new image
              console.log('Canvas objects after background removal:', canvas.getObjects().length);
              console.log('New image properties:', {
                left: newImg.left,
                top: newImg.top,
                width: newImg.getScaledWidth(),
                height: newImg.getScaledHeight(),
                customId: (newImg as fabric.Image & { customId?: string }).customId
              });

              // Test if the image can be serialized properly
              try {
                const testSerialization = newImg.toObject();
                console.log('Image serialization test successful:', testSerialization.src ? 'Has src' : 'No src');
              } catch (serializeError) {
                console.error('Image serialization test failed:', serializeError);
              }

              // Ensure all images have proper cross-origin settings
              const allImages = canvas.getObjects().filter(obj => obj.type === 'image') as fabric.Image[];
              allImages.forEach(imageObj => {
                if (imageObj.getElement()) {
                  const imgElement = imageObj.getElement() as HTMLImageElement;
                  if (imgElement.crossOrigin !== 'anonymous') {
                    imgElement.crossOrigin = 'anonymous';
                  }
                }
              });

              // Save the state after successful replacement
              if (onSaveState) {
                // Small delay to ensure canvas is fully updated
                setTimeout(() => {
                  console.log('Saving canvas state after background removal...');
                  onSaveState();
                  console.log('Canvas state saved successfully');
                }, 200);
              }

              toast.success("Đã xóa nền thành công!");
            });
          } catch (error) {
            console.error("Error updating canvas:", error);
            toast.error("Có lỗi xảy ra khi cập nhật canvas");
          }
        },
        {
          crossOrigin: "anonymous"
        }
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
