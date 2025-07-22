import { forwardRef } from "react";
import SidebarPanelWrapper from "./SidebarPanelWrapper";
import { FolderOpen } from "lucide-react";
import CanvasList from "./get-canvas";

interface CanvasListSidebarProps {
  onSelect: (desc: string, title: string, id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  initialCanvasState?: {
    canvasId: string;
    folderName: string;
    canvasDescription: string;
  };
  selectedCanvasId?: string;
}

const CanvasListSidebar = forwardRef<HTMLDivElement, CanvasListSidebarProps>(
  (
    { onSelect, isOpen, onClose, initialCanvasState, selectedCanvasId },
    ref
  ) => {
    if (!isOpen) return null;
    return (
      <SidebarPanelWrapper
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        title="Dự án"
        icon={<FolderOpen className="w-5 h-5" />}
      >
        <div className="flex-1 overflow-y-auto">
          <CanvasList
            onSelect={onSelect}
            initialCanvasState={initialCanvasState}
            selectedCanvasId={selectedCanvasId}
          />
        </div>
      </SidebarPanelWrapper>
    );
  }
);

export default CanvasListSidebar;
