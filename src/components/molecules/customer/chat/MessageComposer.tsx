"use client";

import { useState, type FormEvent } from "react";
import { ThumbsUp, Plus, Image, FileText } from "lucide-react";
import ChatButton from "@/components/atoms/customer/chat/ChatButton";
import ChatInput from "@/components/atoms/customer/chat/chat-show-data/ChatInput";
import FileUploadModal from "@/components/molecules/customer/chat/FileUploadModal";
import { toast } from "sonner";
import ChatService from "@/services/ChatService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CanvasInChatModal from "./CanvasInChatModal";

interface MessageComposerProps {
  onSendMessage: (message: string, messageType?: string) => void;
}

export default function MessageComposer({
  onSendMessage,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const { uploadImageMessage } = ChatService();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message, "text");
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow line breaks with Shift + Enter
        return;
      }
      e.preventDefault(); // Prevent default behavior of Enter key
      handleSubmit(e); // Send the message
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      if (file) {
        const response = await uploadImageMessage(file);
        if (response && response.imageCloudinaryUrl) {
          onSendMessage(response.imageCloudinaryUrl, "image");
          toast.success("Đã tải lên tệp thành công");
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Không thể tải lên tệp. Vui lòng thử lại.");
      throw error;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center gap-2 p-4">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Tùy chọn</span>
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="start"
              className="w-44 p-2 bg-popover text-popover-foreground rounded-xl shadow-md border border-border space-y-1"
            >
              <button
                type="button"
                onClick={() => setIsFileModalOpen(true)}
                className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-muted transition-all text-sm font-medium"
              >
                <span>Gửi ảnh</span>
                <Image className="h-4 w-4 text-primary" />
              </button>

              <button
                type="button"
                onClick={() => setIsCanvasModalOpen(true)}
                className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-muted transition-all text-sm font-medium"
              >
                <span>Gửi thiết kế</span>
                <FileText className="h-4 w-4 text-primary" />
              </button>
            </PopoverContent>
          </Popover>

          <ChatInput
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-h-[50px] max-h-[100px] overflow-y-auto break-all"
          />
          <ChatButton type="submit" disabled={!message.trim()}>
            <ThumbsUp className="h-5 w-5" />
            <span className="sr-only">Gửi</span>
          </ChatButton>
        </div>
      </form>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onUpload={handleFileUpload}
      />
      {/* Canvas In Chat Modal */}
      <CanvasInChatModal
        isOpen={isCanvasModalOpen}
        onClose={() => setIsCanvasModalOpen(false)}
        onSelectCanvas={(data) => {
          onSendMessage(JSON.stringify(data), "json");
        }}
      />
    </>
  );
}
