import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertToPixels } from "@/utils/convert";

interface CanvasResizeProps {
  actualCanvasWidth: string;
  actualCanvasHeight: string;
  onResize: (width: number, height: number) => void;
}

const CanvasResize: React.FC<CanvasResizeProps> = ({
  actualCanvasWidth,
  actualCanvasHeight,
  onResize,
}) => {
  const [tempCanvasWidth, setTempCanvasWidth] = useState("");
  const [tempCanvasHeight, setTempCanvasHeight] = useState("");
  const [unit, setUnit] = useState<"px" | "cm" | "mm">("px");
  // Store original pixel values for accurate conversion
  const [originalPxWidth, setOriginalPxWidth] = useState("");
  const [originalPxHeight, setOriginalPxHeight] = useState("");

  // Initialize temporary values when actual dimensions change
  useEffect(() => {
    setTempCanvasWidth(actualCanvasWidth);
    setTempCanvasHeight(actualCanvasHeight);
    setOriginalPxWidth(actualCanvasWidth);
    setOriginalPxHeight(actualCanvasHeight);
  }, [actualCanvasWidth, actualCanvasHeight]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempCanvasWidth(newValue);

    // Update original pixel values when user inputs new values
    if (unit === "px") {
      setOriginalPxWidth(newValue);
    } else {
      const pixelsPerUnit = convertToPixels(1, unit);
      const pixelValue = parseFloat(newValue) * pixelsPerUnit;
      setOriginalPxWidth(pixelValue.toString());
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempCanvasHeight(newValue);

    // Update original pixel values when user inputs new values
    if (unit === "px") {
      setOriginalPxHeight(newValue);
    } else {
      const pixelsPerUnit = convertToPixels(1, unit);
      const pixelValue = parseFloat(newValue) * pixelsPerUnit;
      setOriginalPxHeight(pixelValue.toString());
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as "px" | "cm" | "mm";

    // Always convert from the original pixel values to ensure accuracy
    if (newUnit === "px") {
      // Round to whole pixels when converting to px
      setTempCanvasWidth(Math.round(parseFloat(originalPxWidth)).toString());
      setTempCanvasHeight(Math.round(parseFloat(originalPxHeight)).toString());
    } else {
      const pixelsPerUnit = convertToPixels(1, newUnit);
      const widthInUnit = parseFloat(originalPxWidth) / pixelsPerUnit;
      const heightInUnit = parseFloat(originalPxHeight) / pixelsPerUnit;
      setTempCanvasWidth(widthInUnit.toFixed(2));
      setTempCanvasHeight(heightInUnit.toFixed(2));
    }

    setUnit(newUnit);
  };

  const handleConfirm = () => {
    let newWidth: number;
    let newHeight: number;

    if (unit === "px") {
      newWidth = parseFloat(tempCanvasWidth) || 0;
      newHeight = parseFloat(tempCanvasHeight) || 0;
    } else {
      // Convert from the selected unit to pixels
      const pixelsPerUnit = convertToPixels(1, unit);
      newWidth = (parseFloat(tempCanvasWidth) || 0) * pixelsPerUnit;
      newHeight = (parseFloat(tempCanvasHeight) || 0) * pixelsPerUnit;
    }

    // Round to whole pixels when confirming
    newWidth = Math.round(newWidth);
    newHeight = Math.round(newHeight);

    if (newWidth > 0 && newHeight > 0) {
      onResize(newWidth, newHeight);
    }
  };

  return (
    <div className="p-2 w-64">
      <div className="font-semibold text-sm mb-2">Đổi kích thước Canvas</div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Chiều rộng</label>
        <Input
          type="number"
          value={tempCanvasWidth}
          onChange={handleWidthChange}
          className="w-full"
        />
        <label className="text-xs font-medium">Chiều cao</label>
        <Input
          type="number"
          value={tempCanvasHeight}
          onChange={handleHeightChange}
          className="w-full"
        />
        <label className="text-xs font-medium">Đơn vị</label>
        <select
          value={unit}
          onChange={handleUnitChange}
          className="w-full p-2 border rounded"
        >
          <option value="px">px</option>
          <option value="cm">cm</option>
          <option value="mm">mm</option>
        </select>
        <Button onClick={handleConfirm} className="w-full">
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

export default CanvasResize;
