import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Save, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface SaveDesignComponentProps {
  currentCanvasId: string | null;
  saveCanvasAsJSON: () => Promise<void>;
  newVersionCanvas: (params: { canvasInfoId: string }) => Promise<any>;
}

const SaveDesignComponent: React.FC<SaveDesignComponentProps> = ({
  currentCanvasId,
  saveCanvasAsJSON,
  newVersionCanvas,
}) => {
  const handleSaveVersion = async () => {
    if (!currentCanvasId) {
      toast.error("Không có canvas để lưu version!");
      return;
    }
    try {
      const res = await newVersionCanvas({
        canvasInfoId: currentCanvasId,
      });
      if (res?.isSuccess) {
        toast.success("Đã lưu version mới thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi lưu version!");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi lưu version!");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          <span className="text-xs font-medium">Lưu thiết kế</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="bottom">
        <DropdownMenuItem className="cursor-pointer" onClick={saveCanvasAsJSON}>
          <Save className="w-4 h-4 mr-2" />
          <span className="text-xs font-medium">Lưu thiết kế</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleSaveVersion}
          disabled={!currentCanvasId}
        >
          <Save className="w-4 h-4 mr-2" />
          <span className="text-xs font-medium">Lưu version</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SaveDesignComponent;

