import React, { useEffect, useRef, useState, DragEvent } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  FilePlus,
  Pencil,
  Trash2,
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
  Image as ImageIcon,
  Scissors,
} from "lucide-react";
import CustomerService from "@/services/CustomerService";
import { toast } from "sonner";
import CanvasList from "./get-canvas";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { convertToPixels } from "@/components/utils/convert";
import RemoveBackgroundButton from "./RemoveBackgroundButton";

// import ImageGenerator from "../image-gen";
// import CopilotImageGenerator from "../image-gen/CopilotImageGenerator";

// Update LibraryItem interface
interface LibraryItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  tags?: string[];
}

// Add proper type for drag events
type DragEventHandler = (e: DragEvent<HTMLCanvasElement>) => void;

// Update ItemLibrary component
const ItemLibrary: React.FC<{
  onSelect: (imageUrl: string) => void;
  isOpen: boolean;
}> = ({ onSelect, isOpen }) => {
  const [items] = useState<LibraryItem[]>([
    {
      id: "1",
      name: "Labubu 1",
      imageUrl: "/images/labubu-1.png",
      category: "Characters",
      tags: ["cute", "animal"],
    },
    {
      id: "2",
      name: "Labubu 2",
      imageUrl: "/images/labubu-2.png",
      category: "Characters",
      tags: ["cute", "animal"],
    },
    {
      id: "3",
      name: "Labubu 3",
      imageUrl: "/images/labubu-3.png",
      category: "Characters",
      tags: ["cute", "animal"],
    },
    // Add more items as needed
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(items.map((item) => item.category)));

  const handleDragStart = (e: DragEvent<HTMLDivElement>, imageUrl: string) => {
    e.dataTransfer.setData("text/plain", imageUrl);
    e.dataTransfer.effectAllowed = "copy";

    // Create a ghost image for better drag feedback
    const img = new Image();
    img.src = imageUrl;
    e.dataTransfer.setDragImage(img, 50, 50);
  };

  const handleItemClick = (imageUrl: string) => {
    onSelect(imageUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[300px] h-full border-l bg-white flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-4">Các mẫu Labubu</h3>
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="cursor-move group"
              onClick={() => handleItemClick(item.imageUrl)}
              draggable
              onDragStart={(e) => handleDragStart(e, item.imageUrl)}
            >
              <div className="aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <p className="text-sm text-center text-gray-600 truncate">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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

  // Thêm useEffect để lấy số lượng canvas khi component mount
  useEffect(() => {
    const fetchCanvasCount = async () => {
      try {
        const data = await getCanvas({ page: 1, size: 100 });
        console.log(data, "data");
        const totalCount =
          data?.responseRequestModel?.responseList?.totalItems || 0;
        setTotalCanvasCount(totalCount);
        setCurrentCanvasTitle(`Thiết kế ${totalCount + 1}`);
      } catch (error) {
        console.error("Lỗi khi lấy số lượng canvas:", error);
        setCurrentCanvasTitle("Thiết kế mới");
      }
    };

    fetchCanvasCount();
  }, [getCanvas]);

  // Initial canvas & events setup
  useEffect(() => {
    if (!htmlCanvasRef.current) return;
    const canvas = new fabric.Canvas(htmlCanvasRef.current, {
      backgroundColor: "#ffffff",
    });
    canvas.freeDrawingBrush.color = "#000000";
    canvas.freeDrawingBrush.width = 3;
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, []);

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
      console.error("Lỗi khi lấy số lượng canvas:", error);
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
    canvasRef.current.renderAll();

    canvasWrapperRef.current.style.width = `${widthPx}px`;
    canvasWrapperRef.current.style.height = `${heightPx}px`;

    saveInitialState();

    toast.success(`Đã tạo canvas mới ${width}x${height} ${unit}`);
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
      console.error("Canvas ref is not available");
      return;
    }

    if (!canvasId) {
      console.error("Canvas ID is missing");
      toast.error("Không tìm thấy thông tin canvas");
      return;
    }

    if (!canvasDescription) {
      console.error("Canvas description is missing");
      toast.error("Không tìm thấy dữ liệu canvas");
      return;
    }

    isRestoringRef.current = true;
    const safeJson = sanitizeCanvasJSON(canvasDescription);

    try {
      canvasRef.current.loadFromJSON(safeJson, () => {
        canvasRef.current?.renderAll();
        isRestoringRef.current = false;

        // Set all required state
        setCurrentCanvasTitle(canvasTitle);
        setCurrentCanvasId(canvasId);
        setEditingTitle(canvasTitle);
        setIsEditingTitle(false);

        console.log("Canvas loaded successfully:", {
          canvasId,
          canvasTitle,
          currentCanvasId: canvasId, // Verify ID is set
        });

        toast.success("Đã tải canvas thành công!");
      });
    } catch (error) {
      console.error("Error loading canvas:", error);
      toast.error("Có lỗi xảy ra khi tải canvas");
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
        console.log("Updating title for new canvas");
        // For new canvas, just update the title locally
        setCurrentCanvasTitle(trimmedTitle);
        setIsEditingTitle(false);
        return;
      }

      console.log("Updating title for existing canvas:", currentCanvasId);

      // Get current canvas data
      const canvasData = canvasRef.current?.toJSON();
      if (!canvasData) {
        toast.error("Không thể lấy dữ liệu canvas");
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
    } catch (error: unknown) {
      console.error("Error updating title:", error);
      // Show specific error message from API if available
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật tiêu đề";
      toast.error(errorMessage);
      // Reset editing state on error
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

      const blob = new Blob([canvasDescription], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "canvas.json";
      link.click();

      // Dispatch event khi lưu thành công
      window.dispatchEvent(new CustomEvent("canvasSaved"));

      toast.success("Đã lưu canvas thành công!");
    } catch (error: unknown) {
      console.error("Lỗi khi lưu canvas:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu canvas";
      toast.error(errorMessage);
    }
  };

  const loadCanvasFromJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      isRestoringRef.current = true;
      const safeJson = sanitizeCanvasJSON(e.target.result as string);
      canvasRef.current?.loadFromJSON(safeJson, () => {
        canvasRef.current?.renderAll();
        saveState();
        isRestoringRef.current = false;
      });
    };
    reader.readAsText(file);
  };

  const sanitizeCanvasJSON = (jsonString: string): string => {
    try {
      const jsonObj = JSON.parse(jsonString);

      const fixTextBaseline = (obj: any) => {
        if (obj && typeof obj === "object") {
          if (obj.textBaseline === "alphabetical") {
            obj.textBaseline = "alphabetic";
          }
          if (obj.objects) {
            obj.objects.forEach(fixTextBaseline);
          }
        }
      };

      fixTextBaseline(jsonObj);

      return JSON.stringify(jsonObj);
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
      return jsonString;
    }
  };

  // Add new function to handle item selection
  const handleItemSelect = (imageUrl: string) => {
    fabric.Image.fromURL(imageUrl, (img) => {
      // Set initial size - smaller default size
      const maxSize = 150; // Reduced from 200 to 150
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
    const canvasElement = htmlCanvasRef.current;
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
        const maxSize = 150;
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="font-bold text-xl text-primary flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-lg">🎨</span>
            <span>PlushDoll Design</span>
          </div>
          <div className="text-sm text-gray-600 border-l pl-6">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
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
                  className="border rounded px-2 py-1 text-sm w-[150px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
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
                    className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="group flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-all"
                onClick={() => {
                  setIsEditingTitle(true);
                  setEditingTitle(currentCanvasTitle);
                }}
              >
                <span className="text-gray-700 font-medium">
                  {currentCanvasTitle}
                </span>
                <span className="opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity">
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
            Tạo canvas mới
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={undo}>
            <Undo2 className="w-4 h-4 mr-1" />
            Hoàn tác
          </Button>
          <Button variant="outline" onClick={redo}>
            <Redo2 className="w-4 h-4 mr-1" />
            Làm lại
          </Button>
          <Button variant="outline" onClick={saveCanvasAsPNG}>
            <Download className="w-4 h-4 mr-1" />
            Xuất PNG
          </Button>
          <Button variant="outline" onClick={saveCanvasAsJSON}>
            <Download className="w-4 h-4 mr-1" />
            Lưu JSON
          </Button>
          <Input
            type="file"
            accept=".json"
            onChange={(e) =>
              e.target.files && loadCanvasFromJSON(e.target.files[0])
            }
            className="w-[120px]"
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 border-r bg-white p-4 flex flex-col gap-4 relative`}
        >
          <Button
            size="icon"
            variant="outline"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-md rounded-full w-6 h-6 flex items-center justify-center"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>

          {!isSidebarCollapsed ? (
            <>
              <Button
                variant={isDrawing ? "default" : "outline"}
                onClick={() =>
                  setIsDrawing((prev) => {
                    canvasRef.current!.isDrawingMode = !prev;
                    return !prev;
                  })
                }
                className={
                  isDrawing ? "bg-blue-500 hover:bg-blue-600 text-white" : ""
                }
              >
                <Pencil className="w-4 h-4 mr-1" />
                Vẽ: {isDrawing ? "[Tắt]" : "[Bật]"}
              </Button>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && uploadImage(e.target.files[0])
                }
                className="w-full"
              />

              <Button
                variant="outline"
                onClick={() => {
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
                }}
              >
                <FilePlus className="w-4 h-4 mr-1" />
                Thêm văn bản
              </Button>

              <Button variant="destructive" onClick={removeSelected}>
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </Button>

              <div>
                <label>Màu bút vẽ</label>
                <Input
                  type="color"
                  defaultValue="#000000"
                  onChange={(e) =>
                    (canvasRef.current!.freeDrawingBrush.color = e.target.value)
                  }
                />
              </div>

              <div>
                <label>Độ dày bút vẽ</label>
                <Slider
                  defaultValue={[3]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([value]) =>
                    (canvasRef.current!.freeDrawingBrush.width = value)
                  }
                />
              </div>

              <Button
                variant={libraryOpen ? "default" : "outline"}
                className="w-full"
                onClick={() => setLibraryOpen(!libraryOpen)}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Các mẫu Labubu
              </Button>

              <div className={isSidebarCollapsed ? "hidden" : ""}>
                <CanvasList
                  onSelect={(description, title, id) => {
                    console.log("Canvas selected:", { id, title });
                    loadCanvasFromDescription(description, title, id);
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <Button
                size="icon"
                variant={libraryOpen ? "default" : "outline"}
                onClick={() => setLibraryOpen(!libraryOpen)}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const text = new fabric.IText("Nhập văn bản", {
                    left: 100,
                    top: 100,
                    fontSize: 20,
                    textAlign: "center",
                    fill: "#000",
                  });
                  canvasRef.current?.add(text);
                  saveState();
                }}
              >
                <FilePlus className="w-4 h-4" />
              </Button>

              <Button
                size="icon"
                variant="destructive"
                onClick={removeSelected}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </aside>

        {/* Item Library Sidebar */}
        <ItemLibrary onSelect={handleItemSelect} isOpen={libraryOpen} />

        {/* Canvas */}
        <div className="flex-1 relative bg-gray-50">
          {activeText && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40 bg-white border shadow-md flex gap-2 p-2 rounded-md">
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
                        setTextProperties((prev) => ({
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
                            setTextProperties((prev) => ({
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
                        setTextProperties((prev) => ({
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
                            setTextProperties((prev) => ({
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
                  setTextProperties((prev) => ({ ...prev, fill: newValue }));
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
                    setTextProperties((prev: any) => ({
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

          <div className="relative flex justify-center items-center bg-gray-100 h-full">
            <div
              ref={canvasWrapperRef}
              className="relative bg-white shadow-md origin-top"
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
                      className="absolute z-50 bg-white shadow-lg rounded-md p-2 flex gap-2 select-none"
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
