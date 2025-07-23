import React, { useEffect, useState } from "react";
import CanvasService, { CanvasResponse } from "@/services/CanvasService";
import { Button } from "@/components/ui/button";
import { fabric } from "fabric";

interface CanvasVersionHistoryProps {
  canvasFolderId: string;
  onRestore?: (canvas: CanvasResponse) => void;
}

// Hàm tạo preview từ canvasDescription
const generateCanvasPreview = async (
  canvasDescription: string
): Promise<string> => {
  try {
    if (!canvasDescription) return "/images/canvas-placeholder.png";
    // Lấy kích thước gốc từ canvasDescription
    let originalWidth = 960;
    let originalHeight = 540;
    let previewWidth = 120;
    let previewHeight = 68;
    try {
      const parsedDesc = JSON.parse(canvasDescription);
      if (parsedDesc.width && parsedDesc.height) {
        originalWidth = parsedDesc.width;
        originalHeight = parsedDesc.height;
        // Tính preview giữ nguyên tỉ lệ
        const scale = Math.min(
          previewWidth / originalWidth,
          previewHeight / originalHeight
        );
        previewWidth = Math.round(originalWidth * scale);
        previewHeight = Math.round(originalHeight * scale);
      }
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = originalWidth;
      tempCanvas.height = originalHeight;
      const fabricCanvas = new fabric.Canvas(tempCanvas, {
        backgroundColor: "#fff",
      });
      await new Promise((resolve) => {
        fabricCanvas.loadFromJSON(parsedDesc, () => {
          setTimeout(() => {
            fabricCanvas.renderAll();
            resolve(null);
          }, 50);
        });
      });
      // Sau khi render xong, tạo preview nhỏ hơn bằng cách vẽ lên canvas nhỏ
      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = previewWidth;
      previewCanvas.height = previewHeight;
      const ctx = previewCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, previewWidth, previewHeight);
        // fabric v5+ dùng getElement(), v4 dùng lowerCanvasEl
        const canvasEl =
          typeof fabricCanvas.getElement === "function"
            ? (fabricCanvas.getElement() as HTMLCanvasElement)
            : (fabricCanvas as unknown as { lowerCanvasEl: HTMLCanvasElement })
                .lowerCanvasEl;
        ctx.drawImage(
          canvasEl,
          0,
          0,
          originalWidth,
          originalHeight,
          0,
          0,
          previewWidth,
          previewHeight
        );
        return previewCanvas.toDataURL("image/png");
      }
      return "/images/canvas-placeholder.png";
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error("Error parsing canvas description:", parseError);
    }
    return "/images/canvas-placeholder.png";
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating preview:", error);
    return "/images/canvas-placeholder.png";
  }
};

const CanvasVersionHistory: React.FC<CanvasVersionHistoryProps> = ({
  canvasFolderId,
  onRestore,
}) => {
  const { getCanvasHistory } = CanvasService();
  const [versions, setVersions] = useState<CanvasResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (!canvasFolderId) return;
    setLoading(true);
    getCanvasHistory({ canvasFolderId })
      .then(async (res) => {
        const list = res?.responseRequestModel?.responseList || [];
        setVersions(list);
        // Tạo preview cho từng version
        const previews: { [id: string]: string } = {};
        await Promise.all(
          list.map(async (ver: CanvasResponse) => {
            if (ver.canvasDescription) {
              previews[ver.canvasInfoId] = await generateCanvasPreview(
                ver.canvasDescription
              );
            } else {
              previews[ver.canvasInfoId] = "/images/canvas-placeholder.png";
            }
          })
        );
        setPreviewUrls(previews);
      })
      .finally(() => setLoading(false));
  }, [canvasFolderId, getCanvasHistory]);

  return (
    <div className="p-2 w-100">
      <div className="font-semibold text-sm mb-2">Các phiên bản gần đây</div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {versions.length === 0 && (
            <div className="text-xs text-muted-foreground">
              Không có phiên bản nào
            </div>
          )}
          {versions.map((ver) => (
            <div
              key={ver.canvasInfoId}
              className="flex items-center justify-between p-2 rounded hover:bg-muted transition"
            >
              <div className="flex items-center gap-2">
                <div className="w-44 h-24 flex items-center justify-center py-2 bg-gray-200 rounded-lg">
                  <img
                    src={
                      previewUrls[ver.canvasInfoId] ||
                      "/images/canvas-placeholder.png"
                    }
                    alt={ver.canvasTitle || `Phiên bản ${ver.versionNumber}`}
                    className="max-h-full max-w-full object-contain transition-all duration-200"
                  />
                </div>
                <div>
                  <div className="font-medium text-xs">
                    {ver.canvasTitle || `Phiên bản ${ver.versionNumber}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ver.updatedAt
                      ? new Date(ver.updatedAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="text-xs px-2 py-1"
                onClick={() => onRestore?.(ver)}
              >
                Khôi phục
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CanvasVersionHistory;
