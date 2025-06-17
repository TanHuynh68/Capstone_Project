import CanvasList from "./get-canvas";

interface CanvasListSidebarProps {
  onSelect: (desc: string, title: string, id: string) => void;
  isOpen: boolean;
  initialCanvasState?: {
    canvasId: string;
    canvasTitle: string;
    canvasDescription: string;
  };
  selectedCanvasId?: string;
}

export default function CanvasListSidebar({
  onSelect,
  isOpen,
  initialCanvasState,
  selectedCanvasId,
}: CanvasListSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="w-[360px] h-full border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-foreground">Dự án của bạn</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <CanvasList
          onSelect={onSelect}
          initialCanvasState={initialCanvasState}
          selectedCanvasId={selectedCanvasId}
        />
      </div>
    </div>
  );
}
