import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileImage, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface ExportDesignComponentProps {
  canvasRef: React.RefObject<fabric.Canvas | null>;
  currentCanvasTitle: string;
}

const ExportDesignComponent: React.FC<ExportDesignComponentProps> = ({
  canvasRef,
  currentCanvasTitle,
}) => {
  const saveCanvasAsPNG = () => {
    const dataURL = canvasRef.current?.toDataURL({ format: "png" });
    if (dataURL) {
      const link = document.createElement("a");
      link.href = dataURL;
      const fileName = currentCanvasTitle
        ? `${currentCanvasTitle}.png`
        : `thiết_kế_${new Date().toISOString().slice(0, 10)}.png`;
      link.download = fileName;
      link.click();
      toast.success("Đã xuất thiết kế dưới dạng PNG thành công!");
    } else {
      toast.error("Không thể xuất thiết kế. Vui lòng thử lại!");
    }
  };

  const saveCanvasAsJPEG = () => {
    const dataURL = canvasRef.current?.toDataURL({
      format: "jpeg",
      quality: 0.9,
    });
    if (dataURL) {
      const link = document.createElement("a");
      link.href = dataURL;
      const fileName = currentCanvasTitle
        ? `${currentCanvasTitle}.jpeg`
        : `thiết_kế_${new Date().toISOString().slice(0, 10)}.jpeg`;
      link.download = fileName;
      link.click();
      toast.success("Đã xuất thiết kế dưới dạng JPEG thành công!");
    } else {
      toast.error("Không thể xuất thiết kế. Vui lòng thử lại!");
    }
  };

  const saveCanvasAsJPG = () => {
    const dataURL = canvasRef.current?.toDataURL({
      format: "jpeg",
      quality: 0.9,
    });
    if (dataURL) {
      const link = document.createElement("a");
      link.href = dataURL;
      const fileName = currentCanvasTitle
        ? `${currentCanvasTitle}.jpg`
        : `thiết_kế_${new Date().toISOString().slice(0, 10)}.jpg`;
      link.download = fileName;
      link.click();
      toast.success("Đã xuất thiết kế dưới dạng JPG thành công!");
    } else {
      toast.error("Không thể xuất thiết kế. Vui lòng thử lại!");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span className="text-xs font-medium">Xuất thiết kế</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-85" align="end" side="bottom">
        <DropdownMenuItem className="cursor-pointer" onClick={saveCanvasAsPNG}>
          <FileImage className="w-4 h-4 mr-2" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium">PNG</span>
            <span className="text-xs text-muted-foreground">
              Phù hợp nhất cho hình ảnh, hình minh họa phức tạp
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={saveCanvasAsJPEG}>
          <FileImage className="w-4 h-4 mr-2" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium">JPEG</span>
            <span className="text-xs text-muted-foreground">
              Dung lượng nhẹ, lý tưởng cho ảnh chụp
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={saveCanvasAsJPG}>
          <FileImage className="w-4 h-4 mr-2" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium">JPG</span>
            <span className="text-xs text-muted-foreground">
              Phù hợp nhất để chia sẻ
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDesignComponent;
