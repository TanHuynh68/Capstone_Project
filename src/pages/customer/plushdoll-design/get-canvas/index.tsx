import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CustomerService from "@/services/CustomerService";
import { ChevronRight, ChevronLeft } from "lucide-react";
import DeleteCanvasButton from "../delete-canvas/DeleteCanvasButton";
import SidebarSearchBar from "../SidebarSearchBar";

interface CanvasItem {
  canvasInfoId: string;
  canvasTitle: string;
  canvasDescription: string;
  previewUrl?: string;
}

interface FabricObject {
  type?: string;
  crossOrigin?: string;
  scaleX?: number;
  scaleY?: number;
  left?: number;
  top?: number;
  fontSize?: number;
}

interface CanvasJSON {
  objects: FabricObject[];
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

  // Function to generate canvas preview
  const generateCanvasPreview = async (item: CanvasItem): Promise<string> => {
    try {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 444; // Width calculated for 16:9 ratio with height 250
      tempCanvas.height = 250; // Desired height
      const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
        backgroundColor: "#fff",
      });

      // Fix crossOrigin in JSON
      const parsedDesc = JSON.parse(item.canvasDescription) as CanvasJSON;
      parsedDesc.objects.forEach((obj: FabricObject) => {
        if (obj.type === "image") {
          obj.crossOrigin = "anonymous";
        }
      });

      // Scale the canvas content to fit preview size
      const scaleX = tempCanvas.width / 960;
      const scaleY = tempCanvas.height / 540;
      const scale = Math.min(scaleX, scaleY);

      parsedDesc.objects.forEach((obj: FabricObject) => {
        if (obj.scaleX) obj.scaleX *= scale;
        if (obj.scaleY) obj.scaleY *= scale;
        if (obj.left) obj.left *= scale;
        if (obj.top) obj.top *= scale;
        if (obj.fontSize) obj.fontSize *= scale;
      });

      await new Promise((resolve) => {
        fabricCanvas.loadFromJSON(
          parsedDesc,
          () => {
            setTimeout(() => {
              fabricCanvas.renderAll();
              resolve(null);
            }, 100);
          },
          function (_: unknown, obj: fabric.Object) {
            if (obj?.type === "image") {
              // @ts-expect-error: crossOrigin is not in fabric.Object typings
              obj.crossOrigin = "anonymous";
            }
          }
        );
      });

      return fabricCanvas.toDataURL({ format: "png" });
    } catch (error) {
      console.error("Error generating preview:", error);
      return "/images/canvas-placeholder.png";
    }
  };

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCanvas({ canvasTitle: searchTitle, page, size });
      const items = data?.responseRequestModel?.responseList?.items || [];

      // Generate previews for all items
      const itemsWithPreviews = await Promise.all(
        items.map(async (item: CanvasItem) => {
          const previewUrl = await generateCanvasPreview(item);
          return { ...item, previewUrl };
        })
      );

      setCanvasList(itemsWithPreviews);

      const totalCount =
        data?.responseRequestModel?.responseList?.totalCount || 0;
      window.dispatchEvent(
        new CustomEvent("canvasCountUpdated", {
          detail: { totalCount },
        })
      );
    } catch (error) {
      console.error("Lỗi tải thiết kế:", error);
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

  useEffect(() => {
    loadList();
  }, [searchTitle, page, loadList]);

  useEffect(() => {
    const handleCanvasSaved = () => {
      setPage(1);
      loadList();
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
        onSelect(
          initialCanvasState.canvasDescription,
          initialCanvasState.canvasTitle,
          initialCanvasState.canvasId
        );
        setHasAutoSelected(true);
      }
    }
  }, [canvasList, initialCanvasState, onSelect, hasAutoSelected]);

  return (
    <div className="space-y-4 p-2">
      <div className="relative">
        <SidebarSearchBar
          value={canvasTitle}
          onChange={(e) => setCanvasTitle(e.target.value)}
          onSearch={handleSearch}
          placeholder="Tìm thiết kế..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          loading={loading}
        />
      </div>

      <div className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              Đang tải...
            </div>
          ) : canvasList.length === 0 ? (
            <div className="col-span-2 text-muted-foreground text-sm text-center py-8">
              Không có thiết kế nào
            </div>
          ) : (
            canvasList.map((item) => (
              <div
                key={item.canvasInfoId}
                className={`cursor-pointer group transition-all duration-200 ease-in-out transform hover:scale-[1.02]`}
                onClick={() =>
                  handleSelectCanvas(
                    item.canvasDescription,
                    item.canvasTitle,
                    item.canvasInfoId
                  )
                }
              >
                <div className="aspect-video bg-white rounded-lg mb-2 overflow-hidden relative border-2 border-primary/80 shadow-sm transition-transform duration-200">
                  <img
                    src={item.previewUrl}
                    alt={item.canvasTitle}
                    className="w-full h-full object-contain transition-all duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <DeleteCanvasButton
                      canvasInfoId={item.canvasInfoId}
                      canvasTitle={item.canvasTitle}
                    />
                  </div>
                </div>
                <div
                  className={`text-sm font-medium truncate text-center transition-all duration-200 ${
                    item.canvasInfoId === selectedCanvasId
                      ? "text-primary scale-105"
                      : "text-muted-foreground scale-100"
                  }`}
                >
                  {item.canvasTitle}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Trang {page}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={canvasList.length < size || loading}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasList;
