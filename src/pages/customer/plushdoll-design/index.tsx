import React, { useEffect, useRef, useState } from "react";
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

// import ImageGenerator from "../image-gen";
// import CopilotImageGenerator from "../image-gen/CopilotImageGenerator";

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

  const { postCanvas } = CustomerService();

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
        // Nếu đang select nhiều object thì đừng handle từng cái
        if (canvas.getActiveObject() instanceof fabric.ActiveSelection) {
          setToolbarVisible(false); // Hide toolbar vì đang multi select
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

  const createNewCanvas = () => {
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

    toast.success(`Tạo canvas mới ${width}x${height} ${unit}`);
  };

  const updateScaleRatio = () => {
    if (!canvasRef.current || !canvasWrapperRef.current) return;

    const wrapperParent = canvasWrapperRef.current.parentElement;
    if (!wrapperParent) return;

    const parentWidth = wrapperParent.clientWidth;
    const parentHeight = wrapperParent.clientHeight;

    const canvasWidth = convertToPixels(
      parseFloat(canvasWidthInput) || 0,
      unit
    );
    const canvasHeight = convertToPixels(
      parseFloat(canvasHeightInput) || 0,
      unit
    );

    const widthRatio = parentWidth / canvasWidth;
    const heightRatio = parentHeight / canvasHeight;

    const ratio = Math.min(widthRatio, heightRatio, 1); // fit cả width & height, không to hơn 1

    canvasRef.current.setZoom(ratio);
    canvasRef.current.requestRenderAll();

    // Wrapper div chỉ để giữ vị trí, không scale
    canvasWrapperRef.current.style.width = `${canvasWidth}px`;
    canvasWrapperRef.current.style.height = `${canvasHeight}px`;

    setScaleRatio(ratio); // Nếu cần hiển thị % scale trên UI thì giữ state này
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
    const index = getObjectIndex(iTextObj); // Lưu lại vị trí cũ

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

    // ✅ Đợi 1 tick rồi mới move về đúng layer + setActiveObject để Fabric không đẩy lên top
    setTimeout(() => {
      if (canvasRef.current) {
        textbox.moveTo(index);
        canvasRef.current.setActiveObject(textbox);
        canvasRef.current.renderAll();
      }
    }, 0);

    // ✅ Update properties
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

  const loadCanvasFromDescription = (canvasDescription: string) => {
    if (!canvasRef.current) return;
    isRestoringRef.current = true;
    const safeJson = sanitizeCanvasJSON(canvasDescription);
    canvasRef.current.loadFromJSON(safeJson, () => {
      canvasRef.current?.renderAll();
      isRestoringRef.current = false;
      toast.success("Đã tải canvas thành công!");
    });
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

  const saveCanvasAsJSON = async () => {
    if (!canvasRef.current) return;
    const canvasJson = canvasRef.current.toJSON();
    console.log(canvasJson, "canvasJson");
    const canvasDescription = JSON.stringify(canvasJson); // Đúng yêu cầu: JSON.stringify vào description

    const canvasTitle = prompt("Nhập tiêu đề cho canvas:");
    if (!canvasTitle) {
      toast.error("Bạn cần nhập tiêu đề canvas.");
      return;
    }

    try {
      await postCanvas({
        canvasTitle,
        canvasDescription,
      });

      // Sau khi gọi API xong, tải file JSON
      const blob = new Blob([canvasDescription], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "canvas.json";
      link.click();
    } catch (err) {
      console.error("Lỗi gửi canvas:", err);
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="font-bold text-lg text-primary">
          🎨 PlushDoll Studio
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={canvasWidthInput}
            onChange={(e) => setCanvasWidthInput(e.target.value)}
            placeholder="Width"
            className="w-24"
          />
          <Input
            type="number"
            value={canvasHeightInput}
            onChange={(e) => setCanvasHeightInput(e.target.value)}
            placeholder="Height"
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
            Undo
          </Button>
          <Button variant="outline" onClick={redo}>
            <Redo2 className="w-4 h-4 mr-1" />
            Redo
          </Button>
          <Button variant="outline" onClick={saveCanvasAsPNG}>
            <Download className="w-4 h-4 mr-1" />
            PNG
          </Button>
          <Button variant="outline" onClick={saveCanvasAsJSON}>
            <Download className="w-4 h-4 mr-1" />
            JSON
          </Button>
          <Input
            type="file"
            accept=".json"
            onChange={(e) =>
              e.target.files && loadCanvasFromJSON(e.target.files[0])
            }
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 border-r bg-white p-4 flex flex-col gap-4 relative`}
        >
          <Button
            size="icon"
            variant="outline"
            className="absolute -right-4 top-4 z-10"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? "➡️" : "⬅️"}
          </Button>

          {!isSidebarCollapsed ? (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  setIsDrawing((prev) => {
                    canvasRef.current!.isDrawingMode = !prev;
                    return !prev;
                  })
                }
              >
                <Pencil className="w-4 h-4 mr-1" />
                {isDrawing ? "Disable" : "Enable"} Draw
              </Button>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && uploadImage(e.target.files[0])
                }
              />

              <Button
                variant="outline"
                onClick={() => {
                  const text = new fabric.Textbox("Text here", {
                    left: 100,
                    top: 100,
                    width: 150,
                    textAlign: "center",
                    fontSize: 20,
                    fill: "#000",
                    // padding: 10,
                  });
                  canvasRef.current?.add(text);
                  canvasRef.current?.setActiveObject(text);
                  saveState();
                }}
              >
                <FilePlus className="w-4 h-4 mr-1" />
                Add Text
              </Button>

              <Button variant="destructive" onClick={removeSelected}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>

              <div>
                <label>Brush Color</label>
                <Input
                  type="color"
                  defaultValue="#000000"
                  onChange={(e) =>
                    (canvasRef.current!.freeDrawingBrush.color = e.target.value)
                  }
                />
              </div>

              <div>
                <label>Brush Size</label>
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
              {/* <CopilotImageGenerator />

              <ImageGenerator /> */}

              {/* CanvasList luôn được mount, chỉ toggle hiển thị UI bằng hidden */}
              <div className={isSidebarCollapsed ? "hidden" : ""}>
                <CanvasList onSelect={loadCanvasFromDescription} />
              </div>
            </>
          ) : (
            <>
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  setIsDrawing((prev) => {
                    canvasRef.current!.isDrawingMode = !prev;
                    return !prev;
                  })
                }
              >
                <Pencil className="w-4 h-4" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const text = new fabric.IText("Text", {
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
        {/* Canvas */}
        {/* <div className="flex-1 p-4 pt-8 flex relative"> */}
        {/* <Card className="flex-1 shadow-lg"> */}
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
                  parseFloat(canvasWidthInput) || 0,
                  unit
                )}px`,
                height: `${convertToPixels(
                  parseFloat(canvasHeightInput) || 0,
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
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
        {/* </CardContent> */}
        {/* </Card> */}
        {/* </CardContent> */}
        {/* </Card> */}
      </div>
    </div>
  );
};

export default PlushDollDesign;
