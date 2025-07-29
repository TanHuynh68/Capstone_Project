import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import CanvasService from "@/services/CanvasService";

interface CanvasFolder {
  canvasFolderId: string;
  folderName: string;
  createdAt: string;
  latestCanvasInfo: {
    canvasInfoId?: string;
    canvasTitle?: string;
    canvasDescription?: string;
    previewUrl?: string;
  } | null;
  previewUrl?: string;
  previewWidth?: number;
  previewHeight?: number;
}

interface CanvasPreloadContextType {
  isPreloading: boolean;
  preloadedCanvasList: CanvasFolder[];
  preloadError: string | null;
  startPreload: () => void;
  clearPreload: () => void;
  hasPreloadedData: boolean;
}

const CanvasPreloadContext = createContext<
  CanvasPreloadContextType | undefined
>(undefined);

export const useCanvasPreload = () => {
  const context = useContext(CanvasPreloadContext);
  if (context === undefined) {
    throw new Error(
      "useCanvasPreload must be used within a CanvasPreloadProvider"
    );
  }
  return context;
};

interface CanvasPreloadProviderProps {
  children: ReactNode;
}

export const CanvasPreloadProvider: React.FC<CanvasPreloadProviderProps> = ({
  children,
}) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadedCanvasList, setPreloadedCanvasList] = useState<
    CanvasFolder[]
  >([]);
  const [preloadError, setPreloadError] = useState<string | null>(null);
  const [hasPreloadedData, setHasPreloadedData] = useState(false);

  const { getFolderCanvas } = CanvasService();

  // Function to generate canvas preview (copied from CanvasListInPage)
  const generateCanvasPreview = async (
    item: CanvasFolder
  ): Promise<{ url: string; width: number; height: number }> => {
    try {
      // If we have latestCanvasInfo with previewUrl, use it
      if (item.latestCanvasInfo?.previewUrl) {
        return { url: item.latestCanvasInfo.previewUrl, width: 0, height: 0 };
      }

      // If we have canvas description, generate preview from it
      if (item.latestCanvasInfo?.canvasDescription) {
        let originalWidth = 960;
        let originalHeight = 540;
        try {
          const parsedDesc = JSON.parse(
            item.latestCanvasInfo.canvasDescription
          );
          if (parsedDesc.width && parsedDesc.height) {
            originalWidth = parsedDesc.width;
            originalHeight = parsedDesc.height;
          }

          // Tạo canvas gốc
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = originalWidth;
          tempCanvas.height = originalHeight;
          const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
            backgroundColor: "#fff",
          });

          await new Promise((resolve) => {
            fabricCanvas.loadFromJSON(parsedDesc, () => {
              setTimeout(() => {
                fabricCanvas.renderAll();
                resolve(null);
              }, 100);
            });
          });

          // Tạo preview đúng kích thước gốc
          const previewCanvas = document.createElement("canvas");
          previewCanvas.width = originalWidth;
          previewCanvas.height = originalHeight;
          const ctx = previewCanvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, originalWidth, originalHeight);
            const canvasEl =
              typeof fabricCanvas.getElement === "function"
                ? (fabricCanvas.getElement() as HTMLCanvasElement)
                : (
                    fabricCanvas as unknown as {
                      lowerCanvasEl: HTMLCanvasElement;
                    }
                  ).lowerCanvasEl;
            ctx.drawImage(
              canvasEl,
              0,
              0,
              originalWidth,
              originalHeight,
              0,
              0,
              originalWidth,
              originalHeight
            );
            return {
              url: previewCanvas.toDataURL("image/png"),
              width: originalWidth,
              height: originalHeight,
            };
          }
        } catch (parseError) {
          console.error("Error parsing canvas description:", parseError);
        }
      }
      // Return placeholder if no preview available
      return { url: "/images/canvas-placeholder.png", width: 0, height: 0 };
    } catch (error) {
      console.error("Error generating preview:", error);
      return { url: "/images/canvas-placeholder.png", width: 0, height: 0 };
    }
  };

  const startPreload = useCallback(async () => {
    try {
      setIsPreloading(true);
      setPreloadError(null);
      setHasPreloadedData(false);

      // Check if fabric.js is available with retry logic
      let fabricAvailable = typeof window.fabric !== "undefined";
      let retryCount = 0;
      const maxRetries = 5;

      while (!fabricAvailable && retryCount < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
        fabricAvailable = typeof window.fabric !== "undefined";
        retryCount++;
      }

      if (!fabricAvailable) {
        // Still try to load data without preview generation
        const data = await getFolderCanvas({
          FolderName: "",
          page: 1,
          size: 8,
        });

        const items = data?.responseRequestModel?.responseList?.items || [];

        // Set items without preview generation
        setPreloadedCanvasList(items);
        setHasPreloadedData(true);

        // Dispatch event to notify that preload is complete
        window.dispatchEvent(
          new CustomEvent("canvasPreloadComplete", {
            detail: { canvasList: items },
          })
        );
        return;
      }

      // Preload first page of canvas list
      const data = await getFolderCanvas({
        FolderName: "",
        page: 1,
        size: 8,
      });

      const items = data?.responseRequestModel?.responseList?.items || [];

      // Generate previews for all items
      const itemsWithPreviews = await Promise.all(
        items.map(async (item: CanvasFolder) => {
          try {
            const preview = await generateCanvasPreview(item);
            return {
              ...item,
              previewUrl: preview.url,
              previewWidth: preview.width,
              previewHeight: preview.height,
            };
          } catch (error) {
            console.error(
              "Error generating preview for item:",
              item.canvasFolderId,
              error
            );
            return {
              ...item,
              previewUrl: "/images/canvas-placeholder.png",
              previewWidth: 0,
              previewHeight: 0,
            };
          }
        })
      );

      setPreloadedCanvasList(itemsWithPreviews);
      setHasPreloadedData(true);

      // Dispatch event to notify that preload is complete
      window.dispatchEvent(
        new CustomEvent("canvasPreloadComplete", {
          detail: { canvasList: itemsWithPreviews },
        })
      );
    } catch (error) {
      console.error("Error preloading canvas list:", error);
      setPreloadError("Failed to preload canvas list");
    } finally {
      setIsPreloading(false);
    }
  }, [getFolderCanvas]);

  const clearPreload = useCallback(() => {
    setPreloadedCanvasList([]);
    setPreloadError(null);
    setIsPreloading(false);
    setHasPreloadedData(false);
  }, []);

  const value: CanvasPreloadContextType = {
    isPreloading,
    preloadedCanvasList,
    preloadError,
    startPreload,
    clearPreload,
    hasPreloadedData,
  };

  return (
    <CanvasPreloadContext.Provider value={value}>
      {children}
    </CanvasPreloadContext.Provider>
  );
};
