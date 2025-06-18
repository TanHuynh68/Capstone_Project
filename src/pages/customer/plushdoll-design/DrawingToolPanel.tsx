import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, Eraser, Minus, ChevronLeft } from "lucide-react";

interface DrawingToolPanelProps {
  isOpen: boolean;
  onClose: () => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushWidth: number;
  setBrushWidth: (width: number) => void;
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
  isErasing: boolean;
  setIsErasing: (v: boolean) => void;
  eraserWidth: number;
  setEraserWidth: (width: number) => void;
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
  setToolbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveText: React.Dispatch<React.SetStateAction<fabric.Text | null>>;
}

const BRUSH_WIDTHS = [2, 4, 8, 12, 16, 20];
const ANIMATION_DURATION = 150;

const DrawingToolPanel: React.FC<DrawingToolPanelProps> = ({
  isOpen,
  onClose,
  brushColor,
  setBrushColor,
  brushWidth,
  setBrushWidth,
  isDrawing,
  setIsDrawing,
  isErasing,
  setIsErasing,
  eraserWidth,
  setEraserWidth,
  canvasRef,
  setToolbarVisible,
  setActiveText,
}) => {
  const [widthPopoverOpen, setWidthPopoverOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      canvas &&
      typeof canvas.renderAll === "function" &&
      canvas.getElement()
    ) {
      canvas.isDrawingMode = isDrawing || isErasing;
      if (isDrawing || isErasing) {
        canvas.discardActiveObject();
        setToolbarVisible(false);
        setActiveText(null);
      }
      canvas.renderAll();
    }
  }, [isDrawing, isErasing]);

  // Handle close with animation
  useEffect(() => {
    if (!isOpen && isClosing) {
      const timer = setTimeout(() => setIsClosing(false), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  const handlePenClick = () => {
    if (isDrawing && !isErasing) {
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
      setIsErasing(false);
    }
  };

  const handleEraserClick = () => {
    if (isErasing) {
      setIsErasing(false);
    } else {
      setIsErasing(true);
      setIsDrawing(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, ANIMATION_DURATION);
  };

  // Only render if open or animating close
  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`w-[80px] flex flex-col items-center justify-start overflow-visible p-4 relative z-50
        ${isClosing ? "sidebar-panel-closing" : "sidebar-panel-opening"}
      `}
      style={{
        height: "auto", // Set height based on content
        transition: "height 0.15s ease", // Smooth transition when the height changes
      }}
    >
      {/* Close button */}
      <button
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border shadow rounded-full w-6 h-6 flex items-center justify-center z-10"
        onClick={handleClose}
        aria-label="Đóng panel"
        tabIndex={0}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Current Tool Indicator */}
      {/* <div className="w-full text-center mb-3">
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isErasing
              ? "bg-pink-100 text-pink-700 border border-pink-200"
              : isDrawing
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-700 border border-gray-200"
          }`}
        >
          {isErasing ? "Gôm xóa" : isDrawing ? "Bút vẽ" : "Chọn công cụ"}
        </div>
      </div> */}

      {/* Pen Tool */}
      <button
        className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all shadow-sm mb-4 ${
          isDrawing && !isErasing
            ? "border-blue-500 bg-blue-50"
            : "border-transparent bg-white hover:bg-blue-100"
        }`}
        onClick={handlePenClick}
        title="Bút vẽ"
      >
        <Pencil className="w-7 h-7 text-blue-500" />
      </button>

      {/* Eraser Tool */}
      <button
        className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all shadow-sm mb-4 ${
          isErasing
            ? "border-pink-400 bg-pink-50"
            : "border-transparent bg-white hover:bg-pink-100"
        }`}
        onClick={handleEraserClick}
        title="Gôm xoá"
      >
        <Eraser className="w-7 h-7 text-pink-400" />
      </button>

      {/* Color Picker */}
      <input
        type="color"
        value={brushColor}
        onChange={(e) => setBrushColor(e.target.value)}
        className="circle-color-picker w-12 h-12 mb-4 cursor-pointer shadow-sm"
        style={{
          background: brushColor,
          WebkitAppearance: "none",
          MozAppearance: "none",
          border: "none",
          outline: "none",
          borderRadius: "50%",
          padding: 0,
          overflow: "hidden",
          opacity: isErasing ? 0.5 : 1,
          pointerEvents: isErasing ? "none" : "auto",
        }}
        title={
          isErasing
            ? "Không thể thay đổi màu khi đang sử dụng gôm"
            : "Chọn màu bút"
        }
        disabled={isErasing}
      />

      {/* Brush Width */}
      <Popover open={widthPopoverOpen} onOpenChange={setWidthPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-sm mb-4 ${
              widthPopoverOpen ? "border-gray-500" : "border-gray-200"
            }`}
            title={isErasing ? "Độ dày gôm" : "Độ dày bút"}
            onClick={() => setWidthPopoverOpen(true)}
          >
            <Minus className="w-6 h-6 text-gray-700" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          sideOffset={16}
          className="w-32 flex flex-col items-center gap-2 p-3"
        >
          <div className="flex flex-col gap-2 items-center">
            {BRUSH_WIDTHS.map((w) => (
              <button
                key={w}
                className={`rounded-full border-2 flex items-center justify-center transition-all ${
                  (isErasing ? eraserWidth : brushWidth) === w
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent bg-white hover:bg-blue-100"
                }`}
                style={{ width: w + 12, height: w + 12 }}
                onClick={() => {
                  if (isErasing) {
                    setEraserWidth(w);
                  } else {
                    setBrushWidth(w);
                  }
                }}
                title={`Độ dày ${w}px`}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: w,
                    height: w,
                    background: isErasing ? "#ffffff" : brushColor,
                    border: isErasing ? "1px solid #ccc" : "none",
                  }}
                />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DrawingToolPanel;
