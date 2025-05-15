import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CustomerService from "@/services/CustomerService";

interface CanvasItem {
  id: string;
  canvasTitle: string;
  canvasDescription: string;
}

interface CanvasListProps {
  onSelect: (canvasDescription: string) => void;
}

const CanvasList: React.FC<CanvasListProps> = ({ onSelect }) => {
  const [canvasList, setCanvasList] = useState<CanvasItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState("");
  const [page, setPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");

  const size = 10;
  const { getCanvas } = CustomerService();

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCanvas({ canvasTitle: searchTitle, page, size });
      setCanvasList(data?.responseRequestModel?.responseList?.items || []);
    } catch (error) {
      console.error("Lỗi tải canvas:", error);
    } finally {
      setLoading(false);
    }
  }, [page, getCanvas, searchTitle]);



  const handleSelectCanvas = (description: string) => {
    onSelect(description);
  };

  const handleSearch = () => {
    setSearchTitle(canvasTitle);
    setPage(1);
  };

  // Load lại khi searchTitle hoặc page thay đổi
  useEffect(() => {
    loadList();
  }, [searchTitle, page, loadList]);

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
              key={item.id}
              className="cursor-pointer p-1 border rounded hover:bg-gray-100 text-sm truncate"
              title={item.canvasTitle}
              onClick={() => handleSelectCanvas(item.canvasDescription)}
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
