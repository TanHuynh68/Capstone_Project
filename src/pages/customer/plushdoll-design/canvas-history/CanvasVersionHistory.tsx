import React, { useEffect, useState } from "react";
import CanvasService, { CanvasResponse } from "@/services/CanvasService";
import { Button } from "@/components/ui/button";

interface CanvasVersionHistoryProps {
  canvasFolderId: string;
  onRestore?: (canvas: CanvasResponse) => void;
}

const CanvasVersionHistory: React.FC<CanvasVersionHistoryProps> = ({ canvasFolderId, onRestore }) => {
  const { getCanvasHistory } = CanvasService();
  const [versions, setVersions] = useState<CanvasResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canvasFolderId) return;
    setLoading(true);
    getCanvasHistory({ canvasFolderId })
      .then((res) => {
        const list = res?.responseRequestModel?.responseList || [];
        setVersions(list);
      })
      .finally(() => setLoading(false));
  }, [canvasFolderId, getCanvasHistory]);

  return (
    <div className="p-2 w-64">
      <div className="font-semibold text-sm mb-2">Các phiên bản gần đây</div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {versions.length === 0 && <div className="text-xs text-muted-foreground">Không có phiên bản nào</div>}
          {versions.map((ver) => (
            <div
              key={ver.canvasInfoId}
              className="flex items-center justify-between p-2 rounded hover:bg-muted transition"
            >
              <div>
                <div className="font-medium text-xs">{ver.canvasTitle || `Phiên bản ${ver.versionNumber}`}</div>
                <div className="text-xs text-muted-foreground">
                  {ver.updatedAt ? new Date(ver.updatedAt).toLocaleString() : ""}
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