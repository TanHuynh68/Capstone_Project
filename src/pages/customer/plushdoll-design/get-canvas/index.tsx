import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CustomerService from "@/services/CustomerService";

interface CanvasItem {
  canvasInfoId: string;
  canvasTitle: string;
  canvasDescription: string;
}

interface CanvasListProps {
  onSelect: (
    canvasDescription: string,
    canvasTitle: string,
    canvasId: string
  ) => void;
  initialCanvasState?: {
    canvasId: string;
    canvasTitle: string;
    canvasDescription: string;
  };
  selectedCanvasId?: string;
}

const CanvasList: React.FC<CanvasListProps> = ({
  onSelect,
  selectedCanvasId,
  initialCanvasState,
}) => {
  const [canvasList, setCanvasList] = useState<CanvasItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState("");
  const [page, setPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const size = 10;
  const { getCanvas } = CustomerService();

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCanvas({ canvasTitle: searchTitle, page, size });
      setCanvasList(data?.responseRequestModel?.responseList?.items || []);

      // Dispatch event với tổng số canvas
      const totalCount =
        data?.responseRequestModel?.responseList?.totalCount || 0;
      window.dispatchEvent(
        new CustomEvent("canvasCountUpdated", {
          detail: { totalCount },
        })
      );
    } catch (error) {
      console.error("Lỗi tải canvas:", error);
    } finally {
      setLoading(false);
    }
  }, [page, getCanvas, searchTitle]);

  const handleSelectCanvas = (
    description: string,
    title: string,
    id: string
  ) => {
    onSelect(description, title, id);
  };

  const handleSearch = () => {
    setSearchTitle(canvasTitle);
    setPage(1);
  };

  // Load lại khi searchTitle hoặc page thay đổi
  useEffect(() => {
    loadList();
  }, [searchTitle, page, loadList]);

  // Thêm event listener để load lại danh sách khi canvas được lưu
  useEffect(() => {
    const handleCanvasSaved = () => {
      setPage(1); // Reset về trang 1
      loadList(); // Load lại danh sách
    };

    window.addEventListener("canvasSaved", handleCanvasSaved);
    return () => {
      window.removeEventListener("canvasSaved", handleCanvasSaved);
    };
  }, [loadList]);

  useEffect(() => {
    if (initialCanvasState && canvasList.length > 0 && !hasAutoSelected) {
      const match = canvasList.find(
        (item) => item.canvasInfoId === initialCanvasState.canvasId
      );

      if (match) {
        // console.log("🔁 Auto-selecting canvas:", match);
        onSelect(
          initialCanvasState.canvasDescription,
          initialCanvasState.canvasTitle,
          initialCanvasState.canvasId
        );
        setHasAutoSelected(true);
      } else {
        console.warn(
          "⚠️ No match found for initialCanvasState.canvasId:",
          initialCanvasState.canvasId,
          "in",
          canvasList.map((c) => c.canvasInfoId)
        );
      }
    }
  }, [canvasList, initialCanvasState, onSelect, hasAutoSelected]);

  // useEffect(() => {
  //   console.log("Danh sách canvas: ", canvasList);
  // }, [canvasList]);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <input
          type="text"
          placeholder="Tìm canvas"
          value={canvasTitle}
          onChange={(e) => setCanvasTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="border p-1 rounded flex-1 text-sm"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleSearch}
          disabled={loading}
        >
          Tìm
        </Button>
      </div>

      <div className="max-h-[200px] overflow-auto space-y-1">
        {canvasList.length === 0 ? (
          <div className="text-gray-400 text-sm text-center mt-4">Không có</div>
        ) : (
          canvasList.map((item) => (
            <div
              key={item.canvasInfoId}
              className={`cursor-pointer p-1 border rounded text-sm truncate transition-colors
    ${
      item.canvasInfoId === selectedCanvasId
        ? "bg-primary text-white font-semibold"
        : "hover:bg-muted text-foreground"
    }`}
              title={item.canvasTitle}
              onClick={() =>
                handleSelectCanvas(
                  item.canvasDescription,
                  item.canvasTitle,
                  item.canvasInfoId
                )
              }
            >
              {item.canvasTitle}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between text-xs">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          ◀
        </Button>
        <span>Trang {page}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={canvasList.length < size}
        >
          ▶
        </Button>
      </div>
    </div>
  );
};

export default CanvasList;
