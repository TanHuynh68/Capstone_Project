import React, { useEffect, useState } from "react";
import CanvasService, { CanvasResponse } from "@/services/CanvasService";
import { fabric } from "fabric";
import { formatVietnamDateHours } from "@/utils/date";
import { Clock } from "lucide-react";

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
      return "/images/logo.png";
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error("Error parsing canvas description:", parseError);
    }
    return "/images/logo.png";
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating preview:", error);
    return "/images/logo.png";
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
    <div className="p-4 w-110">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="font-semibold text-foreground text-sm">
            Các phiên bản gần đây
          </h3>
        </div>
        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
          {versions.length} phiên bản
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Đang tải...</span>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-0 pl-0 py-0">
          {versions.length === 0 && (
            <div className="text-center py-8">
              <span className="text-muted-foreground">
                Không có phiên bản nào
              </span>
            </div>
          )}
          {versions.map((ver) => (
            <div
              key={ver.canvasInfoId}
              className={`relative group rounded-lg border transition-all duration-200 cursor-pointer ${
                ver.isLatest
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 hover:border-blue-400 hover:shadow-lg"
                  : "bg-card border-border hover:border-primary hover:shadow-md"
              }`}
              onClick={() => onRestore?.(ver)}
            >
              {/* Version badge */}
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                  Phiên bản {ver.versionNumber}
                </div>
              </div>

              {/* Latest version indicator */}
              {ver.isLatest && (
                <div className="absolute top-2 right-24 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                    Mới nhất
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3">
                {/* Preview image */}
                <div className="relative">
                  <div className="w-40 h-24 bg-muted rounded-lg overflow-hidden border border-border">
                    <img
                      src={previewUrls[ver.canvasInfoId] || "/images/logo.png"}
                      alt={ver.canvasTitle || `Phiên bản ${ver.versionNumber}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Version info */}
                <div className="flex-1 min-w-0 text-center justify-center">
                  <h4 className="text-sm font-medium text-foreground truncate mb-1">
                    {ver.canvasTitle || `Thiết kế ${ver.versionNumber}`}
                  </h4>
                </div>
              </div>

              {/* Timestamp - moved to bottom right corner */}
              <div className="absolute bottom-2 right-2 z-10">
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border">
                  <Clock className="w-3 h-3" />
                  {ver.updatedAt
                    ? formatVietnamDateHours(ver.updatedAt)
                    : "Chưa có thời gian"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {versions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <span>Nhấp vào phiên bản để khôi phục</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasVersionHistory;
