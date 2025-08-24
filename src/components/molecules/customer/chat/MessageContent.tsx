"use client";

import ChatImage from "@/components/atoms/customer/chat/chat-show-data/ChatImage";
import ChatJson from "@/components/atoms/customer/chat/chat-show-data/ChatJson";
import ChatLink from "@/components/atoms/customer/chat/chat-show-data/ChatLink";
import ChatText from "@/components/atoms/customer/chat/chat-show-data/ChatText";

import { useState, useEffect } from "react";
import CopyCanvas from "@/pages/customer/plushdoll-design/copy-canvas/CopyCanvas";

interface MessageContentProps {
  content: string;
  messageType: string;
  isCurrentUser?: boolean;
  className?: string;
}

export default function MessageContent({
  content,
  messageType,
  isCurrentUser = false,
  className = "",
}: MessageContentProps) {
  const [copied, setCopied] = useState(false);

  // Reset copied state after delay to allow user to copy again
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const renderContent = () => {
    switch (messageType?.toLowerCase()) {
      case "image":
        return (
          <ChatImage
            src={content}
            alt="Hình ảnh tin nhắn"
            isCurrentUser={isCurrentUser}
            className={className}
          />
        );
      case "link":
        return (
          <ChatLink
            url={content}
            isCurrentUser={isCurrentUser}
            className={className}
          />
        );
      case "json":
        try {
          const data = JSON.parse(content);
          if (data.imageUrl && data.title && data.id && data.description) {
            console.log(data, "asdasdasdsa");
            return (
              <CopyCanvas
                canvasId={data.id}
                canvasTitle={data.title}
                imageUrl={data.imageUrl}
                canvasDescription={data.description} // truyền thêm dòng này
                isCurrentUser={isCurrentUser}
              />
            );
          }
        } catch {
          // Ignore JSON parse errors
        }
        return <ChatJson data={content} className={className} />;
      case "text":
      default:
        return (
          <ChatText
            content={content}
            isCurrentUser={isCurrentUser}
            className={className}
          />
        );
    }
  };

  return <div className="max-w-[800px]">{renderContent()}</div>;
}
