"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar";
import ChatTime from "@/components/atoms/customer/chat/ChatTime";
import MessageContent from "@/components/molecules/customer/chat/MessageContent";
import MessageActions from "@/components/atoms/customer/chat/MessageActions";
import DeleteMessageModal from "@/components/molecules/customer/chat/DeleteMessageModal";
import EditMessageModal from "@/components/molecules/customer/chat/EditMessageModal";
import { useCurrentUser } from "@/components/utils";


interface ChatMessageProps {
  id: string; // Message ID
  content: string;
  timestamp: string;
  users: UserChat[];
  senderID: string;
  messageType: string;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
}

export default function ChatMessage({
  id,
  content,
  timestamp,
  messageType,
  users,
  senderID,
  onDeleteMessage,
  onEditMessage,
}: ChatMessageProps) {
  const user = useCurrentUser();
  const isCurrentUser = senderID === user.id;

  // State for modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  console.log('users[0: ', users[0])
  // Lấy thông tin người gửi
  const getSenderInfo = () => {
    if (users[0]?.account1.accountID === senderID) {
      return {
        name: users[0]?.account1.accountName || "Bạn",
        avatar: users[0]?.account1.avatar,
      };
    } else {
      return {
        name: users[0]?.account2.accountName || "Người dùng",
        avatar: users[0]?.account1.avatar,
      };
    }
  };

  const senderInfo = getSenderInfo();
  console.log('senderInfo: ', senderInfo.avatar)
  // Handlers for message actions
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async (messageID: string) => {
    if (onDeleteMessage) {
      await onDeleteMessage(messageID);
    }
  };

  const handleEditConfirm = async (messageId: string, newContent: string) => {
    if (onEditMessage) {
      await onEditMessage(messageId, newContent);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex mb-4 group relative",
          isCurrentUser ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar bên trái cho tin nhắn của người khác */}
        {!isCurrentUser && (
          <ChatAvatar
            src={senderInfo.avatar}
            name={senderInfo.name}
            size="sm"
            className="mr-3 self-end"
          />
        )}

        {/* Nội dung tin nhắn */}
        <div className="relative">
          <MessageActions
          messageType={messageType}
            className="pt-2"
            messageId={id}
            content={content}
            timestamp={timestamp}
            isCurrentUser={isCurrentUser}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
          />
        </div>
        <div
          className={cn(
            "max-w-[70%] ml-2",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          {/* Bubble tin nhắn */}
          <div
            className={cn(
              "rounded-lg px-3 py-2",
              isCurrentUser
                ? "bg-blue-500 text-white rounded-br-sm"
                : "bg-gray-200 text-gray-900 rounded-bl-sm",
              // Điều chỉnh padding cho các loại tin nhắn khác nhau
              messageType?.toLowerCase() === "image" ? "p-1" : "px-3 py-2",
              messageType?.toLowerCase() === "link" ? "p-0" : ""
            )}
          >
            <div>
              <MessageContent
                content={content}
                messageType={messageType}
                isCurrentUser={isCurrentUser}
              />
              {/* Message Actions (hiển thị khi hover) */}
            </div>
          </div>

          {/* Thời gian */}
          <ChatTime
            className={cn(
              "mt-1 text-xs",
              isCurrentUser ? "text-gray-400" : "text-gray-500 flex",
            )}
            time={timestamp}
            isCurrentUser={isCurrentUser}
          />
        </div>

        {/* Avatar bên phải cho tin nhắn của người dùng hiện tại */}
        {isCurrentUser && (
          <ChatAvatar
            src={senderInfo?.avatar}
            name={senderInfo.name}
            color="bg-blue-500"
            size="sm"
            className="ml-3 self-end"
          />
        )}
      </div>

      {/* Delete Message Modal */}
      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        messageId={id}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Edit Message Modal */}
      <EditMessageModal
        isOpen={isEditModalOpen}
        messageId={id}
        content={content}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
      />
    </>
  );
}
