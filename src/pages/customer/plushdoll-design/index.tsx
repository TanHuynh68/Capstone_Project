import React, { useEffect, useRef, useState, DragEvent } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Type,
  Undo2,
  Redo2,
  Download,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  ArrowUpFromLine,
  ArrowDownFromLine,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ImageUp,
  PawPrint,
  Save,
  FolderOpen,
  FolderClosed,
  Fan,
  Palette,
  Group,
  Ungroup,
  Settings,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  RotateCcw,
  GripVertical,
  Droplets,
} from "lucide-react";
import { toast } from "sonner";
// import CanvasList from "./get-canvas";
import ItemLibrary from "./ItemLibrary";
import CanvasListSidebar from "./CanvasListSidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { convertToPixels } from "@/utils/convert";
import RemoveBackgroundButton from "./RemoveBackgroundButton";
import { useLocation } from "react-router-dom";
import BackgroundColorPanel from "./BackgroundColorPanel";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import CanvasVersionHistory from "@/pages/customer/plushdoll-design/canvas-history/CanvasVersionHistory";

// import ImageGenerator from "../image-gen";
// import CopilotImageGenerator from "../image-gen/CopilotImageGenerator";

import LogoCanvas from "@/components/atoms/custom/logo/LogoCanvas";
import DrawingToolPanel from "./DrawingToolPanel";
import ImageFilterPanel, {
  FilterValues,
  ActiveFilters,
} from "./ImageFilterPanel";
import CanvasService from "@/services/CanvasService";

// Add proper type for drag events
type DragEventHandler = (e: DragEvent<HTMLCanvasElement>) => void;

// Add interface for text properties
interface TextProperties {
  fontFamily: string;
  fontSize: number;
  fill: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
  underline: boolean;
}

// Add interface for storing filter state per image
interface ImageFilterState {
  values: FilterValues;
  active: ActiveFilters;
  isEnabled: boolean;
}

// Extend fabric.Image interface to include our custom properties
interface CustomFabricImage extends fabric.Image {
  customId?: string;
  originalSrc?: string;
}

const PlushDollDesign: React.FC = () => {
  // Image Cropping Feature:
  // - Double-click on any image to start cropping
  // - Move/scale the crop area as desired
  // - Click outside the crop area to finalize the crop
  // - The crop area is constrained to stay within the image bounds

  const canvasRef = useRef<fabric.Canvas | null>(null);
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRestoringRef = useRef(false);
  const isReplacingColorRef = useRef(false);
  const pasteCountRef = useRef(0);
  const unitRef = useRef<"px" | "cm" | "mm">("px");
  const clipboardRef = useRef<
    | {
        objects: { obj: fabric.Object; relLeft: number; relTop: number }[];
        bbox: { left: number; top: number };
      }
    | fabric.Object
    | null
  >(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [sizePopoverOpen, setSizePopoverOpen] = useState(false);
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);
  // Responsive initial size
  const getInitialCanvasSize = () => {
    if (typeof window !== "undefined") {
      const w = Math.max(window.innerWidth * 0.7, 320);
      const h = Math.max(window.innerHeight * 0.7, 240);
      return {
        width: Math.round(w),
        height: Math.round(h),
      };
    }
    return { width: 960, height: 540 };
  };
  const initialSize = getInitialCanvasSize();
  const [canvasWidthInput, setCanvasWidthInput] = useState(
    initialSize.width.toString()
  );
  const [canvasHeightInput, setCanvasHeightInput] = useState(
    initialSize.height.toString()
  );
  const [actualCanvasWidth, setActualCanvasWidth] = useState(
    initialSize.width.toString()
  );
  const [actualCanvasHeight, setActualCanvasHeight] = useState(
    initialSize.height.toString()
  );
  const [scaleRatio, setScaleRatio] = useState(1);
  const [unit, setUnit] = useState<"px" | "cm" | "mm">("px");

  // Add state for drawing brush properties
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(3);

  // Add state for eraser properties
  const [isErasing, setIsErasing] = useState(false);
  const [eraserWidth, setEraserWidth] = useState(10);

  // State to store filter settings for each image object
  const [imageFilterSettings, setImageFilterSettings] = useState<
    Map<string, ImageFilterState>
  >(new Map());
  const [currentSelectedImageId, setCurrentSelectedImageId] = useState<
    string | null
  >(null);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const [activeText, setActiveText] = useState<fabric.IText | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<{ states: string[]; index: number }>({
    states: [],
    index: -1,
  });

  const { postCanvas, getCanvasHistory, putCanvas, newVersionCanvas } =
    CanvasService();

  // Add this near other state declarations
  const [textProperties, setTextProperties] = useState({
    fontFamily: "Arial",
    fontSize: 20,
    fill: "#000000",
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "center",
    underline: false,
  });

  const [totalCanvasCount, setTotalCanvasCount] = useState(0);
  const [currentCanvasTitle, setCurrentCanvasTitle] =
    useState<string>("Thiết kế mới");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [currentCanvasId, setCurrentCanvasId] = useState<string>("");

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [showCanvasList, setShowCanvasList] = useState(false);

  const location = useLocation();

  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(5);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Thêm state điều khiển panel
  const [drawingPanelOpen, setDrawingPanelOpen] = useState(false);

  // Thêm state for background color
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundPanelOpen, setBackgroundPanelOpen] = useState(false);

  // ✅ Thêm state để track canvas initialization
  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);

  // Thêm state cho right sidebar
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [propertyUnit, setPropertyUnit] = useState<"px" | "mm">("px");

  // Thêm state để track selected object properties cho right sidebar
  const [selectedObjectProperties, setSelectedObjectProperties] = useState<{
    type?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
  }>({});

  const [draftProperties, setDraftProperties] = useState({
    x: "",
    y: "",
    w: "",
    h: "",
    a: "",
  });

  // Thêm state cho drag and drop layer
  const [draggedLayerIndex, setDraggedLayerIndex] = useState<number | null>(
    null
  );
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Add cropping state
  const [isCropping, setIsCropping] = useState(false);

  // Add color replacement state
  const [targetColor, setTargetColor] = useState("#ff0000");
  const [replacementColor, setReplacementColor] = useState("#00ff00");
  const [colorTolerance, setColorTolerance] = useState(30);
  const [isColorReplacementEnabled, setIsColorReplacementEnabled] =
    useState(false);

  // Add image filter state
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [filterValues, setFilterValues] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    vibrance: 0,
    noise: 0,
    pixelate: 4,
    blur: 0,
    gamma: [1, 1, 1],
    hue: 0,
    removeColorDistance: 0.1,
    removeColorColor: "#ffffff",
    blendColor: "#ffffff",
    blendMode: "multiply",
    blendAlpha: 0.5,
    grayscaleMode: "average",
  });

  const [activeFilters, setActiveFilters] = useState({
    grayscale: false,
    invert: false,
    removeColor: false,
    sepia: false,
    brownie: false,
    brightness: false,
    contrast: false,
    saturation: false,
    vibrance: false,
    noise: false,
    vintage: false,
    pixelate: false,
    blur: false,
    sharpen: false,
    emboss: false,
    technicolor: false,
    polaroid: false,
    blendColor: false,
    gamma: false,
    kodachrome: false,
    blackwhite: false,
    hue: false,
  });

  // Tabs for right sidebar
  const [rightSidebarTab, setRightSidebarTab] = useState<"adjust" | "layers">(
    "adjust"
  );

  // Thêm state cho shape color
  const [shapeColor, setShapeColor] = useState("#3b82f6");

  const DEFAULT_FILTER_VALUES: FilterValues = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    vibrance: 0,
    noise: 0,
    pixelate: 4,
    blur: 0,
    gamma: [1, 1, 1],
    hue: 0,
    removeColorDistance: 0.1,
    removeColorColor: "#ffffff",
    blendColor: "#ffffff",
    blendMode: "multiply",
    blendAlpha: 0.5,
    grayscaleMode: "average",
  };

  const DEFAULT_ACTIVE_FILTERS: ActiveFilters = {
    grayscale: false,
    invert: false,
    removeColor: false,
    sepia: false,
    brownie: false,
    brightness: false,
    contrast: false,
    saturation: false,
    vibrance: false,
    noise: false,
    vintage: false,
    pixelate: false,
    blur: false,
    sharpen: false,
    emboss: false,
    technicolor: false,
    polaroid: false,
    blendColor: false,
    gamma: false,
    kodachrome: false,
    blackwhite: false,
    hue: false,
  };

  const DEFAULT_FILTER_STATE: ImageFilterState = {
    values: DEFAULT_FILTER_VALUES,
    active: DEFAULT_ACTIVE_FILTERS,
    isEnabled: false,
  };

  const handleApplyChanges = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (!activeObject) return;

    // Sử dụng tọa độ chuẩn của Fabric.js
    // X - left position
    const newX = convertToPx(parseFloat(draftProperties.x) || 0, propertyUnit);
    activeObject.set("left", newX);

    // Y - top position
    const newY = convertToPx(parseFloat(draftProperties.y) || 0, propertyUnit);
    activeObject.set("top", newY);

    // W - width (scaleX)
    const newDisplayWidth = parseFloat(draftProperties.w) || 0;
    const newWidthPx = convertToPx(newDisplayWidth, propertyUnit);
    const originalWidth = activeObject.width || 1;
    activeObject.set("scaleX", newWidthPx / originalWidth);

    // H - height (scaleY)
    const newDisplayHeight = parseFloat(draftProperties.h) || 0;
    const newHeightPx = convertToPx(newDisplayHeight, propertyUnit);
    const originalHeight = activeObject.height || 1;
    activeObject.set("scaleY", newHeightPx / originalHeight);

    // A - angle
    const newAngle = parseFloat(draftProperties.a) || 0;
    activeObject.set("angle", newAngle);

    // Cập nhật tọa độ sau khi thay đổi position
    activeObject.setCoords();
    canvasRef.current?.renderAll();
    saveState();
  };

  const flipObjectHorizontal = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.set("flipX", !activeObject.flipX);
      canvasRef.current?.renderAll();
      saveState();
    }
  };

  const flipObjectVertical = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.set("flipY", !activeObject.flipY);
      canvasRef.current?.renderAll();
      saveState();
    }
  };

  const convertFromPx = (value: number, unit: "px" | "mm") => {
    if (unit === "px") return value;
    return value / convertToPixels(1, "mm");
  };

  const convertToPx = (value: number, unit: "px" | "mm") => {
    if (unit === "px") return value;
    return convertToPixels(value, "mm");
  };

  // Add cropping functions
  const prepareCrop = (imageObj: fabric.Image) => {
    if (!canvasRef.current) return;

    setIsCropping(true);

    const s = imageObj.cropX || 0;
    const o = imageObj.cropY || 0;
    const c = imageObj.width || imageObj.getScaledWidth();
    const l = imageObj.height || imageObj.getScaledHeight();

    imageObj.set({
      cropX: 0,
      cropY: 0,
      left: (imageObj.left || 0) - s * (imageObj.scaleX || 1),
      top: (imageObj.top || 0) - o * (imageObj.scaleY || 1),
      width:
        (imageObj as fabric.Image & { _originalElement?: HTMLImageElement })
          ._originalElement?.naturalWidth || c,
      height:
        (imageObj as fabric.Image & { _originalElement?: HTMLImageElement })
          ._originalElement?.naturalHeight || l,
      dirty: false,
      selectable: false,
      opacity: 1,
    });

    const overlay = new fabric.Rect({
      name: "overlay-rect",
      top: imageObj.top,
      left: imageObj.left,
      angle: imageObj.angle,
      width: (imageObj.width ?? 0) * (imageObj.scaleX || 1),
      height: (imageObj.height ?? 0) * (imageObj.scaleY || 1),
      selectable: false,
      fill: "rgba(0, 0, 0, 0.5)",
      lockRotation: true,
    });

    const cropRect = new fabric.Rect({
      name: "crop-rect",
      top: imageObj.top! + s * (imageObj.scaleY || 1),
      left: imageObj.left! + o * (imageObj.scaleX || 1),
      angle: imageObj.angle,
      width: c * (imageObj.scaleX || 1),
      height: l * (imageObj.scaleY || 1),
      stroke: "rgb(42, 67, 101)",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      fill: "rgba(255, 255, 255, 1)",
      globalCompositeOperation: "overlay",
      lockRotation: true,
      selectable: true,
    });

    canvasRef.current.add(overlay);
    canvasRef.current.add(cropRect);
    canvasRef.current.setActiveObject(cropRect);

    cropRect.on("moving", () => {
      const bounds = imageObj.getBoundingRect();
      const rectBounds = cropRect.getBoundingRect();

      if (rectBounds.left < bounds.left) cropRect.left = bounds.left;
      if (rectBounds.top < bounds.top) cropRect.top = bounds.top;
      if (rectBounds.left + rectBounds.width > bounds.left + bounds.width)
        cropRect.left = bounds.left + bounds.width - rectBounds.width;
      if (rectBounds.top + rectBounds.height > bounds.top + bounds.height)
        cropRect.top = bounds.top + bounds.height - rectBounds.height;

      canvasRef.current?.renderAll();
    });

    cropRect.on("deselected", () => {
      cropImage(cropRect, imageObj);
      canvasRef.current?.remove(overlay);
    });
  };

  const cropImage = (cropRectObj: fabric.Rect, imageObj: fabric.Image) => {
    if (!canvasRef.current) return;

    canvasRef.current.remove(cropRectObj);

    const cropX =
      ((cropRectObj.left || 0) - (imageObj.left || 0)) / (imageObj.scaleX || 1);
    const cropY =
      ((cropRectObj.top || 0) - (imageObj.top || 0)) / (imageObj.scaleY || 1);
    const cropWidth =
      ((cropRectObj.width || 0) * (cropRectObj.scaleX || 1)) /
      (imageObj.scaleX || 1);
    const cropHeight =
      ((cropRectObj.height || 0) * (cropRectObj.scaleY || 1)) /
      (imageObj.scaleY || 1);

    imageObj.set({
      cropX,
      cropY,
      width: cropWidth,
      height: cropHeight,
      top: (imageObj.top || 0) + cropY * (imageObj.scaleY || 1),
      left: (imageObj.left || 0) + cropX * (imageObj.scaleX || 1),
      selectable: true,
    });

    setIsCropping(false);

    canvasRef.current.renderAll();
    saveState();
  };

  // Add color replacement function
  const replaceImageColor = () => {
    isReplacingColorRef.current = true;

    const activeObject = canvasRef.current?.getActiveObject();
    if (!activeObject || activeObject.type !== "image" || !canvasRef.current) {
      toast.error("Vui lòng chọn một hình ảnh để thay đổi màu");
      isReplacingColorRef.current = false;
      return;
    }

    const imageObj = activeObject as CustomFabricImage;
    const imgElement = imageObj.getElement() as HTMLImageElement;

    if (!imgElement) {
      toast.error("Không thể truy cập dữ liệu hình ảnh");
      isReplacingColorRef.current = false;
      return;
    }

    const originalSrcToPreserve = imageObj.originalSrc || imageObj.getSrc();

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) {
      toast.error("Không thể tạo canvas tạm thời");
      isReplacingColorRef.current = false;
      return;
    }

    tempCanvas.width = imgElement.naturalWidth;
    tempCanvas.height = imgElement.naturalHeight;
    tempCtx.drawImage(imgElement, 0, 0);

    const imageData = tempCtx.getImageData(
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );
    const data = imageData.data;
    const targetRGB = hexToRgb(targetColor);
    const replacementRGB = hexToRgb(replacementColor);

    if (!targetRGB || !replacementRGB) {
      toast.error("Màu sắc không hợp lệ");
      isReplacingColorRef.current = false;
      return;
    }

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isColorWithinTolerance(r, g, b, targetRGB, colorTolerance)) {
        data[i] = replacementRGB.r;
        data[i + 1] = replacementRGB.g;
        data[i + 2] = replacementRGB.b;
      }
    }

    tempCtx.putImageData(imageData, 0, 0);

    fabric.Image.fromURL(tempCanvas.toDataURL(), (newImg) => {
      if (!canvasRef.current) return;

      const newCustomImg = newImg as CustomFabricImage;
      const oldCustomImg = imageObj as CustomFabricImage;

      newCustomImg.originalSrc = originalSrcToPreserve;
      newCustomImg.customId = oldCustomImg.customId;

      newCustomImg.set({
        left: imageObj.left,
        top: imageObj.top,
        scaleX: imageObj.scaleX,
        scaleY: imageObj.scaleY,
        angle: imageObj.angle,
        flipX: imageObj.flipX,
        flipY: imageObj.flipY,
        selectable: true,
        evented: true,
      });

      canvasRef.current.remove(imageObj);
      canvasRef.current.add(newCustomImg);
      canvasRef.current.setActiveObject(newCustomImg);
      canvasRef.current.requestRenderAll();
      saveState();

      toast.success("Đã thay đổi màu sắc thành công!");

      setTimeout(() => {
        isReplacingColorRef.current = false;
      }, 100);
    });
  };

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Helper function to check if color is within tolerance
  const isColorWithinTolerance = (
    r: number,
    g: number,
    b: number,
    target: { r: number; g: number; b: number },
    tolerance: number
  ) => {
    const deltaR = Math.abs(r - target.r);
    const deltaG = Math.abs(g - target.g);
    const deltaB = Math.abs(b - target.b);

    return deltaR <= tolerance && deltaG <= tolerance && deltaB <= tolerance;
  };

  // Image filter functions
  const applyFilter = (
    filterIndex: number,
    filter: fabric.IBaseFilter | null
  ) => {
    const obj = canvasRef.current?.getActiveObject();
    if (!obj || obj.type !== "image") return;

    const imageObj = obj as fabric.Image;
    if (!imageObj.filters) {
      imageObj.filters = [];
    }

    if (filter) {
      imageObj.filters[filterIndex] = filter;
    } else {
      // Remove the filter at this index
      imageObj.filters.splice(filterIndex, 1);
    }
    imageObj.applyFilters();
    canvasRef.current?.renderAll();
    saveState();
  };

  const applyFilterValue = (
    filterIndex: number,
    prop: string,
    value: string | number | number[]
  ) => {
    const obj = canvasRef.current?.getActiveObject();
    if (!obj || obj.type !== "image") return;

    const imageObj = obj as fabric.Image;
    if (imageObj.filters?.[filterIndex]) {
      (imageObj.filters[filterIndex] as unknown as Record<string, unknown>)[
        prop
      ] = value;
      imageObj.applyFilters();
      canvasRef.current?.renderAll();
      saveState();
    }
  };

  const clearAllFilters = () => {
    const obj = canvasRef.current?.getActiveObject();
    if (!obj || obj.type !== "image") return;

    const imageObj = obj as fabric.Image;
    imageObj.filters = [];
    imageObj.applyFilters();
    canvasRef.current?.renderAll();
    saveState();

    // Reset all filter states
    setActiveFilters({
      grayscale: false,
      invert: false,
      removeColor: false,
      sepia: false,
      brownie: false,
      brightness: false,
      contrast: false,
      saturation: false,
      vibrance: false,
      noise: false,
      vintage: false,
      pixelate: false,
      blur: false,
      sharpen: false,
      emboss: false,
      technicolor: false,
      polaroid: false,
      blendColor: false,
      gamma: false,
      kodachrome: false,
      blackwhite: false,
      hue: false,
    });
  };

  const handleDoubleClick = (e: fabric.IEvent) => {
    const target = e.target;
    if (target && target.type === "image" && !isCropping) {
      prepareCrop(target as fabric.Image);
    }
  };

  // Danh sách màu gợi ý
  // (Đã chuyển vào BackgroundColorPanel)

  // Thêm useEffect để lấy số lượng canvas khi component mount
  useEffect(() => {
    console.log(location.state, "location.state");

    const hasCanvasId = location.state?.canvasId;

    if (hasCanvasId) {
      // ✅ Không load canvas data ở đây nữa, sẽ load sau khi canvas khởi tạo
      console.log(
        "Có canvasId trong location.state, sẽ load sau khi canvas khởi tạo"
      );
      return;
    }

    // If no canvasId, fetch canvas count for new canvas
    const fetchCanvasCount = async () => {
      try {
        const data = await getCanvasHistory({ page: 1, size: 100 });
        const totalCount =
          data?.responseRequestModel?.responseList?.totalItems || 0;
        setTotalCanvasCount(totalCount);
        setCurrentCanvasTitle(`Thiết kế ${totalCount + 1}`);
      } catch {
        setCurrentCanvasTitle("Thiết kế mới");
      }
    };

    fetchCanvasCount();
  }, [getCanvasHistory, location.state]);

  // Initial canvas & events setup
  useEffect(() => {
    if (!htmlCanvasRef.current) return;

    // ✅ Chỉ khởi tạo canvas nếu chưa có
    if (canvasRef.current) {
      console.log("Canvas đã tồn tại, chỉ cập nhật background color");
      const currentBg = canvasRef.current.backgroundColor ?? backgroundColor;
      canvasRef.current.setBackgroundColor(currentBg, () => {
        canvasRef.current?.renderAll();
      });
      return;
    }

    // Lấy width/height từ state hoặc mặc định
    const initialSize = getInitialCanvasSize();
    const width = Number(actualCanvasWidth) || initialSize.width;
    const height = Number(actualCanvasHeight) || initialSize.height;

    htmlCanvasRef.current.width = width;
    htmlCanvasRef.current.height = height;

    try {
      const canvas = new fabric.Canvas(htmlCanvasRef.current, {
        backgroundColor: backgroundColor,
        width,
        height,
      });

      // Ensure canvas is properly initialized
      if (!canvas || !canvas.getContext()) {
        console.error("Failed to initialize canvas");
        return;
      }

      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;

      // Use setTimeout to ensure canvas is ready before rendering
      setTimeout(() => {
        try {
          if (canvas && canvas.getContext()) {
            canvas.renderAll();
          }
        } catch (error) {
          console.error("Error rendering canvas:", error);
        }
      }, 0);

      canvasRef.current = canvas;

      // ✅ Debug khi khởi tạo canvas
      console.log("Khởi tạo canvas - Số object:", canvas.getObjects().length);

      // ✅ Đánh dấu canvas đã được khởi tạo
      setIsCanvasInitialized(true);

      saveInitialState();

      // Extend fabric.Object to include custom properties in JSON output
      fabric.Object.prototype.toObject = (function (toObject) {
        return function (this: fabric.Object, propertiesToInclude) {
          propertiesToInclude = (propertiesToInclude || []).concat([
            "customId",
            "originalSrc",
          ]);
          return toObject.call(this, propertiesToInclude);
        };
      })(fabric.Object.prototype.toObject);

      const handleSelectionChange = () => {
        if (isReplacingColorRef.current) return;

        const activeObject = canvasRef.current?.getActiveObject();
        if (activeObject && activeObject.type === "image") {
          const customImg = activeObject as CustomFabricImage;
          let imageId = customImg.customId;
          // Assign an ID if it's missing (e.g., for pasted or newly created objects)
          if (!imageId) {
            imageId = `img_${Date.now()}_${Math.random()}`;
            customImg.customId = imageId;
          }
          setCurrentSelectedImageId(imageId);
        } else {
          setCurrentSelectedImageId(null);
        }
      };

      // Selection events for smart toolbar
      canvas.on("selection:created", (e) => {
        handleSelectionChange();
        if (e.selected && e.selected.length > 0) {
          if (canvas.getActiveObject() instanceof fabric.ActiveSelection) {
            // ✅ Hiển thị toolbar khi chọn nhiều đối tượng
            setToolbarVisible(true);
            setActiveText(null);
            // Update toolbar position for the selection
            const activeObj = canvas.getActiveObject();
            if (activeObj) {
              updateToolbarPos(activeObj);
            }
          } else {
            handleSelection(e.selected[0]);
          }
        }
      });

      canvas.on("selection:updated", (e) => {
        handleSelectionChange();
        if (e.selected && e.selected.length > 0) {
          if (canvas.getActiveObject() instanceof fabric.ActiveSelection) {
            // ✅ Hiển thị toolbar khi chọn nhiều đối tượng
            setToolbarVisible(true);
            setActiveText(null);
            // Update toolbar position for the selection
            const activeObj = canvas.getActiveObject();
            if (activeObj) {
              updateToolbarPos(activeObj);
            }
          } else {
            handleSelection(e.selected[0]);
          }
        }
      });

      canvas.on("selection:cleared", () => {
        handleSelectionChange();
        setToolbarVisible(false);
        setActiveText(null);
      });

      canvas.on("mouse:up", () => (isDrawing || isErasing) && saveState());
      canvas.on("object:added", () => !isRestoringRef.current && saveState());
      canvas.on("object:modified", saveState);
      canvas.on("object:moving", (e) => {
        if (e.target) updateToolbarPos(e.target);
      });

      // ✅ Thêm events cho scaling và rotating để update toolbar position
      canvas.on("object:scaling", (e) => {
        if (e.target) updateToolbarPos(e.target);
      });

      canvas.on("object:rotating", (e) => {
        if (e.target) updateToolbarPos(e.target);
      });

      // Add double-click event for image cropping
      canvas.on("mouse:dblclick", handleDoubleClick);

      document.addEventListener("keydown", handleKeyDown);

      // Add event listener for createNewCanvas
      const handleCreateNewCanvas = () => {
        createNewCanvas();
      };
      window.addEventListener("createNewCanvas", handleCreateNewCanvas);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("createNewCanvas", handleCreateNewCanvas);
        if (canvas && typeof canvas.dispose === "function") {
          try {
            canvas.dispose();
          } catch (error) {
            console.error("Error disposing canvas:", error);
          }
        }
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
  }, []); // ✅ Bỏ backgroundColor khỏi dependency

  // Sync brush properties when they change
  useEffect(() => {
    if (canvasRef.current) {
      try {
        // Ensure canvas context exists
        if (!canvasRef.current.getContext()) {
          console.error(
            "Canvas context is null when updating brush properties"
          );
          return;
        }
        canvasRef.current.freeDrawingBrush.color = brushColor;
        canvasRef.current.freeDrawingBrush.width = brushWidth;
      } catch (error) {
        console.error("Error updating brush properties:", error);
      }
    }
  }, [brushColor, brushWidth]);

  // Sync eraser properties when they change
  useEffect(() => {
    if (canvasRef.current) {
      try {
        // Ensure canvas context exists
        if (!canvasRef.current.getContext()) {
          console.error(
            "Canvas context is null when updating eraser properties"
          );
          return;
        }
        // Set drawing mode based on whether drawing or erasing is active
        canvasRef.current.isDrawingMode = isDrawing || isErasing;

        if (isErasing) {
          // Set eraser brush (white brush to erase)
          canvasRef.current.freeDrawingBrush.color = "#ffffff";
          canvasRef.current.freeDrawingBrush.width = eraserWidth;
        } else if (isDrawing) {
          // Set normal brush
          canvasRef.current.freeDrawingBrush.color = brushColor;
          canvasRef.current.freeDrawingBrush.width = brushWidth;
        }
        canvasRef.current.renderAll();
      } catch (error) {
        console.error("Error updating eraser properties:", error);
      }
    }
  }, [isErasing, isDrawing, eraserWidth, brushColor, brushWidth]);

  useEffect(() => {
    const prevUnit = unitRef.current;
    if (prevUnit === unit) return;

    const widthPx = convertToPixels(
      parseFloat(canvasWidthInput) || 0,
      prevUnit
    );
    const heightPx = convertToPixels(
      parseFloat(canvasHeightInput) || 0,
      prevUnit
    );

    const newWidth =
      unit === "px" ? widthPx : widthPx / convertToPixels(1, unit);
    const newHeight =
      unit === "px" ? heightPx : heightPx / convertToPixels(1, unit);

    setCanvasWidthInput(newWidth.toFixed(3));
    setCanvasHeightInput(newHeight.toFixed(3));

    unitRef.current = unit;
  }, [unit]);

  useEffect(() => {
    updateScaleRatio();
  }, [canvasWidthInput, canvasHeightInput, unit]);

  useEffect(() => {
    window.addEventListener("resize", updateScaleRatio);
    return () => window.removeEventListener("resize", updateScaleRatio);
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasWrapperRef.current && canvasRef.current) {
        try {
          const { clientWidth, clientHeight } = canvasWrapperRef.current;

          // Ensure canvas context exists
          if (!canvasRef.current.getContext()) {
            console.error("Canvas context is null during resize");
            return;
          }

          // ✅ Debug resize canvas
          console.log("Resize canvas called:", {
            clientWidth,
            clientHeight,
            currentObjects: canvasRef.current.getObjects().length,
          });

          canvasRef.current.setWidth(clientWidth);
          canvasRef.current.setHeight(clientHeight);
          canvasRef.current.renderAll();

          // ✅ Debug sau khi resize
          console.log(
            "Sau khi resize - Số object:",
            canvasRef.current.getObjects().length
          );
        } catch (error) {
          console.error("Error resizing canvas:", error);
        }
      }
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const createNewCanvas = async () => {
    const width = parseFloat(canvasWidthInput);
    const height = parseFloat(canvasHeightInput);

    if (unit === "cm" && (width < 1.058 || width > 211.664)) {
      toast.error("Chiều rộng phải từ 1,058cm đến 211,664cm");
      return;
    }

    if (unit === "cm" && (height < 1.058 || height > 83.336)) {
      toast.error("Chiều cao phải từ 1,058cm đến 83,336cm");
      return;
    }

    // Reset canvas ID when creating new canvas
    setCurrentCanvasId("");

    // Fetch latest canvas count before creating new canvas
    try {
      const data = await getCanvasHistory({ page: 1, size: 100 });
      const latestCount =
        data?.responseRequestModel?.responseList?.totalItems || 0;
      setTotalCanvasCount(latestCount);
      setCurrentCanvasTitle(`Thiết kế ${latestCount + 1}`);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng thiết kế:", error);
      setCurrentCanvasTitle(`Thiết kế ${totalCanvasCount + 1}`);
    }

    setActualCanvasWidth(canvasWidthInput);
    setActualCanvasHeight(canvasHeightInput);

    const widthPx = convertToPixels(width, unit);
    const heightPx = convertToPixels(height, unit);

    if (!canvasRef.current || !canvasWrapperRef.current) return;

    // ✅ Debug trước khi xóa objects
    console.log(
      "Trước khi xóa - Số object:",
      canvasRef.current.getObjects().length
    );

    canvasRef.current.setWidth(widthPx);
    canvasRef.current.setHeight(heightPx);
    // Preserve gradient or solid background when resizing
    const currentBg = canvasRef.current.backgroundColor ?? backgroundColor;
    canvasRef.current.setBackgroundColor(currentBg, () => {
      canvasRef.current?.renderAll();
    });
    // canvasRef.current.renderAll(); // <-- Xóa dòng này nếu đã render trong callback trên

    // ✅ Debug sau khi xóa objects
    console.log(
      "Sau khi xóa - Số object:",
      canvasRef.current.getObjects().length
    );

    // ✅ Set lại màu nền đúng cách (giữ nội dung)
    canvasRef.current.setBackgroundColor(backgroundColor, () => {
      canvasRef.current?.renderAll();
    });

    // canvasRef.current.clear();
    // canvasRef.current.backgroundColor = backgroundColor;

    // Maintain brush properties
    if (isErasing) {
      canvasRef.current.freeDrawingBrush.color = "#ffffff";
      canvasRef.current.freeDrawingBrush.width = eraserWidth;
    } else {
      canvasRef.current.freeDrawingBrush.color = brushColor;
      canvasRef.current.freeDrawingBrush.width = brushWidth;
    }

    canvasRef.current.renderAll();

    canvasWrapperRef.current.style.width = `${widthPx}px`;
    canvasWrapperRef.current.style.height = `${heightPx}px`;

    saveInitialState();

    // toast.success(`Đã tạo thiết kế mới ${width}x${height} ${unit}`);
  };

  // Zoom state: default is fit-to-parent (Fix Window)
  const [zoom, setZoom] = useState(1);
  const [isFullWindow, setIsFullWindow] = useState(false);
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);

  // Zoom in/out handlers using Fabric.js zoom
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 5);
    setZoom(newZoom);
    zoomCanvasSmooth(newZoom, 200);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    setZoom(newZoom);
    zoomCanvasSmooth(newZoom, 200);
  };

  const handleResetZoom = () => {
    setZoom(1);
    if (canvasWrapperRef.current) {
      // Reset CSS transform
      canvasWrapperRef.current.style.transform = "scale(1)";
      canvasWrapperRef.current.style.transformOrigin = "center center";
    }
  };

  const handleZoomSelect = (zoomLevel: number) => {
    const newZoom = zoomLevel / 100;
    // Đảm bảo giá trị chính xác bằng cách làm tròn
    const roundedZoom = Math.round(newZoom * 1000) / 1000;
    setZoom(roundedZoom);
    zoomCanvasSmooth(roundedZoom, 200);
    setShowZoomDropdown(false);
  };

  const isZoomLevelActive = (zoomLevel: number) => {
    const currentZoomPercent = Math.round(zoom * 100);
    // So sánh chính xác sau khi làm tròn, với tolerance nhỏ cho floating point
    return Math.abs(currentZoomPercent - zoomLevel) < 0.1;
  };
  const handleFixWindow = () => {
    setIsFullWindow(false);
    updateScaleRatio();

    // Reset zoom and CSS transform when fixing window
    setZoom(1);
    if (canvasWrapperRef.current) {
      canvasWrapperRef.current.style.transform = "scale(1)";
      canvasWrapperRef.current.style.transformOrigin = "center center";
    }

    if (canvasWrapperRef.current && canvasRef.current) {
      const width = convertToPixels(parseFloat(actualCanvasWidth) || 0, unit);
      const height = convertToPixels(parseFloat(actualCanvasHeight) || 0, unit);
      canvasWrapperRef.current.style.width = `${width}px`;
      canvasWrapperRef.current.style.height = `${height}px`;
      canvasRef.current.setWidth(width);
      canvasRef.current.setHeight(height);
      canvasRef.current.requestRenderAll();
    }
  };
  const handleFullWindow = () => {
    setIsFullWindow(true);
    const newZoom = 0.94; // Set zoom to 94%
    setZoom(newZoom);
    zoomCanvasFromCenter(newZoom);

    if (canvasWrapperRef.current && canvasRef.current) {
      const parent = canvasWrapperRef.current.parentElement;
      if (parent) {
        const newWidth = parent.clientWidth * 0.94;
        const newHeight = parent.clientHeight * 0.94;

        canvasWrapperRef.current.style.width = `${newWidth}px`;
        canvasWrapperRef.current.style.height = `${newHeight}px`;

        canvasRef.current.setWidth(newWidth);
        canvasRef.current.setHeight(newHeight);
        canvasRef.current.requestRenderAll();
      }
    }
  };

  // Remove the useEffect that syncs zoom to canvas since we're handling it directly in zoom handlers

  // Handle mouse wheel zoom
  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
      setZoom(newZoom);

      zoomToPoint(newZoom);
    }
  };

  // Add wheel event listener
  useEffect(() => {
    const canvasElement = htmlCanvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        canvasElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, [zoom]);

  // On isFullWindow change, if false, recalc fit
  useEffect(() => {
    if (!isFullWindow) {
      updateScaleRatio();
    }
  }, [isFullWindow]);

  // updateScaleRatio: fit canvas to parent (Fix Window)
  const updateScaleRatio = () => {
    if (!canvasRef.current || !canvasWrapperRef.current) return;

    const wrapperParent = canvasWrapperRef.current.parentElement;
    if (!wrapperParent) return;

    const parentWidth = wrapperParent.clientWidth;
    const parentHeight = wrapperParent.clientHeight;

    const canvasWidth = convertToPixels(
      parseFloat(actualCanvasWidth) || 0,
      unit
    );
    const canvasHeight = convertToPixels(
      parseFloat(actualCanvasHeight) || 0,
      unit
    );

    const widthRatio = parentWidth / canvasWidth;
    const heightRatio = parentHeight / canvasHeight;

    const ratio = Math.min(widthRatio, heightRatio, 1);

    setZoom(ratio);
    setIsFullWindow(false);

    // Set canvas size
    canvasWrapperRef.current.style.width = `${canvasWidth}px`;
    canvasWrapperRef.current.style.height = `${canvasHeight}px`;

    // Apply CSS transform zoom
    if (canvasWrapperRef.current) {
      canvasWrapperRef.current.style.transform = `scale(${ratio})`;
      canvasWrapperRef.current.style.transformOrigin = "center center";
    }

    setScaleRatio(ratio);
  };

  // On mount, default to fit window
  useEffect(() => {
    handleFixWindow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelection = (obj: fabric.Object) => {
    setToolbarVisible(true);
    updateToolbarPos(obj);

    // Lưu lại index hiện tại của object
    const currentIndex = getObjectIndex(obj);

    if (obj.type === "i-text") {
      // ✅ Auto convert sang Textbox luôn khi select
      convertToTextbox(obj as fabric.IText);
      return;
    }

    if (obj.type === "textbox") {
      const textObj = obj as fabric.Textbox;
      setActiveText(textObj);
      setTextProperties({
        fontFamily: textObj.fontFamily || "Arial",
        fontSize: textObj.fontSize || 20,
        fill: (textObj.fill as string) || "#000000",
        fontWeight: String(textObj.fontWeight || "normal"),
        fontStyle: textObj.fontStyle || "normal",
        textAlign: textObj.textAlign || "center",
        underline: textObj.underline || false,
      });
    } else {
      setActiveText(null);
    }

    // ✅ Đảm bảo object vẫn ở đúng layer sau khi select
    if (canvasRef.current && currentIndex !== -1) {
      // Đợi 1 tick để đảm bảo các thao tác khác đã hoàn thành
      setTimeout(() => {
        if (canvasRef.current) {
          obj.moveTo(currentIndex);
          canvasRef.current.setActiveObject(obj);
          canvasRef.current.renderAll();
        }
      }, 0);
    }
  };

  const getObjectIndex = (obj: fabric.Object) => {
    if (!canvasRef.current) return -1;
    return canvasRef.current.getObjects().indexOf(obj);
  };

  const isAtTop = (obj: fabric.Object) => {
    if (!canvasRef.current) return false;
    const objects = canvasRef.current.getObjects();
    return getObjectIndex(obj) === objects.length - 1;
  };

  const isAtBottom = (obj: fabric.Object) => {
    if (!canvasRef.current) return false;
    return getObjectIndex(obj) === 0;
  };

  const convertToTextbox = (iTextObj: fabric.IText) => {
    const index = getObjectIndex(iTextObj);

    const textbox = new fabric.Textbox(iTextObj.text || "", {
      left: iTextObj.left,
      top: iTextObj.top,
      width: Math.max(iTextObj.width || 0, 150),
      fontSize: iTextObj.fontSize,
      fontFamily: iTextObj.fontFamily,
      fontStyle: iTextObj.fontStyle,
      fontWeight: String(iTextObj.fontWeight || "normal"),
      fill: iTextObj.fill,
      textAlign: iTextObj.textAlign || "center",
      underline: iTextObj.underline,
      padding: 10,
    });

    canvasRef.current?.remove(iTextObj);
    canvasRef.current?.add(textbox);

    setTimeout(() => {
      if (canvasRef.current) {
        textbox.moveTo(index);
        canvasRef.current.setActiveObject(textbox);
        canvasRef.current.renderAll();
      }
    }, 0);

    setActiveText(textbox);
    setTextProperties({
      fontFamily: textbox.fontFamily || "Arial",
      fontSize: textbox.fontSize || 20,
      fill: (textbox.fill as string) || "#000000",
      fontWeight: String(textbox.fontWeight || "normal"),
      fontStyle: textbox.fontStyle || "normal",
      textAlign: textbox.textAlign || "center",
      underline: textbox.underline || false,
    });

    saveState();
  };

  const updateToolbarPos = (obj: fabric.Object) => {
    if (!canvasRef.current || !canvasWrapperRef.current || !toolbarRef.current)
      return;

    // Đảm bảo object có coordinates được cập nhật
    obj.setCoords();

    // Lấy bounding rect của object (bao gồm cả transform)
    const bound = obj.getBoundingRect(true, true);

    // Tính toán vị trí toolbar: ngay trên object (viền trên)
    const centerX = bound.left + bound.width / 2; // Tâm theo trục X
    const topY = bound.top; // Viền trên theo trục Y

    // Lấy vị trí của canvas wrapper để tính toán tọa độ tương đối
    const wrapperRect = canvasWrapperRef.current.getBoundingClientRect();

    // Lấy canvas element để tính toán vị trí thực tế
    const canvas = canvasRef.current;
    const canvasElement = canvas.getElement();
    const canvasRect = canvasElement.getBoundingClientRect();

    // Tính toán vị trí toolbar dựa trên vị trí thực tế của canvas
    // Chuyển đổi tọa độ canvas sang tọa độ screen
    const canvasLeft = canvasRect.left;
    const canvasTop = canvasRect.top;
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;

    // Tính toán tỷ lệ scale giữa canvas thực tế và canvas logic
    const scaleX = canvasWidth / canvas.getWidth();
    const scaleY = canvasHeight / canvas.getHeight();

    // Chuyển đổi tọa độ canvas sang tọa độ screen
    const screenX = canvasLeft + centerX * scaleX;
    const screenY = canvasTop + topY * scaleY;

    // Tính toán vị trí toolbar tương đối với wrapper
    const toolbarX = screenX - wrapperRect.left - 141.5; // toolbarWidth / 2 = 283 / 2 = 141.5
    const toolbarY = screenY - wrapperRect.top - 120; // Offset 120px lên trên

    setToolbarPos({
      x: toolbarX,
      y: toolbarY,
    });

    // Thêm setTimeout để đảm bảo toolbar được render và căn giữa chính xác
    setTimeout(() => {
      if (toolbarRef.current) {
        const actualToolbarWidth = toolbarRef.current.offsetWidth;
        if (actualToolbarWidth && actualToolbarWidth !== 283) {
          // Nếu toolbar width khác với dự đoán, tính toán lại
          const correctedToolbarX =
            screenX - wrapperRect.left - actualToolbarWidth / 2;
          setToolbarPos({
            x: correctedToolbarX,
            y: toolbarY,
          });
        }
      }
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      redo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      e.preventDefault();
      // ✅ Select all objects
      if (canvasRef.current) {
        const allObjects = canvasRef.current.getObjects();
        if (allObjects.length > 0) {
          canvasRef.current.discardActiveObject();
          const selection = new fabric.ActiveSelection(allObjects, {
            canvas: canvasRef.current,
          });
          canvasRef.current.setActiveObject(selection);
          canvasRef.current.requestRenderAll();
        }
      }
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      removeSelected();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      e.preventDefault();
      copySelected();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
      e.preventDefault();
      pasteClipboard();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
      e.preventDefault();
      if (e.shiftKey) {
        // Ctrl+Shift+G for ungroup
        ungroupObjects();
      } else {
        // Ctrl+G for group
        groupObjects();
      }
    }

    // Arrow keys for panning canvas
    if (e.key === "ArrowUp") {
      e.preventDefault();
      panCanvas(0, -20);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      panCanvas(0, 20);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      panCanvas(-20, 0);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      panCanvas(20, 0);
    }
  };

  const cloneObject = (obj: fabric.Object): Promise<fabric.Object> => {
    return new Promise((resolve) => {
      obj.clone((clonedObj: fabric.Object) => {
        resolve(clonedObj);
      });
    });
  };

  const copySelected = async () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (!activeObject) return;

    pasteCountRef.current = 0; // Reset khi copy mới

    if (activeObject.type === "activeSelection") {
      const selection = activeObject as fabric.ActiveSelection;
      // Sử dụng getBoundingRect với tọa độ chuẩn của Fabric.js
      const bbox = activeObject.getBoundingRect(true, true);

      const objects = selection.getObjects().map((obj) => {
        // Tính toán vị trí tương đối sử dụng tọa độ chuẩn
        const relLeft = (obj.left || 0) - bbox.left;
        const relTop = (obj.top || 0) - bbox.top;
        return { obj, relLeft, relTop };
      });

      clipboardRef.current = { objects, bbox };
      console.log("📋 Copied activeSelection:", clipboardRef.current);
    } else {
      const cloned = await cloneObject(activeObject);
      clipboardRef.current = cloned;
      console.log("📋 Copied single object:", clipboardRef.current);
    }
  };

  const pasteClipboard = () => {
    if (!clipboardRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const pasteOffset = 20 * (pasteCountRef.current + 1);

    if ("objects" in clipboardRef.current) {
      const { objects, bbox } = clipboardRef.current;

      const clonedObjects: fabric.Object[] = [];
      objects.forEach(({ obj, relLeft, relTop }) => {
        obj.clone((clonedObj: fabric.Object) => {
          // Sử dụng tọa độ chuẩn của Fabric.js
          clonedObj.set({
            left: bbox.left + relLeft + pasteOffset,
            top: bbox.top + relTop + pasteOffset,
            evented: true,
          });

          // Cập nhật tọa độ sau khi set position
          clonedObj.setCoords();

          canvas.add(clonedObj);
          clonedObjects.push(clonedObj);

          // Khi clone xong tất cả object thì set selection
          if (clonedObjects.length === objects.length) {
            const selection = new fabric.ActiveSelection(clonedObjects, {
              canvas,
            });
            canvas.setActiveObject(selection);
            canvas.requestRenderAll();
            saveState();
          }
        });
      });
    } else {
      const obj = clipboardRef.current;
      obj.clone((clonedObj: fabric.Object) => {
        // Sử dụng tọa độ chuẩn của Fabric.js
        clonedObj.set({
          left: (clonedObj.left || 0) + pasteOffset,
          top: (clonedObj.top || 0) + pasteOffset,
          evented: true,
        });

        // Cập nhật tọa độ sau khi set position
        clonedObj.setCoords();

        canvas.add(clonedObj);
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
        saveState();
      });
    }

    pasteCountRef.current += 1;
  };

  const startDrag = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartPos.current = {
      x: e.clientX - toolbarPos.x,
      y: e.clientY - toolbarPos.y,
    };
  };

  const stopDrag = () => {
    setDragging(false);
    dragStartPos.current = null;
  };

  const onDrag = (e: MouseEvent) => {
    if (dragging && dragStartPos.current) {
      setToolbarPos({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    }
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    } else {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    }
    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  const loadCanvasFromDescription = (
    canvasDescription: string,
    canvasTitle: string,
    canvasId: string
  ) => {
    console.log("loadCanvasFromDescription called with:", {
      canvasId,
      canvasTitle,
      hasCanvasId: !!canvasId,
      descriptionLength: canvasDescription?.length,
    });

    if (!canvasRef.current) {
      console.error("Thiết kế ref không khả dụng");
      return;
    }

    if (!canvasId) {
      console.error("Canvas ID is missing");
      toast.error("Không tìm thấy thông tin thiết kế");
      return;
    }

    isRestoringRef.current = true;
    const safeJson = sanitizeCanvasJSON(canvasDescription);
    const jsonObj = JSON.parse(safeJson);
    canvasRef.current.loadFromJSON(safeJson, () => {
      if (jsonObj.width && jsonObj.height && canvasRef.current) {
        canvasRef.current.setWidth(jsonObj.width);
        canvasRef.current.setHeight(jsonObj.height);
        setActualCanvasWidth(jsonObj.width.toString());
        setActualCanvasHeight(jsonObj.height.toString());
      }
      // ... các xử lý khác ...
    });

    try {
      canvasRef.current.loadFromJSON(safeJson, () => {
        const canvas = canvasRef.current!;

        // Ensure all loaded images have a custom ID
        canvas.forEachObject((obj) => {
          if (obj.type === "image") {
            const customImg = obj as CustomFabricImage;
            if (!customImg.customId) {
              customImg.customId = `img_${Date.now()}_${Math.random()}`;
            }
          }
        });

        // ✅ Sau khi load JSON → set lại màu nền (nếu có)
        // if (backgroundColor) {
        //   canvas.setBackgroundColor(backgroundColor, () => {
        //     canvas.renderAll();
        //   });
        // } else {
        //   canvas.renderAll();
        // }

        // ✅ Restore brush config
        if (isErasing) {
          canvas.freeDrawingBrush.color = "#ffffff";
          canvas.freeDrawingBrush.width = eraserWidth;
        } else {
          canvas.freeDrawingBrush.color = brushColor;
          canvas.freeDrawingBrush.width = brushWidth;
        }

        isRestoringRef.current = false;

        // ✅ Update state
        setCurrentCanvasTitle(canvasTitle);
        setCurrentCanvasId(canvasId);
        setEditingTitle(canvasTitle);
        setIsEditingTitle(false);

        console.log("Thiết kế đã được tải thành công:", {
          canvasId,
          canvasTitle,
          currentCanvasId: canvasId,
        });

        // toast.success("Đã tải thiết kế thành công!");
      });
    } catch (error) {
      console.error("Error loading thiết kế:", error);
      toast.error("Có lỗi xảy ra khi tải thiết kế");
      isRestoringRef.current = false;
    }
  };

  // Move saveInitialState definition up here
  const saveInitialState = () => {
    if (!canvasRef.current) return;
    const current = JSON.stringify(canvasRef.current);
    historyRef.current = { states: [current], index: 0 };
    // ✅ Debug khi save initial state
    console.log(
      "Save initial state - Số object:",
      canvasRef.current.getObjects().length
    );
  };

  const saveState = () => {
    if (isRestoringRef.current || !canvasRef.current) return;
    const current = JSON.stringify(canvasRef.current);
    const { states, index } = historyRef.current;
    if (states[index] === current) return;
    const newStates = states.slice(0, index + 1);
    newStates.push(current);
    historyRef.current = { states: newStates, index: newStates.length - 1 };
  };

  const undo = () => {
    const { states, index } = historyRef.current;
    if (index > 0 && canvasRef.current) {
      isRestoringRef.current = true;
      canvasRef.current.loadFromJSON(states[index - 1], () => {
        // Maintain brush properties after restoration
        if (isErasing) {
          canvasRef.current!.freeDrawingBrush.color = "#ffffff";
          canvasRef.current!.freeDrawingBrush.width = eraserWidth;
        } else {
          canvasRef.current!.freeDrawingBrush.color = brushColor;
          canvasRef.current!.freeDrawingBrush.width = brushWidth;
        }

        canvasRef.current?.renderAll();
        historyRef.current.index = index - 1;

        // ✅ Giữ lại selected object nếu có
        if (canvasRef.current) {
          const activeObj = canvasRef.current.getObjects().at(-1);
          if (activeObj) {
            canvasRef.current.setActiveObject(activeObj);
            canvasRef.current.fire("selection:updated", {
              selected: [activeObj],
            });
          }
        }

        isRestoringRef.current = false;
      });
    }
  };

  const redo = () => {
    const { states, index } = historyRef.current;
    if (index < states.length - 1 && canvasRef.current) {
      isRestoringRef.current = true;
      canvasRef.current.loadFromJSON(states[index + 1], () => {
        // Maintain brush properties after restoration
        if (isErasing) {
          canvasRef.current!.freeDrawingBrush.color = "#ffffff";
          canvasRef.current!.freeDrawingBrush.width = eraserWidth;
        } else {
          canvasRef.current!.freeDrawingBrush.color = brushColor;
          canvasRef.current!.freeDrawingBrush.width = brushWidth;
        }

        canvasRef.current?.renderAll();
        historyRef.current.index = index + 1;

        // ✅ Giữ lại selected object nếu có
        if (canvasRef.current) {
          const activeObj = canvasRef.current.getObjects().at(-1);
          if (activeObj) {
            canvasRef.current.setActiveObject(activeObj);
            canvasRef.current.fire("selection:updated", {
              selected: [activeObj],
            });
          }
        }

        isRestoringRef.current = false;
      });
    }
  };

  const uploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(
        f.target?.result as string,
        (img) => {
          const customImg = img as CustomFabricImage;
          customImg.customId = `img_${Date.now()}_${Math.random()}`; // Add custom ID
          img.scaleToWidth(200);
          img.scaleToHeight(200);
          img.set({ left: 100, top: 100, selectable: true });
          canvasRef.current?.add(img);
          canvasRef.current?.setActiveObject(img);
          canvasRef.current?.bringToFront(img);
          saveState();
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
  };

  const removeSelected = () => {
    const activeObject = canvasRef.current?.getActiveObject();

    if (activeObject) {
      if (activeObject.type === "activeSelection") {
        // ✅ Xóa nhiều object trong selection
        const selection = activeObject as fabric.ActiveSelection;
        selection.forEachObject((obj) => {
          canvasRef.current?.remove(obj);
        });
        canvasRef.current?.discardActiveObject();
      } else {
        canvasRef.current?.remove(activeObject);
      }

      canvasRef.current?.requestRenderAll();
      saveState();
    }
  };

  const saveCanvasAsPNG = () => {
    const dataURL = canvasRef.current?.toDataURL({ format: "png" });
    if (dataURL) {
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas.png";
      link.click();
    }
  };

  const handleUpdateTitle = async () => {
    console.log("handleUpdateTitle called with:", {
      currentCanvasId,
      editingTitle,
      trimmedTitle: editingTitle.trim(),
      isEmpty: !editingTitle.trim(),
      isNewCanvas: !currentCanvasId,
    });

    // Kiểm tra title sau khi trim
    const trimmedTitle = editingTitle.trim();
    if (!trimmedTitle) {
      toast.error("Tiêu đề không được để trống");
      return;
    }

    // Nếu title không thay đổi thì không cần update
    if (trimmedTitle === currentCanvasTitle) {
      setIsEditingTitle(false);
      return;
    }

    try {
      if (!currentCanvasId) {
        // console.log("Updating title for new canvas");
        // For new canvas, just update the title locally
        setCurrentCanvasTitle(trimmedTitle);
        setIsEditingTitle(false);
        return;
      }

      // console.log("Updating title for existing canvas:", currentCanvasId);

      // Get current canvas data
      const canvasData = canvasRef.current?.toJSON();
      if (!canvasData) {
        toast.error("Không thể lấy dữ liệu thiết kế");
        return;
      }

      if (canvasRef.current) {
        // @ts-expect-error: allow dynamic property for serialization
        canvasData.width = canvasRef.current.getWidth();
        // @ts-expect-error: allow dynamic property for serialization
        canvasData.height = canvasRef.current.getHeight();
      }
      const canvasDescription = JSON.stringify(canvasData);

      // Update existing canvas with correct format
      const response = await putCanvas({
        canvasInfoId: currentCanvasId,
        canvasTitle: trimmedTitle,
        canvasDescription: canvasDescription,
        isLatest: true,
      });

      // Check if update was successful
      if (!response?.isSuccess) {
        throw new Error(response?.message || "Cập nhật thất bại");
      }

      setCurrentCanvasTitle(trimmedTitle);
      setIsEditingTitle(false);
      toast.success("Đã cập nhật tiêu đề thành công");

      // Dispatch event để cập nhật danh sách canvas
      window.dispatchEvent(new CustomEvent("canvasSaved"));
    } catch (err: unknown) {
      console.error("Error updating title:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi cập nhật tiêu đề";
      toast.error(errorMessage);
      setEditingTitle(currentCanvasTitle);
      setIsEditingTitle(false);
    }
  };

  const saveCanvasAsJSON = async () => {
    if (!canvasRef.current) return;
    const canvasJson = canvasRef.current.toJSON();
    if (canvasRef.current) {
      // @ts-expect-error: allow dynamic property for serialization
      canvasJson.width = canvasRef.current.getWidth();
      // @ts-expect-error: allow dynamic property for serialization
      canvasJson.height = canvasRef.current.getHeight();
    }
    const canvasDescription = JSON.stringify(canvasJson);
    console.log("Saving canvas:", {
      currentCanvasId,
      currentCanvasTitle,
      hasCanvasId: !!currentCanvasId,
    });

    try {
      // Luôn dùng putCanvas, nếu chưa có currentCanvasId thì tạo mới trước
      let canvasIdToUse = currentCanvasId;
      const canvasFolderId =
        location.state?.folderId || location.state?.canvasFolderId;
      if (!canvasIdToUse) {
        // Nếu chưa có ID, cần tạo mới trước (vẫn phải dùng postCanvas để lấy ID)
        // Không truyền 'default-folder', chỉ truyền nếu có GUID thật
        const postBody = {
          canvasTitle: currentCanvasTitle,
          canvasDescription,
          canvasFolderId: canvasFolderId ?? undefined,
        };
        const response = await postCanvas(postBody);
        if (!response?.isSuccess) {
          throw new Error(response?.message || "Tạo mới thất bại");
        }
        if (response?.responseRequestModel?.canvasInfoId) {
          canvasIdToUse = response.responseRequestModel.canvasInfoId;
          setCurrentCanvasId(canvasIdToUse);
        } else {
          throw new Error("Không nhận được canvasInfoId sau khi tạo mới");
        }
      }
      // Sau khi đã có ID, luôn dùng putCanvas để cập nhật
      const putBody = {
        canvasInfoId: canvasIdToUse,
        canvasTitle: currentCanvasTitle,
        canvasDescription,
        isLatest: true,
        canvasFolderId: canvasFolderId ?? undefined,
      };
      const putResponse = await putCanvas(putBody);
      if (!putResponse?.isSuccess) {
        throw new Error(putResponse?.message || "Cập nhật thất bại");
      }

      // const blob = new Blob([canvasDescription], { type: "application/json" });
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = "canvas.json";
      // link.click();

      // Dispatch event khi lưu thành công
      window.dispatchEvent(new CustomEvent("canvasSaved"));

      toast.success("Đã lưu thiết kế thành công!");
    } catch (err: unknown) {
      console.error("Lỗi khi lưu thiết kế:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu thiết kế";
      toast.error(errorMessage);
    }
  };

  // const loadCanvasFromJSON = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     if (!e.target?.result) return;
  //     isRestoringRef.current = true;
  //     const safeJson = sanitizeCanvasJSON(e.target.result as string);
  //     canvasRef.current?.loadFromJSON(safeJson, () => {
  //       canvasRef.current?.renderAll();
  //       saveState();
  //       isRestoringRef.current = false;
  //     });
  //   };
  //   reader.readAsText(file);
  // };

  const sanitizeCanvasJSON = (jsonString: string): string => {
    try {
      const jsonObj: Record<string, unknown> = JSON.parse(jsonString);

      const fixTextBaseline = (obj: Record<string, unknown>) => {
        if (obj && typeof obj === "object") {
          if (
            (obj as { textBaseline?: string }).textBaseline === "alphabetical"
          ) {
            (obj as { textBaseline?: string }).textBaseline = "alphabetic";
          }
          if ((obj as { objects?: Record<string, unknown>[] }).objects) {
            (obj as { objects: Record<string, unknown>[] }).objects.forEach(
              fixTextBaseline
            );
          }
        }
      };

      fixTextBaseline(jsonObj);

      return JSON.stringify(jsonObj);
    } catch (err: unknown) {
      console.error("Lỗi parse JSON:", err);
      return jsonString;
    }
  };

  // Add new function to handle item selection
  const handleItemSelect = (data: string | { type: string; svg: string }) => {
    // Check if data is shape data
    if (typeof data === "object" && data.type && data.svg) {
      // Handle shape data
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${data.svg}</svg>`;

      fabric.loadSVGFromString(svgString, (objects) => {
        if (objects && objects.length > 0) {
          // Apply color to all objects in the shape
          objects.forEach((obj) => {
            if (
              obj.type === "path" ||
              obj.type === "line" ||
              obj.type === "polygon" ||
              obj.type === "rect" ||
              obj.type === "circle" ||
              obj.type === "ellipse"
            ) {
              // Set fill color for filled shapes
              if (obj.fill && obj.fill !== "none") {
                obj.set("fill", shapeColor);
              }
              // Set stroke color for stroked shapes
              if (obj.stroke && obj.stroke !== "none") {
                obj.set("stroke", shapeColor);
              }
              // If no fill or stroke, set fill as default
              if (!obj.fill && !obj.stroke) {
                obj.set("fill", shapeColor);
              }
            }
          });

          const group = new fabric.Group(objects, {
            left: canvasRef.current!.width! / 2 - 50, // Center the shape
            top: canvasRef.current!.height! / 2 - 50,
            selectable: true,
            originX: "center",
            originY: "center",
            scaleX: 1,
            scaleY: 1,
          });

          canvasRef.current?.add(group);
          canvasRef.current?.setActiveObject(group);
          canvasRef.current?.bringToFront(group);
          saveState();
        }
      });
      return;
    }

    // Handle image URL
    const imageUrl = data as string;
    fabric.Image.fromURL(
      imageUrl,
      (img: fabric.Image) => {
        const customImg = img as CustomFabricImage;
        customImg.customId = `img_${Date.now()}_${Math.random()}`; // Add custom ID
        // Set initial size - smaller default size
        const maxSize = 200; // Reduced from 200 to 150
        const aspectRatio = img.width! / img.height!;

        if (aspectRatio > 1) {
          img.scaleToWidth(maxSize);
        } else {
          img.scaleToHeight(maxSize);
        }

        // Place at center of canvas
        const centerX = canvasRef.current!.width! / 2;
        const centerY = canvasRef.current!.height! / 2;

        img.set({
          left: centerX,
          top: centerY,
          selectable: true,
          originX: "center",
          originY: "center",
        });

        // Add a custom ID to the dropped image
        (
          img as CustomFabricImage
        ).customId = `img_${Date.now()}_${Math.random()}`;

        canvasRef.current?.add(img);
        canvasRef.current?.setActiveObject(img);
        canvasRef.current?.bringToFront(img);
        saveState();
      },
      { crossOrigin: "anonymous" }
    );
  };

  // Update drag and drop handlers for canvas
  useEffect(() => {
    if (
      !canvasRef.current ||
      !htmlCanvasRef.current ||
      !canvasWrapperRef.current
    )
      return;

    const canvas = canvasRef.current;
    const wrapper = canvasWrapperRef.current;

    const handleDragOver: DragEventHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop: DragEventHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const data = e.dataTransfer.getData("text/plain");
      if (!data) return;

      // Get canvas position and scale
      const wrapperRect = wrapper.getBoundingClientRect();

      // Calculate position relative to canvas wrapper
      const x = e.clientX - wrapperRect.left;
      const y = e.clientY - wrapperRect.top;

      // Convert to canvas coordinates
      const canvasX = x / scaleRatio;
      const canvasY = y / scaleRatio;

      // Try to parse as shape data first
      try {
        const shapeData = JSON.parse(data);
        if (shapeData.type && shapeData.svg) {
          // This is a shape, create SVG object
          const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${shapeData.svg}</svg>`;

          fabric.loadSVGFromString(svgString, (objects) => {
            if (objects && objects.length > 0) {
              const group = new fabric.Group(objects, {
                left: canvasX - 50, // Center the shape
                top: canvasY - 50,
                selectable: true,
                originX: "center",
                originY: "center",
                scaleX: 1,
                scaleY: 1,
              });

              canvas.add(group);
              canvas.setActiveObject(group);
              canvas.requestRenderAll();
              saveState();
            }
          });
          return;
        }
      } catch {
        // Not a shape, treat as image URL
      }

      // Handle as image URL
      fabric.Image.fromURL(
        data,
        (img: fabric.Image) => {
          const customImg = img as CustomFabricImage;
          customImg.customId = `img_${Date.now()}_${Math.random()}`; // Add custom ID
          // Set initial size
          const maxSize = 200;
          const aspectRatio = img.width! / img.height!;

          if (aspectRatio > 1) {
            img.scaleToWidth(maxSize);
          } else {
            img.scaleToHeight(maxSize);
          }

          // Calculate image dimensions after scaling
          const scaledWidth = img.width! * img.scaleX!;
          const scaledHeight = img.height! * img.scaleY!;

          // Place image center at cursor position
          img.set({
            left: canvasX - scaledWidth / 2,
            top: canvasY - scaledHeight / 2,
            selectable: true,
            originX: "left",
            originY: "top",
          });

          // Add a custom ID to the dropped image
          (
            img as CustomFabricImage
          ).customId = `img_${Date.now()}_${Math.random()}`;

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.requestRenderAll();
          saveState();
        },
        { crossOrigin: "anonymous" }
      );
    };

    // Add event listeners to canvas wrapper instead of canvas element
    wrapper.addEventListener(
      "dragover",
      handleDragOver as unknown as EventListener
    );
    wrapper.addEventListener("drop", handleDrop as unknown as EventListener);

    return () => {
      wrapper.removeEventListener(
        "dragover",
        handleDragOver as unknown as EventListener
      );
      wrapper.removeEventListener(
        "drop",
        handleDrop as unknown as EventListener
      );
    };
  }, [scaleRatio]);

  // useEffect(() => {
  //   if (
  //     location.state &&
  //     location.state.canvasId &&
  //     location.state.canvasDescription &&
  //     location.state.canvasTitle &&
  //     !currentCanvasId // 🛡️ Ngăn load lại nếu đã set ID
  //   ) {
  //     loadCanvasFromDescription(
  //       location.state.canvasDescription,
  //       location.state.canvasTitle,
  //       location.state.canvasId
  //     );
  //   }
  // }, [location.state, currentCanvasId]);

  // Add auto save effect
  useEffect(() => {
    if (isAutoSaveEnabled) {
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setAutoSaveCountdown((prev) => {
          if (prev <= 1) {
            return 5; // Reset to 5 when reaching 0
          }
          return prev - 1;
        });
      }, 1000);

      // Start auto save
      autoSaveIntervalRef.current = setInterval(() => {
        if (canvasRef.current) {
          saveCanvasAsJSON();
        }
      }, 5000);
    } else {
      // Clear intervals when disabled
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      setAutoSaveCountdown(5); // Reset countdown
    }

    // Cleanup on unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [isAutoSaveEnabled]);

  console.log(
    "Tổng số object trong canvas:",
    canvasRef.current?.getObjects().length
  );

  useEffect(() => {
    if (!canvasRef.current || !backgroundColor || !isCanvasInitialized) return;

    try {
      // ✅ Debug trước khi thay đổi background
      console.log(
        "Thay đổi background color từ:",
        canvasRef.current.backgroundColor,
        "sang:",
        backgroundColor
      );
      console.log(
        "Số object trước khi thay đổi:",
        canvasRef.current.getObjects().length
      );

      // Ensure canvas context exists
      if (!canvasRef.current.getContext()) {
        console.error("Canvas context is null when changing background color");
        return;
      }

      // Kiểm tra nếu backgroundColor là gradient
      if (backgroundColor.startsWith("linear-gradient")) {
        // Tạo gradient object cho Fabric.js
        const gradient = new fabric.Gradient({
          type: "linear",
          coords: {
            x1: 0,
            y1: 0,
            x2: canvasRef.current.width || 800,
            y2: canvasRef.current.height || 600,
          },
          colorStops: [
            { offset: 0, color: "#667eea" },
            { offset: 1, color: "#764ba2" },
          ],
        });

        // Parse gradient string để lấy colors và offsets
        const gradientStr = backgroundColor;

        // Extract colors and percentages from gradient string
        const colorStopMatches = gradientStr.match(/#[a-fA-F0-9]{6}\s*\d*%?/g);
        if (colorStopMatches && colorStopMatches.length >= 2) {
          const colorStops = colorStopMatches.map((match, index) => {
            const colorMatch = match.match(/#[a-fA-F0-9]{6}/);
            const percentMatch = match.match(/(\d+)%/);

            const color = colorMatch ? colorMatch[0] : "#667eea";
            const offset = percentMatch
              ? parseInt(percentMatch[1]) / 100
              : index / (colorStopMatches.length - 1);

            return { offset, color };
          });

          gradient.colorStops = colorStops;
        }

        canvasRef.current.setBackgroundColor(gradient, () => {
          if (canvasRef.current) {
            canvasRef.current.renderAll();
          }
        });
      } else {
        // Màu solid bình thường
        canvasRef.current.setBackgroundColor(backgroundColor, () => {
          if (canvasRef.current) {
            canvasRef.current.renderAll();
          }
        });
      }

      // ✅ Debug sau khi render
      console.log(
        "Sau khi set background color - Số object:",
        canvasRef.current?.getObjects().length
      );
    } catch (error) {
      console.error("Error changing background color:", error);
    }
  }, [backgroundColor, isCanvasInitialized]);

  // ✅ Thêm useEffect để debug canvas state
  useEffect(() => {
    if (canvasRef.current) {
      console.log("Canvas Info:", {
        isInitialized: !!canvasRef.current,
        objectCount: canvasRef.current.getObjects().length,
        backgroundColor: backgroundColor,
        canvasSize: {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        },
      });
    }
  }, [canvasRef.current, backgroundColor]);

  // Thêm useEffect để cập nhật selected object properties
  useEffect(() => {
    if (!canvasRef.current) return;

    const updateSelectedObjectProperties = () => {
      const activeObject = canvasRef.current?.getActiveObject();
      if (activeObject) {
        setSelectedObjectProperties({
          type: activeObject.type,
          x: Math.round(activeObject.left || 0),
          y: Math.round(activeObject.top || 0),
          width: Math.round(activeObject.width || 0),
          height: Math.round(activeObject.height || 0),
          rotation: Math.round(activeObject.angle || 0),
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
        });
      } else {
        setSelectedObjectProperties({});
      }
    };

    // Update on selection events
    canvasRef.current.on("selection:created", updateSelectedObjectProperties);
    canvasRef.current.on("selection:updated", updateSelectedObjectProperties);
    canvasRef.current.on("selection:cleared", updateSelectedObjectProperties);
    canvasRef.current.on("object:modified", updateSelectedObjectProperties);
    canvasRef.current.on("object:moving", updateSelectedObjectProperties);
    canvasRef.current.on("object:scaling", updateSelectedObjectProperties);
    canvasRef.current.on("object:rotating", updateSelectedObjectProperties);
    canvasRef.current.on("object:scaled", updateSelectedObjectProperties);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.off(
          "selection:created",
          updateSelectedObjectProperties
        );
        canvasRef.current.off(
          "selection:updated",
          updateSelectedObjectProperties
        );
        canvasRef.current.off(
          "selection:cleared",
          updateSelectedObjectProperties
        );
        canvasRef.current.off(
          "object:modified",
          updateSelectedObjectProperties
        );
        canvasRef.current.off("object:moving", updateSelectedObjectProperties);
        canvasRef.current.off("object:scaling", updateSelectedObjectProperties);
        canvasRef.current.off(
          "object:rotating",
          updateSelectedObjectProperties
        );
        canvasRef.current.off("object:scaled", updateSelectedObjectProperties);
      }
    };
  }, [canvasRef.current]);

  // ✅ Thêm useEffect để load canvas data sau khi canvas đã được khởi tạo
  useEffect(() => {
    if (!isCanvasInitialized || !canvasRef.current) return;

    if (location.state?.canvasDescription && location.state?.canvasId) {
      loadCanvasFromDescription(
        location.state.canvasDescription,
        location.state.canvasTitle || "Thiết kế",
        location.state.canvasId
      );
    } else {
      // Nếu cần, fallback fetch từ API ở đây (ví dụ khi reload trang)
      // Hoặc hiển thị thông báo "Không tìm thấy thiết kế"
      // toast.error("Không tìm thấy thông tin thiết kế");
    }
  }, [isCanvasInitialized, location.state?.canvasId]);

  // Thêm useEffect để tắt scroll của trang chính
  // useEffect(() => {
  //   // Tắt scroll của body và html
  //   document.body.style.overflow = "hidden";
  //   document.documentElement.style.overflow = "hidden";

  //   // Cleanup khi component unmount
  //   return () => {
  //     document.body.style.overflow = "";
  //     document.documentElement.style.overflow = "";
  //   };
  // }, []);

  // Add useEffect to update group/ungroup button states
  // useEffect(() => {
  //   const updateGroupStates = () => {
  //     setCanGroupState(canGroup());
  //     setCanUngroupState(canUngroup());
  //   };

  //   // Update states when canvas selection changes
  //   if (canvasRef.current) {
  //     canvasRef.current.on("selection:created", updateGroupStates);
  //     canvasRef.current.on("selection:updated", updateGroupStates);
  //     canvasRef.current.on("selection:cleared", updateGroupStates);
  //   }

  //   return () => {
  //     if (canvasRef.current) {
  //       canvasRef.current.off("selection:created", updateGroupStates);
  //       canvasRef.current.off("selection:updated", updateGroupStates);
  //       canvasRef.current.off("selection:cleared", updateGroupStates);
  //     }
  //   };
  // }, []);

  // ✅ Component debug để hiển thị thông tin canvas
  // const CanvasDebugInfo = () => {
  //   if (!canvasRef.current) return null;

  //   return (
  //     <div className="fixed top-20 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
  //       <div className="font-bold mb-2">Canvas Debug Info:</div>
  //       <div>Objects: {canvasRef.current.getObjects().length}</div>
  //       <div>
  //         Size: {canvasRef.current.width} x {canvasRef.current.height}
  //       </div>
  //       <div>Background: {backgroundColor}</div>
  //       <div>Canvas ID: {currentCanvasId || "New"}</div>
  //       <div>Title: {currentCanvasTitle}</div>
  //       <div>Initialized: {isCanvasInitialized ? "Yes" : "No"}</div>
  //     </div>
  //   );
  // };

  // Add group/ungroup functions
  const groupObjects = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (!activeObject || !canvasRef.current) return;

    if (activeObject.type === "activeSelection") {
      const selection = activeObject as fabric.ActiveSelection;
      const objects = selection.getObjects();

      if (objects.length < 2) {
        toast.error("Cần chọn ít nhất 2 đối tượng để nhóm");
        return;
      }

      // Create group
      const group = selection.toGroup();

      // Set group properties
      group.set({
        left: group.left,
        top: group.top,
        selectable: true,
        evented: true,
      });

      canvasRef.current.setActiveObject(group);
      canvasRef.current.requestRenderAll();
      saveState();

      toast.success(`Đã nhóm ${objects.length} đối tượng`);
    } else {
      toast.error("Cần chọn nhiều đối tượng để nhóm");
    }
  };

  const ungroupObjects = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (!activeObject || !canvasRef.current) return;

    if (activeObject.type === "group") {
      const group = activeObject as fabric.Group;
      const objects = group.getObjects();

      // Ungroup
      group.toActiveSelection();

      canvasRef.current.requestRenderAll();
      saveState();

      toast.success(`Đã tách nhóm ${objects.length} đối tượng`);
    } else {
      toast.error("Cần chọn một nhóm để tách");
    }
  };

  const canGroup = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (!activeObject) return false;

    if (activeObject.type === "activeSelection") {
      const selection = activeObject as fabric.ActiveSelection;
      return selection.getObjects().length >= 2;
    }
    return false;
  };

  const canUngroup = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (!activeObject) return false;

    return activeObject.type === "group";
  };

  // Thêm các hàm xử lý drag and drop cho layer
  const handleLayerDragStart = (e: React.DragEvent, index: number) => {
    setDraggedLayerIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    // Ngăn chặn việc select text khi drag
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  const handleLayerDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleLayerDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleLayerDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedLayerIndex === null || !canvasRef.current) return;

    const objects = canvasRef.current.getObjects();
    const reversedObjects = objects.slice().reverse();

    // Lấy object được kéo
    const draggedObject = reversedObjects[draggedLayerIndex];

    if (!draggedObject) return;

    // Nếu kéo về chính vị trí cũ thì không làm gì
    if (draggedLayerIndex === dropIndex) {
      setDraggedLayerIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Xóa object khỏi vị trí cũ
    canvasRef.current.remove(draggedObject);

    // Tính toán vị trí mới trong danh sách gốc
    const newIndex = objects.length - 1 - dropIndex;

    // Thêm object vào vị trí mới
    canvasRef.current.insertAt(draggedObject, newIndex, false);

    // Cập nhật canvas
    canvasRef.current.requestRenderAll();
    saveState();

    // Reset state
    setDraggedLayerIndex(null);
    setDragOverIndex(null);
  };

  const handleLayerDragEnd = () => {
    setDraggedLayerIndex(null);
    setDragOverIndex(null);
  };

  // Define sidebar actions for consistency
  const sidebarActions = [
    {
      key: "library",
      icon: PawPrint,
      label: "Mẫu Labubu",
      active: libraryOpen,
      onClick: () => {
        setBackgroundPanelOpen(false);
        if (libraryOpen) {
          setLibraryOpen(false);
        } else {
          setLibraryOpen(true);
          setShowUnsplash(false);
          setShowCanvasList(false);
          setDrawingPanelOpen(false);
        }
      },
    },
    {
      key: "background",
      icon: Palette,
      label: "Màu nền",
      active: backgroundPanelOpen,
      onClick: () => {
        setBackgroundPanelOpen((open) => !open);
        setLibraryOpen(false);
        setShowUnsplash(false);
        setShowCanvasList(false);
        setDrawingPanelOpen(false);
      },
    },
    {
      key: "unsplash",
      icon: Fan,
      label: "Thành phần",
      active: showUnsplash,
      onClick: () => {
        setBackgroundPanelOpen(false);
        if (showUnsplash) {
          setShowUnsplash(false);
        } else {
          setLibraryOpen(false);
          setShowUnsplash(true);
          setShowCanvasList(false);
          setDrawingPanelOpen(false);
        }
      },
    },
    {
      key: "addText",
      icon: Type,
      label: "Văn bản",
      active: false,
      onClick: () => {
        const text = new fabric.Textbox("Nhập văn bản", {
          left: 100,
          top: 100,
          width: 150,
          textAlign: "center",
          fontSize: 20,
          fill: "#000",
        });
        canvasRef.current?.add(text);
        canvasRef.current?.setActiveObject(text);
        canvasRef.current?.bringToFront(text);
        saveState();
      },
    },
    {
      key: "uploadImage",
      icon: ImageUp,
      label: "Tải lên",
      active: false,
      onClick: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) uploadImage(file);
        };
        input.click();
      },
    },
    {
      key: "drawingTool",
      icon: Pencil,
      label: "Công cụ",
      active: drawingPanelOpen,
      onClick: () => {
        setBackgroundPanelOpen(false);
        if (drawingPanelOpen) {
          setDrawingPanelOpen(false);
        } else {
          setLibraryOpen(false);
          setShowUnsplash(false);
          setShowCanvasList(false);
          setDrawingPanelOpen(true);
        }
      },
    },
    {
      key: "canvasList",
      icon: showCanvasList ? FolderOpen : FolderClosed,
      label: "Dự án",
      active: showCanvasList,
      onClick: () => {
        setBackgroundPanelOpen(false);
        if (showCanvasList) {
          setShowCanvasList(false);
        } else {
          setLibraryOpen(false);
          setShowUnsplash(false);
          setShowCanvasList(true);
          setDrawingPanelOpen(false);
        }
      },
    },

    // {
    //   key: "remove",
    //   icon: Trash2,
    //   label: "Xóa",
    //   active: false,
    //   onClick: removeSelected,
    //   variant: "destructive",
    // },
  ];

  const zoomCanvasFromCenter = (zoomValue: number) => {
    if (!canvasWrapperRef.current) return;

    // Apply zoom to the entire canvas wrapper using CSS transform
    canvasWrapperRef.current.style.transform = `scale(${zoomValue})`;
    canvasWrapperRef.current.style.transformOrigin = "center center";
  };

  // Zoom to specific point (for mouse wheel zoom)
  const zoomToPoint = (zoomValue: number) => {
    if (!canvasWrapperRef.current) return;

    // Apply zoom to the entire canvas wrapper using CSS transform
    canvasWrapperRef.current.style.transform = `scale(${zoomValue})`;
    canvasWrapperRef.current.style.transformOrigin = "center center";
  };

  // Zoom entire canvas with smooth animation
  const zoomCanvasSmooth = (targetZoom: number, duration: number = 300) => {
    if (!canvasWrapperRef.current) return;

    // Apply smooth zoom using CSS transition
    canvasWrapperRef.current.style.transition = `transform ${duration}ms ease-in-out`;
    canvasWrapperRef.current.style.transform = `scale(${targetZoom})`;
    canvasWrapperRef.current.style.transformOrigin = "center center";

    // Remove transition after animation completes
    setTimeout(() => {
      if (canvasWrapperRef.current) {
        canvasWrapperRef.current.style.transition = "";
      }
    }, duration);
  };

  // Fit canvas to viewport
  const fitCanvasToViewport = () => {
    if (!canvasRef.current || !canvasWrapperRef.current) return;
    const canvas = canvasRef.current;
    const wrapper = canvasWrapperRef.current;

    // Calculate the scale to fit canvas in viewport
    const scaleX = wrapper.clientWidth / canvas.getWidth();
    const scaleY = wrapper.clientHeight / canvas.getHeight();
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

    setZoom(scale);
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = "center center";
  };

  // Pan canvas (move viewport)
  const panCanvas = (deltaX: number, deltaY: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Get current viewport transform
    const vpt = canvas.viewportTransform;
    if (vpt) {
      // Update pan offset
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.setViewportTransform(vpt);
      canvas.requestRenderAll();
    }
  };

  // Footer/sidebar nhỏ width
  const getTargetSidebarPanelWidth = () => {
    let width = 0;
    if (libraryOpen || showUnsplash) width += 300;
    if (showCanvasList) width += 300;
    if (drawingPanelOpen) width += 80;
    if (backgroundPanelOpen) width += 300;
    return width;
  };

  const [visibleSidebarPanelWidth, setVisibleSidebarPanelWidth] = useState(
    getTargetSidebarPanelWidth()
  );
  useEffect(() => {
    const target = getTargetSidebarPanelWidth();
    if (target < visibleSidebarPanelWidth) {
      // Đang đóng panel, delay 100ms
      const timeout = setTimeout(() => setVisibleSidebarPanelWidth(target), 0);
      return () => clearTimeout(timeout);
    } else {
      // Mở panel, cập nhật ngay
      setVisibleSidebarPanelWidth(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    libraryOpen,
    showUnsplash,
    showCanvasList,
    drawingPanelOpen,
    backgroundPanelOpen,
  ]);

  // Thêm các ref cho sidebar
  const itemLibraryRef = useRef<HTMLDivElement>(null);
  const canvasListSidebarRef = useRef<HTMLDivElement>(null);
  const drawingToolPanelRef = useRef<HTMLDivElement>(null);
  const backgroundColorPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = canvasRef.current?.getActiveObject();
    if (obj) {
      setDraftProperties({
        x: convertFromPx(obj.left || 0, propertyUnit).toFixed(2),
        y: convertFromPx(obj.top || 0, propertyUnit).toFixed(2),
        w: convertFromPx(
          (obj.width || 0) * (obj.scaleX || 1),
          propertyUnit
        ).toFixed(2),
        h: convertFromPx(
          (obj.height || 0) * (obj.scaleY || 1),
          propertyUnit
        ).toFixed(2),
        a: String(Math.round(obj.angle || 0)),
      });
    }
  }, [selectedObjectProperties, propertyUnit]);

  // Reset image adjustment panels when selection changes
  useEffect(() => {
    if (!canvasRef.current) return;

    // This function now only resets the image filter panel UI.
    // The state of filters is managed per-image.
    const resetImageFilterPanel = () => {
      // A crucial check to prevent the UI from resetting during the color replacement process,
      // which involves temporarily deselecting and reselecting the image.
      if (isReplacingColorRef.current) {
        return;
      }
      setIsFilterEnabled(false);
      setFilterValues(DEFAULT_FILTER_VALUES);
      setActiveFilters(DEFAULT_ACTIVE_FILTERS);
    };

    // We also need a handler for when selection is completely cleared.
    const handleSelectionCleared = () => {
      if (isReplacingColorRef.current) {
        return;
      }
      resetImageFilterPanel();
      // Also reset color replacement when nothing is selected.
      setIsColorReplacementEnabled(false);
    };

    const canvas = canvasRef.current;
    canvas.on("selection:created", resetImageFilterPanel);
    canvas.on("selection:updated", resetImageFilterPanel);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", resetImageFilterPanel);
      canvas.off("selection:updated", resetImageFilterPanel);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvasRef.current]);

  // EFFECT: Auto-center canvas when component mounts or canvas size changes
  useEffect(() => {
    const centerCanvas = () => {
      if (canvasWrapperRef.current) {
        const container = canvasWrapperRef.current.parentElement?.parentElement;
        if (container) {
          setTimeout(() => {
            container.scrollTo({
              left: (container.scrollWidth - container.clientWidth) / 2,
              top: (container.scrollHeight - container.clientHeight) / 2,
              behavior: "smooth",
            });
          }, 100);
        }
      }
    };

    centerCanvas();

    // Add window resize listener to re-center canvas
    const handleResize = () => {
      centerCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [actualCanvasWidth, actualCanvasHeight, zoom]);

  // EFFECT: Load filter settings when selection changes
  useEffect(() => {
    if (currentSelectedImageId) {
      const settings =
        imageFilterSettings.get(currentSelectedImageId) || DEFAULT_FILTER_STATE;
      setFilterValues(settings.values);
      setActiveFilters(settings.active);
      setIsFilterEnabled(settings.isEnabled);
    } else {
      // Reset if no image is selected
      setFilterValues(DEFAULT_FILTER_STATE.values);
      setActiveFilters(DEFAULT_FILTER_STATE.active);
      setIsFilterEnabled(DEFAULT_FILTER_STATE.isEnabled);
    }
  }, [currentSelectedImageId]);

  // EFFECT: Save filter settings when they change for the selected image
  useEffect(() => {
    if (!currentSelectedImageId) return;

    const currentState: ImageFilterState = {
      values: filterValues,
      active: activeFilters,
      isEnabled: isFilterEnabled,
    };

    // Prevent re-saving the exact same state that's already in the map
    const existingState = imageFilterSettings.get(currentSelectedImageId);
    if (JSON.stringify(existingState) === JSON.stringify(currentState)) {
      return;
    }

    const newMap = new Map(imageFilterSettings);
    newMap.set(currentSelectedImageId, currentState);
    setImageFilterSettings(newMap);
    // This dependency array is correct. It triggers a save when the filter UI state changes.
  }, [filterValues, activeFilters, isFilterEnabled, currentSelectedImageId]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="font-bold text-xl text-primary flex items-center gap-2">
            {/* <span className="bg-primary/10 p-2 rounded-lg">🎨</span>
            <span>PlushDoll Design</span> */}
            <LogoCanvas />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon" aria-label="Menu">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start" side="bottom">
                <DropdownMenuSub
                  onOpenChange={(open) => {
                    if (open) {
                      setCanvasWidthInput(actualCanvasWidth);
                      setCanvasHeightInput(actualCanvasHeight);
                    }
                  }}
                >
                  <DropdownMenuSubTrigger>Đổi cỡ</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <div className="p-2 w-64">
                      <div className="font-semibold text-sm mb-2">
                        Đổi kích thước Canvas
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium">
                          Chiều rộng
                        </label>
                        <Input
                          type="number"
                          value={canvasWidthInput}
                          onChange={(e) => setCanvasWidthInput(e.target.value)}
                          className="w-full"
                        />
                        <label className="text-xs font-medium">Chiều cao</label>
                        <Input
                          type="number"
                          value={canvasHeightInput}
                          onChange={(e) => setCanvasHeightInput(e.target.value)}
                          className="w-full"
                        />
                        <label className="text-xs font-medium">Đơn vị</label>
                        <select
                          value={unit}
                          onChange={(e) =>
                            setUnit(e.target.value as "px" | "cm" | "mm")
                          }
                          className="border rounded px-2 h-8 text-xs"
                        >
                          <option value="px">px</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                        </select>
                        <Button
                          className="mt-2"
                          onClick={() => {
                            setActualCanvasWidth(canvasWidthInput);
                            setActualCanvasHeight(canvasHeightInput);
                            createNewCanvas();
                          }}
                        >
                          Xác nhận
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Lịch sử phiên bản
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <CanvasVersionHistory
                      canvasFolderId={
                        location.state?.folderId ||
                        location.state?.canvasFolderId ||
                        "default-folder"
                      }
                      onRestore={(ver) => {
                        loadCanvasFromDescription(
                          ver.canvasDescription,
                          ver.canvasTitle,
                          ver.canvasInfoId
                        );
                      }}
                    />
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-sm text-muted-foreground border-l border-border pl-6">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg border border-border">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateTitle();
                    } else if (e.key === "Escape") {
                      setIsEditingTitle(false);
                      setEditingTitle(currentCanvasTitle);
                    }
                  }}
                  className="border rounded px-2 py-1 text-sm w-[150px] bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  autoFocus
                  placeholder="Nhập tiêu đề..."
                />
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleUpdateTitle}
                    className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingTitle(false);
                      setEditingTitle(currentCanvasTitle);
                    }}
                    className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer bg-muted px-3 py-1.5 rounded-lg border border-border transition-all"
                onClick={() => {
                  setIsEditingTitle(true);
                  setEditingTitle(currentCanvasTitle);
                }}
              >
                <span className="text-foreground font-medium">
                  {currentCanvasTitle}
                </span>
                <span className="text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={undo}>
            <Undo2 className="w-4 h-4 mr-1" />
            {/* Hoàn tác */}
          </Button>
          <Button variant="outline" onClick={redo}>
            <Redo2 className="w-4 h-4 mr-1" />
            {/* Làm lại */}
          </Button>

          {/* ZOOM CONTROLS */}
          {/* Đã di chuyển xuống dưới */}
          <Button variant="outline" onClick={saveCanvasAsPNG}>
            <Download className="w-4 h-4 mr-1" />
            Xuất PNG
          </Button>
          <Button variant="outline" onClick={saveCanvasAsJSON}>
            <Save className="w-4 h-4 mr-1" />
            Lưu thiết kế
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              if (!currentCanvasId) {
                toast.error("Không có canvas để lưu version!");
                return;
              }
              try {
                const res = await newVersionCanvas({
                  canvasInfoId: currentCanvasId,
                });
                if (res?.isSuccess) {
                  toast.success("Đã lưu version mới thành công!");
                } else {
                  toast.error("Có lỗi xảy ra khi lưu version!");
                }
              } catch {
                toast.error("Có lỗi xảy ra khi lưu version!");
              }
            }}
            disabled={!currentCanvasId}
          >
            <Save className="w-4 h-4 mr-1" />
            Lưu version
          </Button>

          <Button
            variant={isAutoSaveEnabled ? "default" : "outline"}
            onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isAutoSaveEnabled ? (
              <span className="flex items-center gap-1">
                <span className="text-xs font-medium">Tự động lưu: </span>
                <span className="text-xs font-medium">
                  {autoSaveCountdown}s
                </span>
              </span>
            ) : (
              <span className="text-xs font-medium">Tự động lưu: Tắt</span>
            )}
          </Button>

          <Button
            variant={rightSidebarOpen ? "default" : "outline"}
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs font-medium">Thông tin</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 h-full min-h-0">
        {/* Main sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-20" : "w-45"
          } transition-all duration-300 border-r border-border bg-card py-4 flex flex-col gap-4 relative h-full min-h-0`}
        >
          <Button
            size="icon"
            variant="outline"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-muted shadow-md rounded-full w-6 h-6 flex items-center justify-center"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>

          {/* Scrollable content for left sidebar */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-4 mb-4">
              {sidebarActions.map((action) => (
                <div
                  key={action.key}
                  className={`flex ${
                    isSidebarCollapsed
                      ? "flex-col items-center "
                      : "flex-row items-center px-4"
                  } gap-2`}
                >
                  {isSidebarCollapsed ? (
                    <>
                      <button
                        type="button"
                        className={`w-10 h-10 rounded-md flex items-center justify-center cursor-pointer transition-colors
                          ${
                            action.active
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }
                        `}
                        onClick={action.onClick}
                      >
                        <action.icon className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-medium text-center">
                        {action.label}
                      </span>
                    </>
                  ) : (
                    <Button
                      variant={action.active ? "default" : "outline"}
                      className="w-full h-10 justify-start px-4"
                      onClick={action.onClick}
                    >
                      <action.icon className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">
                        {action.label}
                      </span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Item Library Sidebar */}
        <ItemLibrary
          ref={itemLibraryRef}
          onSelect={handleItemSelect}
          isOpen={libraryOpen}
          showUnsplash={showUnsplash}
          onCloseLibrary={() => setLibraryOpen(false)}
          onCloseUnsplash={() => setShowUnsplash(false)}
        />

        {/* Canvas List Sidebar */}
        <CanvasListSidebar
          ref={canvasListSidebarRef}
          onSelect={(desc: string, title: string, id: string) => {
            loadCanvasFromDescription(desc, title, id);
            setCurrentCanvasId(id);
          }}
          isOpen={showCanvasList}
          onClose={() => setShowCanvasList(false)}
          initialCanvasState={
            location.state?.canvasId
              ? {
                  canvasId: location.state.canvasId,
                  folderName: location.state.folderName,
                  canvasDescription: location.state.canvasDescription,
                }
              : undefined
          }
          selectedCanvasId={currentCanvasId}
        />

        {/* Panel công cụ vẽ */}
        <DrawingToolPanel
          ref={drawingToolPanelRef}
          isOpen={drawingPanelOpen}
          onClose={() => setDrawingPanelOpen(false)}
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          brushWidth={brushWidth}
          setBrushWidth={setBrushWidth}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
          isErasing={isErasing}
          setIsErasing={setIsErasing}
          eraserWidth={eraserWidth}
          setEraserWidth={setEraserWidth}
          canvasRef={canvasRef}
          setToolbarVisible={setToolbarVisible}
          setActiveText={
            setActiveText as React.Dispatch<
              React.SetStateAction<fabric.Text | null>
            >
          }
        />

        {/* Panel chọn màu nền */}
        <BackgroundColorPanel
          ref={backgroundColorPanelRef}
          isOpen={backgroundPanelOpen}
          onClose={() => setBackgroundPanelOpen(false)}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
        />

        {/* Canvas */}
        <div className="flex-1 relative bg-muted overflow-hidden">
          {activeText && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40 bg-card border border-border shadow-md flex gap-2 p-2 rounded-md">
              <Popover open={fontPopoverOpen} onOpenChange={setFontPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="w-40 h-[30px]">
                    <Input
                      type="text"
                      value={textProperties.fontFamily}
                      onClick={() => setFontPopoverOpen(true)}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        activeText.set("fontFamily", newValue);
                        setTextProperties((prev: TextProperties) => ({
                          ...prev,
                          fontFamily: newValue,
                        }));
                        canvasRef.current?.renderAll();
                        saveState();
                      }}
                      className="h-full text-center text-sm px-2"
                    />
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-40 p-0 max-h-[300px] overflow-y-auto">
                  <Command>
                    <CommandGroup>
                      {[
                        "Arial",
                        "Noto Sans",
                        "Times New Roman",
                        "Courier New",
                        "Roboto",
                        "Inter",
                      ].map((font) => (
                        <CommandItem
                          key={font}
                          onMouseEnter={() => {
                            activeText.set("fontFamily", font);
                            canvasRef.current?.renderAll();
                          }}
                          onMouseLeave={() => {
                            activeText.set(
                              "fontFamily",
                              textProperties.fontFamily
                            );
                            canvasRef.current?.renderAll();
                          }}
                          onSelect={() => {
                            activeText.set("fontFamily", font);
                            setTextProperties((prev: TextProperties) => ({
                              ...prev,
                              fontFamily: font,
                            }));
                            canvasRef.current?.renderAll();
                            saveState();
                            setFontPopoverOpen(false); // ✅ tắt popover khi chọn xong
                          }}
                          className={`cursor-pointer text-sm h-[30px] leading-[30px] ${
                            textProperties.fontFamily === font ? "bg-muted" : ""
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover open={sizePopoverOpen} onOpenChange={setSizePopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="w-20 h-[30px]">
                    <Input
                      type="number"
                      min={10}
                      max={200}
                      value={textProperties.fontSize}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        activeText.set("fontSize", newValue);
                        setTextProperties((prev: TextProperties) => ({
                          ...prev,
                          fontSize: newValue,
                        }));
                        canvasRef.current?.renderAll();
                        saveState();
                      }}
                      onClick={() => setSizePopoverOpen(true)}
                      className="h-full text-center text-sm px-2"
                    />
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-24 p-0 max-h-[420px] overflow-y-auto">
                  <Command>
                    <CommandGroup>
                      {[
                        6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48,
                        56, 64, 72, 80, 88, 96, 104, 120, 144,
                      ].map((size) => (
                        <CommandItem
                          key={size}
                          onMouseEnter={() => {
                            activeText.set("fontSize", size);
                            canvasRef.current?.renderAll();
                          }}
                          onMouseLeave={() => {
                            activeText.set("fontSize", textProperties.fontSize);
                            canvasRef.current?.renderAll();
                          }}
                          onSelect={() => {
                            activeText.set("fontSize", size);
                            setTextProperties((prev: TextProperties) => ({
                              ...prev,
                              fontSize: size,
                            }));
                            canvasRef.current?.renderAll();
                            saveState();
                            setSizePopoverOpen(false);
                          }}
                          className={`text-center cursor-pointer h-[30px] leading-[30px] text-sm ${
                            textProperties.fontSize === size ? "bg-muted" : ""
                          }`}
                        >
                          {size}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Input
                type="color"
                value={textProperties.fill}
                onChange={(e) => {
                  const newValue = e.target.value;
                  activeText.set("fill", newValue);
                  setTextProperties((prev: TextProperties) => ({
                    ...prev,
                    fill: newValue,
                  }));
                  canvasRef.current?.renderAll();
                  saveState();
                }}
                className="w-[30px] h-[30px] p-0 border rounded"
              />

              {[
                {
                  icon: Bold,
                  active: textProperties.fontWeight === "bold",
                  action: () =>
                    activeText.set(
                      "fontWeight",
                      textProperties.fontWeight === "bold" ? "normal" : "bold"
                    ),
                },
                {
                  icon: Italic,
                  active: textProperties.fontStyle === "italic",
                  action: () =>
                    activeText.set(
                      "fontStyle",
                      textProperties.fontStyle === "italic"
                        ? "normal"
                        : "italic"
                    ),
                },
                {
                  icon: Underline,
                  active: textProperties.underline,
                  action: () =>
                    activeText.set("underline", !textProperties.underline),
                },
                {
                  icon: AlignLeft,
                  active: textProperties.textAlign === "left",
                  action: () => activeText.set("textAlign", "left"),
                },
                {
                  icon: AlignCenter,
                  active: textProperties.textAlign === "center",
                  action: () => activeText.set("textAlign", "center"),
                },
                {
                  icon: AlignRight,
                  active: textProperties.textAlign === "right",
                  action: () => activeText.set("textAlign", "right"),
                },
              ].map(({ icon: Icon, active, action }, index) => (
                <Button
                  key={index}
                  variant={active ? "default" : "outline"}
                  size="icon"
                  className="h-[30px] w-[30px]"
                  onClick={() => {
                    action();
                    setTextProperties((prev: TextProperties) => ({
                      ...prev,
                      fontWeight: String(activeText.fontWeight as string),
                      fontStyle: String(activeText.fontStyle as string),
                      underline: activeText.underline ?? false,
                      textAlign:
                        (activeText.textAlign as fabric.Textbox["textAlign"]) ??
                        "center",
                    }));
                    activeText.setCoords();
                    canvasRef.current?.renderAll();
                    saveState();
                  }}
                >
                  <Icon size={14} />
                </Button>
              ))}
            </div>
          )}

          <div
            className="relative bg-muted h-full overflow-auto"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--muted-foreground)) transparent",
            }}
          >
            {/* Canvas Container with proper centering and scrolling */}
            <div
              className="min-w-full min-h-full flex justify-center items-center p-4"
              style={{
                minHeight: "100vh",
                minWidth: "100vw",
                position: "relative",
                padding: "2rem",
                background:
                  "radial-gradient(circle at center, transparent 0%, hsl(var(--muted)) 100%)",
              }}
            >
              <div
                ref={canvasWrapperRef}
                className="relative bg-card shadow-md origin-top"
                style={{
                  width: isFullWindow
                    ? `${canvasWrapperRef.current?.style.width || "100%"}`
                    : `${convertToPixels(
                        parseFloat(actualCanvasWidth) || 0,
                        unit
                      )}px`,
                  height: isFullWindow
                    ? `${canvasWrapperRef.current?.style.height || "100%"}`
                    : `${convertToPixels(
                        parseFloat(actualCanvasHeight) || 0,
                        unit
                      )}px`,

                  minWidth: "fit-content",
                  minHeight: "fit-content",
                  maxWidth: "none",
                  maxHeight: "none",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <canvas ref={htmlCanvasRef} className="w-full h-full" />

                {toolbarVisible &&
                  (() => {
                    const obj = canvasRef.current?.getActiveObject();
                    const isImage = obj?.type === "image";

                    return (
                      <div
                        ref={toolbarRef}
                        className="absolute z-50 bg-card shadow-lg rounded-md p-2 flex gap-2 select-none"
                        style={{
                          top: toolbarPos.y,
                          left: toolbarPos.x,
                        }}
                        onMouseDown={startDrag}
                      >
                        {/* Rotate Cw */}
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            if (obj) {
                              obj.rotate((obj.angle || 0) + 45);
                              obj.setCoords();
                              canvasRef.current?.renderAll();
                              saveState();
                            }
                          }}
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                        {/* Rotate Ccw */}
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            if (obj) {
                              obj.rotate((obj.angle || 0) - 45);
                              obj.setCoords();
                              canvasRef.current?.renderAll();
                              saveState();
                            }
                          }}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          className="h-full flex-1"
                          onClick={flipObjectHorizontal}
                          title="Lật ngang"
                        >
                          <FlipHorizontal size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-full flex-1"
                          onClick={flipObjectVertical}
                          title="Lật dọc"
                        >
                          <FlipVertical size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            if (obj && canvasRef.current) {
                              canvasRef.current.bringToFront(obj);
                              obj.setCoords();
                              canvasRef.current.setActiveObject(obj);
                              canvasRef.current.fire("selection:updated", {
                                selected: [obj],
                              }); // ✅ Force selection update
                              updateToolbarPos(obj); // ✅ Update toolbar position
                              canvasRef.current.requestRenderAll();
                              saveState();
                            }
                          }}
                        >
                          <Layers className="w-4 h-4" />
                        </Button>

                        {obj && !isAtTop(obj) && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              if (obj && canvasRef.current) {
                                canvasRef.current.bringForward(obj);
                                obj.setCoords();
                                canvasRef.current.setActiveObject(obj);
                                canvasRef.current.fire("selection:updated", {
                                  selected: [obj],
                                }); // ✅ Force selection update
                                updateToolbarPos(obj);
                                canvasRef.current.requestRenderAll();
                                saveState();
                              }
                            }}
                          >
                            <ArrowUpFromLine className="w-4 h-4" />
                          </Button>
                        )}

                        {obj && !isAtBottom(obj) && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              if (obj && canvasRef.current) {
                                canvasRef.current.sendBackwards(obj);
                                obj.setCoords();
                                canvasRef.current.setActiveObject(obj);
                                canvasRef.current.fire("selection:updated", {
                                  selected: [obj],
                                }); // ✅ Force selection update
                                updateToolbarPos(obj);
                                canvasRef.current.requestRenderAll();
                                saveState();
                              }
                            }}
                          >
                            <ArrowDownFromLine className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Group Button */}
                        {canGroup() && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={groupObjects}
                            title="Nhóm các đối tượng"
                          >
                            <Group className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Ungroup Button */}
                        {canUngroup() && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={ungroupObjects}
                            title="Tách nhóm"
                          >
                            <Ungroup className="w-4 h-4" />
                          </Button>
                        )}

                        {isImage && (
                          <RemoveBackgroundButton
                            canvas={canvasRef.current}
                            onStateChange={() => {
                              // You can add additional state handling here if needed
                            }}
                            onSaveState={saveState}
                          />
                        )}
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
          <div
            className={
              "absolute bottom-0 z-30 bg-muted border-t border-border flex items-center justify-center gap-2 shadow-lg px-4 py-2 transition-all duration-300"
            }
            style={{
              pointerEvents: "auto",
              right: 0,
              left: 0,
              backdropFilter: "blur(8px)",
              backgroundColor: "hsl(var(--muted) / 0.95)",
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={handleZoomOut}
              disabled={zoom <= 0.1}
            >
              -
            </Button>
            <div className="relative">
              <input
                type="number"
                min={10}
                max={500}
                value={Math.round(zoom * 100)}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (isNaN(value)) value = 100;
                  value = Math.max(10, Math.min(500, value));
                  const newZoom = value / 100;
                  setZoom(newZoom);
                  zoomCanvasSmooth(newZoom, 200);
                }}
                onFocus={() => setShowZoomDropdown(true)}
                onBlur={() => setTimeout(() => setShowZoomDropdown(false), 200)}
                className="w-14 text-center text-xs border rounded h-7 px-1 bg-card cursor-pointer"
                style={{ width: 50 }}
                placeholder="100"
              />
              <span className="text-xs absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                %
              </span>
              <svg
                className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>

              {/* Zoom Dropdown */}
              {showZoomDropdown && (
                <div className="absolute bottom-full left-0 mb-1 bg-card border border-border rounded-md shadow-lg z-50 min-w-[120px]">
                  <div className="p-3">
                    {[25, 50, 75, 100, 125, 150, 200, 300, 400, 500].map(
                      (zoomLevel) => (
                        <button
                          key={zoomLevel}
                          onClick={() => handleZoomSelect(zoomLevel)}
                          className={`w-full text-left px-2 py-1 text-xs hover:bg-muted rounded-sm ${
                            isZoomLevelActive(zoomLevel)
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          {zoomLevel}%
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleZoomIn}
              disabled={zoom >= 5}
            >
              +
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleResetZoom}
              title="Reset zoom to 100%"
            >
              ↺
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleFixWindow}
              className="ml-2 text-xs px-2 h-7"
              title="Cố định kích thước canvas"
            >
              Fix Window
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFullWindow}
              className="text-xs px-2 h-7"
              title="Toàn màn hình canvas"
            >
              Full Window
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (canvasWrapperRef.current) {
                  const container =
                    canvasWrapperRef.current.parentElement?.parentElement;
                  if (container) {
                    container.scrollTo({
                      left: (container.scrollWidth - container.clientWidth) / 2,
                      top:
                        (container.scrollHeight - container.clientHeight) / 2,
                      behavior: "smooth",
                    });
                  }
                }
              }}
              className="text-xs px-2 h-7"
              title="Căn giữa canvas"
            >
              Center
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={fitCanvasToViewport}
              className="text-xs px-2 h-7"
              title="Fit canvas to viewport"
            >
              Fit
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside
          className={`${
            rightSidebarOpen ? "w-60" : "w-20"
          } transition-all duration-300 border-l border-border bg-card py-4 flex flex-col gap-4 relative h-full min-h-0`}
        >
          <Button
            size="icon"
            variant="outline"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-muted shadow-md rounded-full w-6 h-6 flex items-center justify-center"
            onClick={() => setRightSidebarOpen((prev) => !prev)}
          >
            {rightSidebarOpen ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>

          {/* Tabs for right sidebar */}
          {rightSidebarOpen && (
            <div className="flex border-b border-border px-4 flex-shrink-0">
              <button
                onClick={() => setRightSidebarTab("adjust")}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  rightSidebarTab === "adjust"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Điều chỉnh
              </button>
              <button
                onClick={() => setRightSidebarTab("layers")}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  rightSidebarTab === "layers"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Layers
              </button>
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0 max-h-full overflow-y-auto overflow-x-hidden">
            {/* Tab Content */}
            {rightSidebarOpen ? (
              rightSidebarTab === "adjust" ? (
                <div className="flex flex-col gap-4 px-4 pb-0">
                  {/* <div className="text-sm font-semibold text-foreground mb-2">
                    Thông tin
                  </div> */}
                  {/* Canvas Properties */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Thông tin Canvas
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Chiều rộng:
                        </span>
                        <span className="font-medium">
                          {actualCanvasWidth} {unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Chiều cao:
                        </span>
                        <span className="font-medium">
                          {actualCanvasHeight} {unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Số lượng vật thể:
                        </span>
                        <span className="font-medium">
                          {canvasRef.current?.getObjects().length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tỷ lệ:</span>
                        <span className="font-medium">
                          {Math.round(zoom * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Object Properties */}
                  {canvasRef.current?.getActiveObject() && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          CHỈNH SỬA
                        </div>
                        {/* Unit switcher */}
                        <div className="flex items-center border rounded-md p-0.5 bg-muted">
                          <Button
                            size="sm"
                            variant={
                              propertyUnit === "px" ? "secondary" : "ghost"
                            }
                            onClick={() => setPropertyUnit("px")}
                            className="h-5 px-2 text-xs"
                          >
                            px
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              propertyUnit === "mm" ? "secondary" : "ghost"
                            }
                            onClick={() => setPropertyUnit("mm")}
                            className="h-5 px-2 text-xs"
                          >
                            mm
                          </Button>
                        </div>
                      </div>

                      {/* Nút chọn màu cho shape, chỉ hiện khi là shape */}
                      {(() => {
                        const obj = canvasRef.current?.getActiveObject();
                        const isShape =
                          obj &&
                          (obj.type === "group" ||
                            [
                              "path",
                              "line",
                              "polygon",
                              "rect",
                              "circle",
                              "ellipse",
                            ].includes(obj.type || ""));
                        if (!isShape) return null;
                        return (
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              Màu shape (đường kẻ/hình dạng):
                            </label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={shapeColor}
                                onChange={(e) => {
                                  setShapeColor(e.target.value || "#000000");
                                  if (obj) {
                                    if (obj.type === "group") {
                                      (obj as fabric.Group)
                                        .getObjects()
                                        .forEach((child) => {
                                          if (
                                            child.type === "path" ||
                                            child.type === "line" ||
                                            child.type === "polygon" ||
                                            child.type === "rect" ||
                                            child.type === "circle" ||
                                            child.type === "ellipse"
                                          ) {
                                            if (
                                              child.fill &&
                                              child.fill !== "none"
                                            )
                                              child.set("fill", e.target.value);
                                            if (
                                              child.stroke &&
                                              child.stroke !== "none"
                                            )
                                              child.set(
                                                "stroke",
                                                e.target.value
                                              );
                                            if (!child.fill && !child.stroke)
                                              child.set("fill", e.target.value);
                                          }
                                        });
                                      obj.setCoords();
                                      canvasRef.current?.renderAll();
                                      saveState();
                                    } else if (
                                      obj.type === "path" ||
                                      obj.type === "line" ||
                                      obj.type === "polygon" ||
                                      obj.type === "rect" ||
                                      obj.type === "circle" ||
                                      obj.type === "ellipse"
                                    ) {
                                      if (obj.fill && obj.fill !== "none")
                                        obj.set("fill", e.target.value);
                                      if (obj.stroke && obj.stroke !== "none")
                                        obj.set("stroke", e.target.value);
                                      if (!obj.fill && !obj.stroke)
                                        obj.set("fill", e.target.value);
                                      obj.setCoords();
                                      canvasRef.current?.renderAll();
                                      saveState();
                                    }
                                  }
                                }}
                                className="w-12 h-8 p-0 border rounded"
                              />
                              <Input
                                type="text"
                                value={shapeColor}
                                onChange={(e) => setShapeColor(e.target.value)}
                                className="flex-1"
                                placeholder="#3b82f6"
                              />
                            </div>
                          </div>
                        );
                      })()}

                      <div className="space-y-2">
                        {/* Position X, Y */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-1 border rounded-md px-2 py-1 bg-background">
                            <span className="text-xs font-semibold text-muted-foreground">
                              X
                            </span>
                            <Input
                              type="number"
                              className="h-6 flex-1 w-full p-0 border-none text-right bg-transparent focus-visible:ring-0"
                              value={draftProperties.x}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setDraftProperties({
                                  ...draftProperties,
                                  x: newValue,
                                });
                              }}
                              onBlur={handleApplyChanges}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleApplyChanges();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1 flex items-center gap-1 border rounded-md px-2 py-1 bg-background">
                            <span className="text-xs font-semibold text-muted-foreground">
                              Y
                            </span>
                            <Input
                              type="number"
                              className="h-6 flex-1 w-full p-0 border-none text-right bg-transparent focus-visible:ring-0"
                              value={draftProperties.y}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setDraftProperties({
                                  ...draftProperties,
                                  y: newValue,
                                });
                              }}
                              onBlur={handleApplyChanges}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleApplyChanges();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Size W, H */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-1 border rounded-md px-2 py-1 bg-background">
                            <span className="text-xs font-semibold text-muted-foreground">
                              W
                            </span>
                            <Input
                              type="number"
                              className="h-6 flex-1 w-full p-0 border-none text-right bg-transparent focus-visible:ring-0"
                              value={draftProperties.w}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setDraftProperties({
                                  ...draftProperties,
                                  w: newValue,
                                });
                              }}
                              onBlur={handleApplyChanges}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleApplyChanges();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                            />
                          </div>

                          <div className="flex-1 flex items-center gap-1 border rounded-md px-2 py-1 bg-background">
                            <span className="text-xs font-semibold text-muted-foreground">
                              H
                            </span>
                            <Input
                              type="number"
                              className="h-6 flex-1 w-full p-0 border-none text-right bg-transparent focus-visible:ring-0"
                              value={draftProperties.h}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setDraftProperties({
                                  ...draftProperties,
                                  h: newValue,
                                });
                              }}
                              onBlur={handleApplyChanges}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleApplyChanges();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Rotation A and Flip buttons */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-1 border rounded-md px-2 py-1 bg-background">
                            <span className="text-xs font-semibold text-muted-foreground">
                              R
                            </span>
                            <Input
                              type="number"
                              className="h-6 flex-1 w-full p-0 border-none text-right bg-transparent focus-visible:ring-0"
                              value={draftProperties.a}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setDraftProperties({
                                  ...draftProperties,
                                  a: newValue,
                                });
                              }}
                              onBlur={handleApplyChanges}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleApplyChanges();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Color Replacement for Images */}
                  {canvasRef.current?.getActiveObject()?.type === "image" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Thay thế màu
                        </div>
                        <Switch
                          id="color-replacement-toggle"
                          checked={isColorReplacementEnabled}
                          onCheckedChange={setIsColorReplacementEnabled}
                        />
                      </div>
                      {isColorReplacementEnabled && (
                        <div className="space-y-3 pt-3">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              Màu cần thay đổi:
                            </label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={targetColor}
                                onChange={(e) => setTargetColor(e.target.value)}
                                className="w-12 h-8 p-0 border rounded"
                              />
                              <Input
                                type="text"
                                value={targetColor}
                                onChange={(e) => setTargetColor(e.target.value)}
                                className="flex-1"
                                placeholder="#ff0000"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              Màu mới:
                            </label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={replacementColor}
                                onChange={(e) =>
                                  setReplacementColor(e.target.value)
                                }
                                className="w-12 h-8 p-0 border rounded"
                              />
                              <Input
                                type="text"
                                value={replacementColor}
                                onChange={(e) =>
                                  setReplacementColor(e.target.value)
                                }
                                className="flex-1"
                                placeholder="#00ff00"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              Độ chính xác: {colorTolerance}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={colorTolerance}
                              onChange={(e) =>
                                setColorTolerance(Number(e.target.value))
                              }
                              className="w-full"
                            />
                          </div>

                          <Button
                            size="sm"
                            onClick={replaceImageColor}
                            className="w-full"
                            disabled={!canvasRef.current?.getActiveObject()}
                          >
                            <Droplets className="w-4 h-4 mr-2" />
                            Thay đổi màu sắc
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image Filters */}
                  {canvasRef.current?.getActiveObject()?.type === "image" && (
                    <ImageFilterPanel
                      isFilterEnabled={isFilterEnabled}
                      setIsFilterEnabled={setIsFilterEnabled}
                      filterValues={filterValues}
                      setFilterValues={setFilterValues}
                      activeFilters={activeFilters}
                      setActiveFilters={setActiveFilters}
                      applyFilter={applyFilter}
                      applyFilterValue={applyFilterValue}
                      clearAllFilters={clearAllFilters}
                    />
                  )}

                  {canvasRef.current?.getActiveObject()?.type === "image" && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          const activeObject =
                            canvasRef.current?.getActiveObject();

                          const resetImageState = (
                            imageToReset: fabric.Image,
                            keepColorReplacementOpen = false
                          ) => {
                            // This function will be called on the correct image object
                            canvasRef.current?.setActiveObject(imageToReset);

                            // Also remove its settings from the map
                            const imageId = (imageToReset as CustomFabricImage)
                              .customId;
                            if (imageId && imageFilterSettings.has(imageId)) {
                              const newMap = new Map(imageFilterSettings);
                              newMap.delete(imageId);
                              setImageFilterSettings(newMap);
                            }

                            // Reset Image Filters UI
                            setFilterValues(DEFAULT_FILTER_VALUES);
                            setActiveFilters(DEFAULT_ACTIVE_FILTERS);
                            setIsFilterEnabled(false);

                            // Reset Color Replacement UI, but keep it open if needed
                            if (!keepColorReplacementOpen) {
                              setIsColorReplacementEnabled(false);
                              setTargetColor("#ff0000");
                              setReplacementColor("#00ff00");
                              setColorTolerance(30);
                            }

                            canvasRef.current?.requestRenderAll();
                            saveState();
                          };

                          if (activeObject && activeObject.type === "image") {
                            const imageObj = activeObject as CustomFabricImage;
                            const originalSrc = imageObj.originalSrc;

                            // If a color replacement has been applied, revert it.
                            if (
                              originalSrc &&
                              imageObj.getSrc() !== originalSrc
                            ) {
                              fabric.Image.fromURL(
                                originalSrc,
                                (originalImg) => {
                                  if (!canvasRef.current) return;

                                  const newCustomImg =
                                    originalImg as CustomFabricImage;
                                  // Preserve original source and ID
                                  newCustomImg.originalSrc = originalSrc;
                                  newCustomImg.customId = imageObj.customId;

                                  newCustomImg.set({
                                    left: imageObj.left,
                                    top: imageObj.top,
                                    scaleX: imageObj.scaleX,
                                    scaleY: imageObj.scaleY,
                                    angle: imageObj.angle,
                                    flipX: imageObj.flipX,
                                    flipY: imageObj.flipY,
                                    selectable: true,
                                    evented: true,
                                  });

                                  const canvas = canvasRef.current;
                                  const index = canvas
                                    .getObjects()
                                    .indexOf(imageObj);
                                  canvas.remove(imageObj);
                                  canvas.insertAt(newCustomImg, index, false);

                                  // Now reset filters and UI on the *newly restored* image
                                  resetImageState(
                                    newCustomImg,
                                    isColorReplacementEnabled
                                  );
                                },
                                { crossOrigin: "anonymous" }
                              );
                            } else {
                              // No color replacement to revert, just reset filters on the current image
                              resetImageState(imageObj);
                            }
                          }
                        }}
                      >
                        Đặt lại tất cả thay đổi
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Layers tab content
                <div className="flex flex-col gap-4 px-4 pb-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Layers ({canvasRef.current?.getObjects().length || 0})
                  </div>
                  <div className="space-y-1 overflow-y-auto">
                    {canvasRef.current
                      ?.getObjects()
                      .slice()
                      .reverse()
                      .map((obj, index) => {
                        const isSelected =
                          canvasRef.current?.getActiveObject() === obj;
                        const reversedIndex =
                          (canvasRef.current?.getObjects().length || 0) -
                          1 -
                          index;
                        const isDragging = draggedLayerIndex === index;
                        const isDragOver = dragOverIndex === index;

                        // Tạo thumbnail cho layer
                        const getLayerThumbnail = () => {
                          if (obj.type === "image") {
                            // Cho image objects, sử dụng chính ảnh đó
                            return (
                              <div className="w-8 h-8 rounded border border-border overflow-hidden bg-muted flex items-center justify-center">
                                <img
                                  src={(obj as fabric.Image).getSrc()}
                                  alt="Layer"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback nếu ảnh không load được
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                    (
                                      e.target as HTMLImageElement
                                    ).parentElement!.innerHTML = "🖼️";
                                  }}
                                />
                              </div>
                            );
                          } else if (
                            obj.type === "textbox" ||
                            obj.type === "i-text"
                          ) {
                            // Cho text objects, hiển thị icon text
                            return (
                              <div className="w-8 h-8 rounded border border-border bg-blue-50 flex items-center justify-center">
                                <Type className="w-4 h-4 text-blue-600" />
                              </div>
                            );
                          } else if (obj.type === "group") {
                            // Cho group objects, hiển thị icon group
                            return (
                              <div className="w-8 h-8 rounded border border-border bg-purple-50 flex items-center justify-center">
                                <Group className="w-4 h-4 text-purple-600" />
                              </div>
                            );
                          } else if (obj.type === "path") {
                            // Cho path objects (vẽ), hiển thị icon pencil
                            return (
                              <div className="w-8 h-8 rounded border border-border bg-green-50 flex items-center justify-center">
                                <Pencil className="w-4 h-4 text-green-600" />
                              </div>
                            );
                          } else {
                            // Fallback cho các object khác
                            return (
                              <div className="w-8 h-8 rounded border border-border bg-muted flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">
                                  {obj.type?.charAt(0).toUpperCase() || "O"}
                                </span>
                              </div>
                            );
                          }
                        };

                        // Tạo tên hiển thị cho layer
                        const getLayerName = () => {
                          if (obj.type === "image") {
                            return "Image";
                          } else if (
                            obj.type === "textbox" ||
                            obj.type === "i-text"
                          ) {
                            const textbox = obj as fabric.Textbox;
                            const itext = obj as fabric.IText;
                            const text = textbox.text || itext.text || "";
                            return text.length > 15
                              ? text.substring(0, 15) + "..."
                              : text || "Text";
                          } else if (obj.type === "group") {
                            const group = obj as fabric.Group;
                            return `Group (${group.getObjects().length})`;
                          } else if (obj.type === "path") {
                            return "Drawing";
                          } else {
                            return obj.type || "Object";
                          }
                        };

                        return (
                          <div
                            key={index}
                            draggable
                            className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors select-none ${
                              isSelected
                                ? "bg-primary/10 border border-primary/20"
                                : isDragging
                                ? "bg-primary/5 border border-primary/30 opacity-50"
                                : isDragOver
                                ? "bg-muted/50 border border-dashed border-primary/50"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => {
                              if (canvasRef.current) {
                                canvasRef.current.setActiveObject(obj);
                                canvasRef.current.requestRenderAll();
                              }
                            }}
                            onDragStart={(e) => handleLayerDragStart(e, index)}
                            onDragOver={(e) => handleLayerDragOver(e, index)}
                            onDragLeave={handleLayerDragLeave}
                            onDrop={(e) => handleLayerDrop(e, index)}
                            onDragEnd={handleLayerDragEnd}
                            style={{
                              userSelect: "none",
                              WebkitUserSelect: "none",
                              MozUserSelect: "none",
                              msUserSelect: "none",
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-grab active:cursor-grabbing flex-shrink-0" />
                              <div className="w-3 h-3 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] text-muted-foreground">
                                  {reversedIndex + 1}
                                </span>
                              </div>
                              {getLayerThumbnail()}
                              <span className="truncate font-medium">
                                {getLayerName()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (canvasRef.current) {
                                    canvasRef.current.remove(obj);
                                    canvasRef.current.requestRenderAll();
                                    saveState();
                                  }
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="text-xs font-medium text-muted-foreground text-center">
                  Properties
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {canvasRef.current?.getObjects().length || 0} objects
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* <CanvasDebugInfo /> */}
    </div>
  );
};

export default PlushDollDesign;
