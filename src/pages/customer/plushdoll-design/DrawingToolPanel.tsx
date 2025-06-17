import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pencil } from "lucide-react";
import SidebarPanelWrapper from "./SidebarPanelWrapper";

interface DrawingToolPanelProps {
  isOpen: boolean;
  onClose: () => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushWidth: number;
  setBrushWidth: (width: number) => void;
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
}

const DrawingToolPanel: React.FC<DrawingToolPanelProps> = ({
  isOpen,
  onClose,
  brushColor,
  setBrushColor,
  brushWidth,
  setBrushWidth,
  isDrawing,
  setIsDrawing,
}) => {
  return (
    <SidebarPanelWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Công cụ vẽ"
      icon={<Pencil className="w-5 h-5" />}
    >
      <Button
        variant={isDrawing ? "default" : "outline"}
        onClick={() => setIsDrawing(!isDrawing)}
        className="w-full"
      >
        <Pencil className="w-4 h-4 mr-2" />
        Vẽ: {isDrawing ? "Bật" : "Tắt"}
      </Button>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Màu bút</span>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="w-10 h-10 p-0 border rounded-full self-start"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Độ dày bút</span>
        <Slider
          value={[brushWidth]}
          min={1}
          max={20}
          step={1}
          onValueChange={([value]) => setBrushWidth(value)}
          className="w-full"
        />
        <span className="text-xs">{brushWidth}px</span>
      </div>
    </SidebarPanelWrapper>
  );
};

export default DrawingToolPanel;
