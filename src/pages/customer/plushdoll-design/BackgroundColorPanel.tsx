import React, { useState, useMemo, useEffect } from "react";
import SidebarPanelWrapper from "./SidebarPanelWrapper";
import { Palette } from "lucide-react";
import SidebarSearchBar from "./SidebarSearchBar";

interface BackgroundColorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

const solidColors = [
  "#000000",
  "#4B5563",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#FFFFFF",
  "#EF4444",
  "#F87171",
  "#FB7185",
  "#9333EA",
  "#8B5CF6",
  "#6366F1",
  "#0EA5E9",
  "#38BDF8",
  "#7DD3FC",
  "#10B981",
  "#34D399",
  "#6EE7B7",
  "#22C55E",
  "#4ADE80",
  "#BBF7D0",
  "#EAB308",
  "#FDE047",
  "#F97316",
];

const BackgroundColorPanel: React.FC<BackgroundColorPanelProps> = ({
  isOpen,
  onClose,
  backgroundColor,
  setBackgroundColor,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!backgroundColor || backgroundColor === "") {
      setBackgroundColor("#ffffff");
    }
  }, [backgroundColor, setBackgroundColor]);

  const filteredSolidColors = useMemo(() => {
    if (!searchQuery) return solidColors;
    return solidColors.filter((color) =>
      color.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <SidebarPanelWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Chọn màu nền"
      icon={<Palette className="w-5 h-5 mr-2" />}
    >
      <SidebarSearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={() => {}}
        placeholder="Nhập mã màu (ví dụ: #00c4cc)"
      />

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Màu nền</h3>
        <div className="flex flex-wrap gap-2">
          {filteredSolidColors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border shadow-sm hover:scale-110 transition-transform
                ${color === "#ffffff" ? "border-border" : "border-transparent"}
                ${
                  color.toLowerCase() === backgroundColor.toLowerCase()
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
              style={{ background: color }}
              onClick={() => setBackgroundColor(color)}
              aria-label={`Chọn màu ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm">Tùy chỉnh:</span>
        <div className="relative">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-8 h-8 border rounded-full cursor-pointer appearance-none hover:scale-110 transition-transform bg-transparent"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          />
          <div
            className="absolute inset-0 rounded-full pointer-events-none border shadow-sm"
            style={{ background: backgroundColor }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{backgroundColor}</span>
      </div>
    </SidebarPanelWrapper>
  );
};

export default BackgroundColorPanel;
