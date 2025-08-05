import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
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
  preloadProgress: number;
  isFabricReady: boolean;
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
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isFabricReady, setIsFabricReady] = useState(false);

  // Refs for tracking state
  const isPreloadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fabricLoadPromiseRef = useRef<Promise<boolean> | null>(null);

  const { getFolderCanvas } = CanvasService();

  // Optimized fabric.js loading with better retry strategy
  const ensureFabricLoaded = useCallback(async (): Promise<boolean> => {
    // If fabric is already loaded, return immediately
    if (typeof window.fabric !== "undefined") {
      setIsFabricReady(true);
      return true;
    }

    // If we're already loading fabric, return the existing promise
    if (fabricLoadPromiseRef.current) {
      return fabricLoadPromiseRef.current;
    }

    // Create new fabric loading promise
    fabricLoadPromiseRef.current = new Promise<boolean>((resolve) => {
      let retryCount = 0;
      const maxRetries = 10;
      const retryInterval = 200; // Reduced from 500ms to 200ms

      const checkFabric = () => {
        if (typeof window.fabric !== "undefined") {
          setIsFabricReady(true);
          resolve(true);
          return;
        }

        retryCount++;
        if (retryCount >= maxRetries) {
          console.warn(
            "Fabric.js not available after retries, proceeding without preview generation"
          );
          resolve(false);
          return;
        }

        setTimeout(checkFabric, retryInterval);
      };

      checkFabric();
    });

    return fabricLoadPromiseRef.current;
  }, []);

  // Optimized canvas preview generation with better error handling
  const generateCanvasPreview = useCallback(
    async (
      item: CanvasFolder
    ): Promise<{ url: string; width: number; height: number }> => {
      try {
        // If we have latestCanvasInfo with previewUrl, use it
        if (item.latestCanvasInfo?.previewUrl) {
          return { url: item.latestCanvasInfo.previewUrl, width: 0, height: 0 };
        }

        // If we have canvas description, generate preview from it
        if (item.latestCanvasInfo?.canvasDescription) {
          // Check if fabric is ready
          const fabricAvailable = await ensureFabricLoaded();

          if (!fabricAvailable) {
            return {
              url: "/images/canvas-placeholder.png",
              width: 0,
              height: 0,
            };
          }

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

            // Create canvas with timeout to prevent hanging
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = originalWidth;
            tempCanvas.height = originalHeight;
            const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
              backgroundColor: "#fff",
            });

            // Add timeout to prevent infinite loading
            const loadPromise = new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error("Canvas loading timeout"));
              }, 5000); // 5 second timeout

              fabricCanvas.loadFromJSON(parsedDesc, () => {
                clearTimeout(timeout);
                setTimeout(() => {
                  fabricCanvas.renderAll();
                  resolve(null);
                }, 50); // Reduced from 100ms to 50ms
              });
            });

            await loadPromise;

            // Create preview with optimized rendering
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
                url: previewCanvas.toDataURL("image/png", 0.8), // Reduced quality for better performance
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
    },
    [ensureFabricLoaded]
  );

  // Progressive loading with better progress tracking
  const startPreload = useCallback(async () => {
    // Prevent multiple simultaneous preloads
    if (isPreloadingRef.current) {
      return;
    }

    try {
      isPreloadingRef.current = true;
      setIsPreloading(true);
      setPreloadError(null);
      setPreloadProgress(0);
      setHasPreloadedData(false);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Set a 3-second timeout for the entire preload process
      const preloadTimeout = setTimeout(() => {
        console.log("CanvasPreloadContext: Preload timeout reached (3s)");
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 3000);

      try {
        // Step 1: Load data (0% to 30% progress)
        setPreloadProgress(10);
        const data = await getFolderCanvas({
          FolderName: "",
          page: 1,
          size: 8,
        });

        if (abortControllerRef.current?.signal.aborted) {
          clearTimeout(preloadTimeout);
          return;
        }

        const items = data?.responseRequestModel?.responseList?.items || [];
        setPreloadProgress(30);

        // Step 2: Check fabric availability (30% to 50% progress)
        setPreloadProgress(35);
        await ensureFabricLoaded();
        setPreloadProgress(50);

        if (abortControllerRef.current?.signal.aborted) {
          clearTimeout(preloadTimeout);
          return;
        }

        // Step 3: Generate previews progressively (50% to 90% progress)
        const itemsWithPreviews: CanvasFolder[] = [];
        const totalItems = items.length;

        console.log(
          "CanvasPreloadContext: Starting preview generation for",
          totalItems,
          "items"
        );

        for (let i = 0; i < totalItems; i++) {
          if (abortControllerRef.current?.signal.aborted) {
            clearTimeout(preloadTimeout);
            return;
          }

          try {
            const item = items[i];
            console.log(
              "CanvasPreloadContext: Generating preview for item",
              i + 1,
              "of",
              totalItems,
              item.folderName
            );

            const preview = await generateCanvasPreview(item);

            itemsWithPreviews.push({
              ...item,
              previewUrl: preview.url,
              previewWidth: preview.width,
              previewHeight: preview.height,
            });

            // Update progress: 50% to 90% based on items processed
            const itemProgress = (i + 1) / totalItems;
            setPreloadProgress(50 + itemProgress * 40);

            // Smaller delay to prevent blocking UI
            await new Promise((resolve) => setTimeout(resolve, 5));
          } catch (error) {
            console.error(
              "Error generating preview for item:",
              items[i].canvasFolderId,
              error
            );

            // Add item with placeholder
            itemsWithPreviews.push({
              ...items[i],
              previewUrl: "/images/canvas-placeholder.png",
              previewWidth: 0,
              previewHeight: 0,
            });
          }
        }

        if (abortControllerRef.current?.signal.aborted) {
          clearTimeout(preloadTimeout);
          return;
        }

        // Step 4: Complete (90% to 100% progress)
        setPreloadProgress(100);
        console.log(
          "CanvasPreloadContext: Preload complete with",
          itemsWithPreviews.length,
          "items with previews"
        );

        setPreloadedCanvasList(itemsWithPreviews);
        setHasPreloadedData(true);

        // Dispatch event to notify that preload is complete
        window.dispatchEvent(
          new CustomEvent("canvasPreloadComplete", {
            detail: { canvasList: itemsWithPreviews },
          })
        );

        clearTimeout(preloadTimeout);
      } catch (error) {
        clearTimeout(preloadTimeout);
        throw error;
      }
    } catch (error) {
      console.error("Error preloading canvas list:", error);
      setPreloadError("Failed to preload canvas list");
    } finally {
      setIsPreloading(false);
      isPreloadingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [getFolderCanvas, ensureFabricLoaded, generateCanvasPreview]);

  const clearPreload = useCallback(() => {
    // Cancel ongoing preload
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setPreloadedCanvasList([]);
    setPreloadError(null);
    setIsPreloading(false);
    setHasPreloadedData(false);
    setPreloadProgress(0);
    isPreloadingRef.current = false;
  }, []);

  const value: CanvasPreloadContextType = {
    isPreloading,
    preloadedCanvasList,
    preloadError,
    startPreload,
    clearPreload,
    hasPreloadedData,
    preloadProgress,
    isFabricReady,
  };

  return (
    <CanvasPreloadContext.Provider value={value}>
      {children}
    </CanvasPreloadContext.Provider>
  );
};
