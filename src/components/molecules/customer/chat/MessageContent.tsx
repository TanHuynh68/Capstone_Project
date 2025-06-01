"use client";

import ChatImage from "@/components/atoms/customer/chat/chat-show-data/ChatImage";
import ChatJson from "@/components/atoms/customer/chat/chat-show-data/ChatJson";
import ChatLink from "@/components/atoms/customer/chat/chat-show-data/ChatLink";
import ChatText from "@/components/atoms/customer/chat/chat-show-data/ChatText";

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
