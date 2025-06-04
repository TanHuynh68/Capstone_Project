"use client";

import { useState, type FormEvent } from "react";
import { Paperclip, ThumbsUp, Plus, Image, FileText } from "lucide-react";
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
  // onSendFile?: (file: File) => Promise<void>;
}

export default function MessageComposer({
  onSendMessage,
}: // onSendFile,
MessageComposerProps) {
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

  const handleFileUpload = async (file: File) => {
    try {
      if (file) {
        console.log("file: ", file);
        const response = await uploadImageMessage(file);
        if (response && response.imageCloudinaryUrl) {
          console.log("handleFileUpload: ", response);
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
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
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
              <span>Gửi canvas</span>
              <FileText className="h-4 w-4 text-primary" />
            </button>
          </PopoverContent>
        </Popover>

        <ChatButton type="button" onClick={() => setIsFileModalOpen(true)}>
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Đính kèm</span>
        </ChatButton>

        <ChatInput
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ChatButton type="submit" disabled={!message.trim()}>
          <ThumbsUp className="h-5 w-5" />
          <span className="sr-only">Gửi</span>
        </ChatButton>
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
        onSelectCanvas={(imageUrl) => {
          onSendMessage(imageUrl, "image");
        }}
      />
    </>
  );
}
