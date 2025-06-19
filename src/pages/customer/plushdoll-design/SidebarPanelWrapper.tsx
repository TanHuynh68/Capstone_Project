import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarPanelWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SidebarPanelWrapper: React.FC<SidebarPanelWrapperProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const ANIMATION_DURATION = 100; // ms, khớp với CSS

  // Khi panel đóng, chạy animation rồi mới gọi onClose
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, ANIMATION_DURATION);
  };

  // Chỉ render khi mở hoặc đang đóng (để animation chạy xong)
  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`w-[300px] h-full flex flex-col overflow-visible
        ${isClosing ? "sidebar-panel-closing" : "sidebar-panel-opening"}
      `}
    >
      <div className="relative h-full">
        <div className="h-full border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-2 font-medium text-base text-foreground">
            {icon}
            {title}
          </div>
          <div
            className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent transition-opacity duration-400 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="p-2 flex flex-col">{children}</div>
          </div>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-card hover:bg-muted shadow-md rounded-full w-6 h-6 flex items-center justify-center"
          onClick={handleClose}
          aria-label="Đóng panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SidebarPanelWrapper;
