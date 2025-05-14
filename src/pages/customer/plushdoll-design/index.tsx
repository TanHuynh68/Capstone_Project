import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  FilePlus,
  Pencil,
  Trash2,
  Undo2,
  Redo2,
  Download,
  UploadCloud,
} from "lucide-react";
import CustomerService from "@/services/CustomerService";
import { toast } from "sonner";
import CanvasList from "./get-canvas";

const PlushDollDesign: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const canvasContainerRef = useRef<HTMLCanvasElement | null>(null);
  const isRestoringRef = useRef(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const historyRef = useRef<{ states: string[]; index: number }>({
    states: [],
    index: -1,
  });

  const { postCanvas } = CustomerService();

  // Initial canvas & events setup
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const canvas = new fabric.Canvas(canvasContainerRef.current, {
      backgroundColor: "#ffffff",
    });
    canvas.freeDrawingBrush.color = "#ff0000";
    canvas.freeDrawingBrush.width = 3;
    canvas.renderAll();
    canvasRef.current = canvas;
    saveInitialState();

    // Selection events for smart toolbar
    canvas.on(
      "selection:created",
      (e) => e.selected && handleSelection(e.selected[0])
    );
    canvas.on(
      "selection:updated",
      (e) => e.selected && handleSelection(e.selected[0])
    );
    canvas.on("selection:cleared", () => {
      setToolbarVisible(false);
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

  const handleSelection = (obj: fabric.Object) => {
    setToolbarVisible(true);
    updateToolbarPos(obj);
  };

  const updateToolbarPos = (obj: fabric.Object) => {
    const bound = obj.getBoundingRect(true, true);
    setToolbarPos({
      x: bound.left + bound.width / 2,
      y: bound.top - 100,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    // Bỏ qua nếu đang gõ trong input, textarea, hoặc contenteditable
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
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      removeSelected();
    }
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
    const obj = canvasRef.current?.getActiveObject();
    if (obj) {
      canvasRef.current?.remove(obj);
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
      <header className="flex items-center justify-between bg-white border-b p-4 shadow-sm sticky top-0 z-10">
        <div className="font-bold text-lg text-primary">
          🎨 PlushDoll Studio
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
                  const text = new fabric.IText("Text here", {
                    left: 100,
                    top: 100,
                    fontSize: 20,
                    fill: "#000",
                  });
                  canvasRef.current?.add(text);
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
                  defaultValue="#ff0000"
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
        <Card className="flex-1 m-4 shadow-lg">
          <CardContent className="flex justify-center items-center bg-gray-50 p-4 relative">
            <div className="relative">
              <canvas
                ref={canvasContainerRef}
                width={1000}
                height={600}
                className="border rounded-lg shadow-inner"
              />

              {toolbarVisible && (
                <div
                  className="absolute z-50 bg-white shadow-lg rounded-md p-2 flex gap-2 select-none"
                  style={{
                    top: toolbarPos.y,
                    left: toolbarPos.x,
                    transform: "translateX(-50%)",
                  }}
                  onMouseDown={startDrag}
                >
                  <Button size="icon" variant="outline" onClick={undo}>
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={redo}>
                    <Redo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={removeSelected}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={saveCanvasAsPNG}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={saveCanvasAsJSON}
                  >
                    <UploadCloud className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlushDollDesign;
