import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CanvasList from "@/pages/customer/plushdoll-design/get-canvas";
import ChatService from "@/services/ChatService";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface CanvasInChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCanvas: (
    canvasDescription: string,
    canvasTitle: string,
    canvasId: string
  ) => void;
}

const CanvasInChatModal: React.FC<CanvasInChatModalProps> = ({
  isOpen,
  onClose,
  onSelectCanvas,
}) => {
  const { uploadImageMessage } = ChatService();
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    desc: string;
    title: string;
    id: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Khi chọn canvas, render preview PNG
  const handleSelect = async (desc: string, title: string, id: string) => {
    // Render lại canvas và xuất PNG preview
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 960;
    tempCanvas.height = 540;
    const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
      backgroundColor: "#fff",
    });
    await new Promise((resolve) => {
      fabricCanvas.loadFromJSON(desc, () => {
        fabricCanvas.renderAll();
        resolve(null);
      });
    });
    const dataURL = fabricCanvas.toDataURL({ format: "png" });
    setPreview(dataURL);
    setSelected({ desc, title, id });
  };

  // Khi xác nhận gửi
  const handleSend = async () => {
    if (!selected || !preview) return;
    setIsUploading(true);
    try {
      const blob = await (await fetch(preview)).blob();
      const file = new File([blob], "canvas.png", { type: "image/png" });
      const response = await uploadImageMessage(file);
      if (response && response.imageCloudinaryUrl) {
        onSelectCanvas(
          response.imageCloudinaryUrl,
          selected.title,
          selected.id
        );
        setPreview(null);
        setSelected(null);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Khi đóng modal
  const handleClose = () => {
    setPreview(null);
    setSelected(null);
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Gửi canvas vào chat
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Chọn một canvas để xem trước và gửi vào cuộc trò chuyện.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {!preview ? (
            <CanvasList onSelect={handleSelect} />
          ) : (
            <div className="border border-border rounded-lg p-4 bg-card flex flex-col items-center">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-[400px] h-auto object-contain rounded-lg mb-4"
              />
              <div className="flex gap-2 w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPreview(null);
                    setSelected(null);
                  }}
                  className="border-border text-foreground hover:bg-muted hover:text-foreground"
                  disabled={isUploading}
                >
                  Huỷ
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Gửi vào chat
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CanvasInChatModal;
