import { useState, useMemo, useEffect, forwardRef } from "react";
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

// Thêm danh sách gradient colors
const gradientColors = [
  {
    name: "Sunset",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Ocean",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    name: "Forest",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  {
    name: "Fire",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    name: "Sky",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
  {
    name: "Purple",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    value: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
  },
  {
    name: "Orange",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
  {
    name: "Pink",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  },
  {
    name: "Blue",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
    value: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
  },
  {
    name: "Green",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    value: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
  {
    name: "Red",
    gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    value: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  },
  {
    name: "Yellow",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    value: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  },
  {
    name: "Rainbow",
    gradient:
      "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
    value:
      "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  },
  {
    name: "Neon",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    name: "Pastel",
    gradient: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
    value: "linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%)",
  },
  {
    name: "Dark",
    gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    value: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
  },
];

const BackgroundColorPanel = forwardRef<
  HTMLDivElement,
  BackgroundColorPanelProps
>(({ isOpen, onClose, backgroundColor, setBackgroundColor }, ref) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!backgroundColor || backgroundColor === "" || typeof backgroundColor !== 'string') {
      setBackgroundColor("#ffffff");
    }
  }, [backgroundColor, setBackgroundColor]);

  const filteredSolidColors = useMemo(() => {
    if (!searchQuery) return solidColors;
    return solidColors.filter((color) =>
      String(color).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredGradientColors = useMemo(() => {
    if (!searchQuery) return gradientColors;
    return gradientColors.filter((gradient) =>
      gradient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <SidebarPanelWrapper
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      title="Chọn màu nền"
      icon={<Palette className="w-5 h-5 mr-2" />}
    >
      <SidebarSearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={() => {}}
        placeholder="Tìm kiếm màu sắc..."
      />

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Màu nền</h3>
        <div className="flex flex-wrap gap-2">
          {filteredSolidColors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border shadow-sm hover:scale-110 transition-transform
                  ${
                    color === "#ffffff" ? "border-border" : "border-transparent"
                  }
                  ${
                    String(color).toLowerCase() === String(backgroundColor).toLowerCase()
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

      <div className="space-y-4 mt-6">
        <h3 className="text-sm font-medium text-foreground">Gradient</h3>
        <div className="grid grid-cols-3 gap-2">
          {filteredGradientColors.map((gradient) => (
            <button
              key={gradient.name}
              className={`w-full h-12 rounded-lg border shadow-sm hover:scale-105 transition-transform relative
                  ${
                    gradient.value === backgroundColor
                      ? "ring-2 ring-primary ring-offset-2"
                      : "border-border"
                  }`}
              style={{ background: gradient.gradient }}
              onClick={() => setBackgroundColor(gradient.value)}
              aria-label={`Chọn gradient ${gradient.name}`}
            >
              <span className="absolute bottom-1 left-1 text-xs text-white font-medium drop-shadow-lg">
                {gradient.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm">Tùy chỉnh:</span>
        <div className="relative">
          <input
            type="color"
            value={
              String(backgroundColor).startsWith("#") ? String(backgroundColor) : "#ffffff"
            }
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-8 h-8 border rounded-full cursor-pointer appearance-none hover:scale-110 transition-transform bg-transparent"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          />
          <div
            className="absolute inset-0 rounded-full pointer-events-none border shadow-sm"
            style={{
              background: String(backgroundColor).startsWith("#")
                ? String(backgroundColor)
                : "#ffffff",
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground max-w-20 truncate">
          {String(backgroundColor).startsWith("#") ? String(backgroundColor) : "Gradient"}
        </span>
      </div>
    </SidebarPanelWrapper>
  );
});

export default BackgroundColorPanel;
