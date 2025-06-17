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
  RotateCw,
  RotateCcw,
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
} from "lucide-react";
import CustomerService from "@/services/CustomerService";
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
import { convertToPixels } from "@/components/utils/convert";
import RemoveBackgroundButton from "./RemoveBackgroundButton";
import { useLocation } from "react-router-dom";

// import ImageGenerator from "../image-gen";
// import CopilotImageGenerator from "../image-gen/CopilotImageGenerator";

import LogoCanvas from "@/components/atoms/custom/logo/LogoCanvas";
import DrawingToolPanel from "./DrawingToolPanel";

// Add proper type for drag events
type DragEventHandler = (e: DragEvent<HTMLCanvasElement>) => void;

// Add interface for canvas object
interface CanvasObject {
  canvasInfoId: string;
  canvasTitle: string;
  canvasDescription: string;
}

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

const PlushDollDesign: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRestoringRef = useRef(false);
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sizePopoverOpen, setSizePopoverOpen] = useState(false);
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);
  const [canvasWidthInput, setCanvasWidthInput] = useState("960");
  const [canvasHeightInput, setCanvasHeightInput] = useState("540");
  const [actualCanvasWidth, setActualCanvasWidth] = useState("960");
  const [actualCanvasHeight, setActualCanvasHeight] = useState("540");
  const [scaleRatio, setScaleRatio] = useState(1);
  const [unit, setUnit] = useState<"px" | "cm" | "mm">("px");

  // Add state for drawing brush properties
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(3);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const [activeText, setActiveText] = useState<fabric.IText | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<{ states: string[]; index: number }>({
    states: [],
    index: -1,
  });

  const { postCanvas, getCanvas, putCanvas } = CustomerService();

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

  // Thêm useEffect để lấy số lượng canvas khi component mount
  useEffect(() => {
    console.log(location.state, "location.state");

    const hasCanvasId = location.state?.canvasId;

    if (hasCanvasId) {
      // Fetch canvas data from API when canvasId is present
      const fetchCanvasData = async () => {
        try {
          const data = await getCanvas({ page: 1, size: 100 });
          const canvasList =
            data?.responseRequestModel?.responseList?.items || [];
          const targetCanvas = canvasList.find(
            (canvas: CanvasObject) =>
              canvas.canvasInfoId === location.state.canvasId
          );

          if (targetCanvas) {
            loadCanvasFromDescription(
              targetCanvas.canvasDescription,
              targetCanvas.canvasTitle,
              targetCanvas.canvasInfoId
            );
          } else {
            toast.error("Không tìm thấy thông tin thiết kế");
          }
        } catch (error) {
          console.error("Error fetching canvas data:", error);
          toast.error("Có lỗi xảy ra khi tải thiết kế");
        }
      };

      fetchCanvasData();
      return; // Exit early after fetching canvas data
    }

    // If no canvasId, fetch canvas count for new canvas
    const fetchCanvasCount = async () => {
      try {
        const data = await getCanvas({ page: 1, size: 100 });
        const totalCount =
          data?.responseRequestModel?.responseList?.totalItems || 0;
        setTotalCanvasCount(totalCount);
        setCurrentCanvasTitle(`Thiết kế ${totalCount + 1}`);
      } catch {
        setCurrentCanvasTitle("Thiết kế mới");
      }
    };

    fetchCanvasCount();
  }, [getCanvas, location.state]);

  // Initial canvas & events setup
  useEffect(() => {
    if (!htmlCanvasRef.current) return;
    const canvas = new fabric.Canvas(htmlCanvasRef.current, {
      backgroundColor: "#ffffff",
    });
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushWidth;
    canvas.renderAll();
    canvasRef.current = canvas;
    saveInitialState();

    // Selection events for smart toolbar
    canvas.on("selection:created", (e) => {
      if (e.selected && e.selected.length > 0) {
        if (canvas.getActiveObject() instanceof fabric.ActiveSelection) {
          setToolbarVisible(false);
          setActiveText(null);
        } else {
          handleSelection(e.selected[0]);
        }
      }
    });

    canvas.on("selection:updated", (e) => {
      if (e.selected && e.selected.length > 0) {
        if (canvas.getActiveObject() instanceof fabric.ActiveSelection) {
          setToolbarVisible(false);
          setActiveText(null);
        } else {
          handleSelection(e.selected[0]);
        }
      }
    });

    canvas.on("selection:cleared", () => {
      setToolbarVisible(false);
      setActiveText(null);
    });

    canvas.on("mouse:up", () => isDrawing && saveState());
    canvas.on("object:added", () => !isRestoringRef.current && saveState());
    canvas.on("object:modified", saveState);
    canvas.on("object:moving", (e) => {
      if (e.target) updateToolbarPos(e.target);
    });

    document.addEventListener("keydown", handleKeyDown);

    // Add event listener for createNewCanvas
    const handleCreateNewCanvas = () => {
      createNewCanvas();
    };
    window.addEventListener("createNewCanvas", handleCreateNewCanvas);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("createNewCanvas", handleCreateNewCanvas);
      canvas.dispose();
    };
  }, []);

  // Sync brush properties when they change
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.freeDrawingBrush.color = brushColor;
      canvasRef.current.freeDrawingBrush.width = brushWidth;
    }
  }, [brushColor, brushWidth]);

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
        const { clientWidth, clientHeight } = canvasWrapperRef.current;
        canvasRef.current.setWidth(clientWidth);
        canvasRef.current.setHeight(clientHeight);
        canvasRef.current.renderAll();
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
      const data = await getCanvas({ page: 1, size: 100 });
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

    canvasRef.current.setWidth(widthPx);
    canvasRef.current.setHeight(heightPx);
    canvasRef.current.clear();
    canvasRef.current.backgroundColor = "#ffffff";

    // Maintain brush properties
    canvasRef.current.freeDrawingBrush.color = brushColor;
    canvasRef.current.freeDrawingBrush.width = brushWidth;

    canvasRef.current.renderAll();

    canvasWrapperRef.current.style.width = `${widthPx}px`;
    canvasWrapperRef.current.style.height = `${heightPx}px`;

    saveInitialState();

    // toast.success(`Đã tạo thiết kế mới ${width}x${height} ${unit}`);
  };

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

    canvasRef.current.setZoom(ratio);
    canvasRef.current.requestRenderAll();

    canvasWrapperRef.current.style.width = `${canvasWidth}px`;
    canvasWrapperRef.current.style.height = `${canvasHeight}px`;

    setScaleRatio(ratio);
  };

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
    if (!canvasRef.current || !canvasWrapperRef.current) return;

    const bound = obj.getBoundingRect(true, true);

    // Get the canvas element
    const canvasEl = canvasRef.current.getElement() as HTMLCanvasElement;
    const canvasRect = canvasEl.getBoundingClientRect();
    const wrapperRect = canvasWrapperRef.current.getBoundingClientRect();

    // Tính toán offset canvas trong wrapper
    const offsetX = canvasRect.left - wrapperRect.left;
    const offsetY = canvasRect.top - wrapperRect.top;

    setToolbarPos({
      x: bound.left + bound.width / 2 + offsetX,
      y: bound.top - 100 + offsetY,
    });
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
      const bbox = activeObject.getBoundingRect(true, true);

      const objects = selection.getObjects().map((obj) => {
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
          clonedObj.set({
            left: bbox.left + relLeft + pasteOffset,
            top: bbox.top + relTop + pasteOffset,
            evented: true,
          });

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
        clonedObj.set({
          left: (clonedObj.left || 0) + pasteOffset,
          top: (clonedObj.top || 0) + pasteOffset,
          evented: true,
        });
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

    // if (!canvasDescription) {
    //   console.error("Canvas description is missing");
    //   toast.error("Không tìm thấy dữ liệu canvas");
    //   return;
    // }

    isRestoringRef.current = true;
    const safeJson = sanitizeCanvasJSON(canvasDescription);

    try {
      canvasRef.current.loadFromJSON(safeJson, () => {
        // Maintain brush properties after loading
        canvasRef.current!.freeDrawingBrush.color = brushColor;
        canvasRef.current!.freeDrawingBrush.width = brushWidth;

        canvasRef.current?.renderAll();
        isRestoringRef.current = false;

        // Set all required state
        setCurrentCanvasTitle(canvasTitle);
        setCurrentCanvasId(canvasId);
        setEditingTitle(canvasTitle);
        setIsEditingTitle(false);

        console.log("Thiết kế đã được tải thành công:", {
          canvasId,
          canvasTitle,
          currentCanvasId: canvasId, // Verify ID is set
        });

        // toast.success("Đã tải thiết kế thành công!");
      });
    } catch (error) {
      console.error("Error loading thiết kế:", error);
      toast.error("Có lỗi xảy ra khi tải thiết kế");
      isRestoringRef.current = false;
    }
  };

  const saveInitialState = () => {
    if (!canvasRef.current) return;
    const current = JSON.stringify(canvasRef.current);
    historyRef.current = { states: [current], index: 0 };
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
      fabric.Image.fromURL(f.target?.result as string, (img) => {
        img.scaleToWidth(200);
        img.scaleToHeight(200);
        img.set({ left: 100, top: 100, selectable: true });
        canvasRef.current?.add(img);
        canvasRef.current?.setActiveObject(img);
        saveState();
      });
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

      // Convert canvas data to string
      const canvasDescription = JSON.stringify(canvasData);

      // Update existing canvas with correct format
      const response = await putCanvas({
        canvasInfoId: currentCanvasId,
        canvasTitle: trimmedTitle,
        canvasDescription: canvasDescription,
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
    console.log("Saving canvas:", {
      currentCanvasId,
      currentCanvasTitle,
      hasCanvasId: !!currentCanvasId,
    });

    const canvasDescription = JSON.stringify(canvasJson);

    try {
      if (currentCanvasId) {
        // Update existing canvas with correct format
        const response = await putCanvas({
          canvasInfoId: currentCanvasId,
          canvasTitle: currentCanvasTitle,
          canvasDescription,
        });

        if (!response?.isSuccess) {
          throw new Error(response?.message || "Cập nhật thất bại");
        }
      } else {
        // Create new canvas with correct format
        const response = await postCanvas({
          canvasTitle: currentCanvasTitle,
          canvasDescription,
        });

        if (!response?.isSuccess) {
          throw new Error(response?.message || "Tạo mới thất bại");
        }

        // Set the new canvas ID from response
        if (response?.responseRequestModel?.canvasInfoId) {
          setCurrentCanvasId(response.responseRequestModel.canvasInfoId);
        }
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
  const handleItemSelect = (imageUrl: string) => {
    fabric.Image.fromURL(imageUrl, (img) => {
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

      canvasRef.current?.add(img);
      canvasRef.current?.setActiveObject(img);
      saveState();
    });
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

      const imageUrl = e.dataTransfer.getData("text/plain");
      if (!imageUrl) return;

      // Get canvas position and scale
      const wrapperRect = wrapper.getBoundingClientRect();

      // Calculate position relative to canvas wrapper
      const x = e.clientX - wrapperRect.left;
      const y = e.clientY - wrapperRect.top;

      // Convert to canvas coordinates
      const canvasX = x / scaleRatio;
      const canvasY = y / scaleRatio;

      // Create and add image
      fabric.Image.fromURL(imageUrl, (img) => {
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

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        saveState();
      });
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

  // Define sidebar actions for consistency
  const sidebarActions = [
    {
      key: "library",
      icon: PawPrint,
      label: "Mẫu Labubu",
      active: libraryOpen,
      onClick: () => {
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
      key: "unsplash",
      icon: Fan,
      label: "Thành phần",
      active: showUnsplash,
      onClick: () => {
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
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={canvasWidthInput}
            onChange={(e) => setCanvasWidthInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                createNewCanvas();
              }
            }}
            placeholder="Chiều rộng"
            className="w-24"
          />
          <Input
            type="number"
            value={canvasHeightInput}
            onChange={(e) => setCanvasHeightInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                createNewCanvas();
              }
            }}
            placeholder="Chiều cao"
            className="w-24"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as "px" | "cm" | "mm")}
            className="border rounded px-2 h-[38px]"
          >
            <option value="px">px</option>
            <option value="cm">cm</option>
            <option value="mm">mm</option>
          </select>
          <Button variant="default" onClick={createNewCanvas}>
            Tạo thiết kế mới
          </Button>
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
          <Button variant="outline" onClick={saveCanvasAsPNG}>
            <Download className="w-4 h-4 mr-1" />
            Xuất PNG
          </Button>
          <Button variant="outline" onClick={saveCanvasAsJSON}>
            <Save className="w-4 h-4 mr-1" />
            Lưu thiết kế
          </Button>
          <Button
            variant={isAutoSaveEnabled ? "default" : "outline"}
            onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isAutoSaveEnabled ? (
              <span className="flex items-center gap-1">
                <span className="text-xs font-medium">Tự động lưu</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {autoSaveCountdown}s
                </span>
              </span>
            ) : (
              <span className="text-xs font-medium">Tự động lưu: Tắt</span>
            )}
          </Button>
          {/* <Input
            type="file"
            accept=".json"
            onChange={(e) =>
              e.target.files && loadCanvasFromJSON(e.target.files[0])
            }
            className="w-[120px]"
          /> */}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-20" : "w-64"
          } transition-all duration-300 border-r border-border bg-card py-4 flex flex-col gap-4 relative`}
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
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Item Library Sidebar */}
        <ItemLibrary
          onSelect={handleItemSelect}
          isOpen={libraryOpen}
          showUnsplash={showUnsplash}
          onCloseLibrary={() => setLibraryOpen(false)}
          onCloseUnsplash={() => setShowUnsplash(false)}
        />

        {/* Canvas List Sidebar */}
        <CanvasListSidebar
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
                  canvasTitle: location.state.canvasTitle,
                  canvasDescription: location.state.canvasDescription,
                }
              : undefined
          }
          selectedCanvasId={currentCanvasId}
        />

        {/* Panel công cụ vẽ */}
        <DrawingToolPanel
          isOpen={drawingPanelOpen}
          onClose={() => setDrawingPanelOpen(false)}
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          brushWidth={brushWidth}
          setBrushWidth={setBrushWidth}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
        />

        {/* Canvas */}
        <div className="flex-1 relative bg-muted">
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
                  variant={action.active ? "default" : "outline"}
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

          <div className="relative flex justify-center items-center bg-muted h-full">
            <div
              ref={canvasWrapperRef}
              className="relative bg-card shadow-md origin-top"
              style={{
                width: `${convertToPixels(
                  parseFloat(actualCanvasWidth) || 0,
                  unit
                )}px`,
                height: `${convertToPixels(
                  parseFloat(actualCanvasHeight) || 0,
                  unit
                )}px`,
                transform: `scale(${scaleRatio})`,
              }}
            >
              <canvas ref={htmlCanvasRef} className="w-full h-full" />

              {toolbarVisible &&
                (() => {
                  const obj = canvasRef.current?.getActiveObject();
                  const atTop = obj ? isAtTop(obj) : false;
                  const atBottom = obj ? isAtBottom(obj) : false;
                  const isImage = obj?.type === "image";

                  return (
                    <div
                      className="absolute z-50 bg-card shadow-lg rounded-md p-2 flex gap-2 select-none"
                      style={{
                        top: toolbarPos.y,
                        left: toolbarPos.x,
                        transform: "translateX(-50%)",
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

                      {!atTop && (
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

                      {!atBottom && (
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
      </div>
    </div>
  );
};

export default PlushDollDesign;
