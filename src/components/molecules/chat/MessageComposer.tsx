"use client";

import { useState, type FormEvent } from "react";
import { Paperclip, ThumbsUp } from "lucide-react";
import ChatButton from "@/components/atoms/customer/chat/ChatButton";
import ChatInput from "@/components/atoms/customer/chat/ChatInput";
import FileUploadModal from "@/components/molecules/chat/FileUploadModal";
import { toast } from "sonner";
import ChatService from "@/services/ChatService";

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
  // onSendFile?: (file: File) => Promise<void>;
}

export default function MessageComposer({
  onSendMessage,
}: // onSendFile,
MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const { uploadImageMessage } = ChatService();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleFileUpload = async (file: File) => {
    try {
      if (file) {
        console.log("file: ", file);
        const response = await uploadImageMessage(file);
        if (response && response.imageCloudinaryUrl) {
          console.log("handleFileUpload: ", response);
          onSendMessage(response.imageCloudinaryUrl);
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
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4"
      >
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
    </>
  );
}
