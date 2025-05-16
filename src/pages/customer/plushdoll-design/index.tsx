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
  UploadCloud,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
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

// import ImageGenerator from "../image-gen";
// import CopilotImageGenerator from "../image-gen/CopilotImageGenerator";

const PlushDollDesign: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRestoringRef = useRef(false);
  const clipboardRef = useRef<fabric.Object | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sizePopoverOpen, setSizePopoverOpen] = useState(false);
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);

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

  const handleSelection = (obj: fabric.Object) => {
    setToolbarVisible(true);
    updateToolbarPos(obj);

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
        fontWeight: textObj.fontWeight+'' || "normal",
        fontStyle: textObj.fontStyle || "normal",
        textAlign: textObj.textAlign || "center",
        underline: textObj.underline || false,
      });
    } else {
      setActiveText(null);
    }
  };

  const convertToTextbox = (iTextObj: fabric.IText) => {
    const textbox = new fabric.Textbox(iTextObj.text || "", {
      left: iTextObj.left,
      top: iTextObj.top,
      width: Math.max(iTextObj.width || 0, 150),
      fontSize: iTextObj.fontSize,
      fontFamily: iTextObj.fontFamily,
      fontStyle: iTextObj.fontStyle,
      fontWeight: iTextObj.fontWeight,
      fill: iTextObj.fill,
      textAlign: iTextObj.textAlign || "center",
      underline: iTextObj.underline,
      padding: 10,
    });
    canvasRef.current?.remove(iTextObj);
    canvasRef.current?.add(textbox);
    canvasRef.current?.setActiveObject(textbox);
    saveState();
    handleSelection(textbox);
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

  const copySelected = () => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned: fabric.Object) => {
        clipboardRef.current = cloned;
        // toast.success("Đã copy object.");
      });
    }
  };

  const pasteClipboard = () => {
    if (clipboardRef.current && canvasRef.current) {
      clipboardRef.current.clone((clonedObj: fabric.Object) => {
        clonedObj.set({
          left: (clonedObj.left || 0) + 20,
          top: (clonedObj.top || 0) + 20,
          evented: true,
        });
        canvasRef.current?.add(clonedObj);
        canvasRef.current?.setActiveObject(clonedObj);
        canvasRef.current?.renderAll();
        saveState();
        // toast.success("Đã paste object.");
      });
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
      <header className="sticky top-0 z-50 bg-white border-b p-4 flex items-center justify-between shadow-sm">
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
                            setSizePopoverOpen(false); // ✅ đóng popover
                          }}
                          className={`text-center cursor-pointer h-[30px] leading-[30px] text-sm ${
                            textProperties.fontSize === size ? "bg-muted" : ""
                          }`}
                        >
                          {size}px
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
                      fontWeight: activeText.fontWeight as string,
                      fontStyle: activeText.fontStyle as string,
                      underline: activeText.underline,
                      textAlign:
                        activeText.textAlign as fabric.Textbox["textAlign"],
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
              className="relative bg-white shadow-md"
              style={{
                aspectRatio: "16 / 9",
                width: "80%", // hoặc fix cứng 960px
                maxWidth: "1280px",
              }}
            >
              <canvas ref={htmlCanvasRef} className="w-full h-full" />

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
