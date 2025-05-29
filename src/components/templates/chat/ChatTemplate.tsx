import ChatSidebar from "@/components/organisms/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/chat/ChatHeader";
import MessageList from "@/components/organisms/chat/MessageList";
import MessageComposer from "@/components/molecules/chat/MessageComposer";
import ChatService from "@/services/ChatService";
import { toast } from "sonner";
import { MESSAGE } from "@/constants";

interface ChatTemplateProps {
  setShouldScroll: any;
  message: Message[];
  users: UserChat[];
  chatRoomID: string;
  onSelectChat: any;
  onSendMessage: (message: string) => void;
  shouldScrollToBottom: boolean;
  loadingMessage: boolean;
}

export default function ChatTemplate({
  message,
  users,
  chatRoomID,
  onSelectChat,
  onSendMessage,
}: ChatTemplateProps) {
  const currentChatUser = users[0];
  const { deleteMessage, updateMessage } = ChatService();

  const handleDeleteMessage = async (messageId: string) => {
    const response = await deleteMessage(messageId);
    if (response) {
      toast.success(MESSAGE.DELETE_MESSAGE_SUCCESSFULLY);
    }
  };

  // Xử lý chỉnh sửa tin nhắn
  const handleEditMessage = async (messageId: string, newContent: string) => {
    console.log('handleEditMessage: ',{
      messageId, newContent
    })
    await updateMessage({ messageID: messageId, content: newContent });
  };

  return (
    <div className="bg-gray-200">
      <div className="bg-white flex w-full h-screen overflow-hidden border border-gray-800">
        <ChatSidebar
          users={users}
          messages={message}
          activeChat={chatRoomID}
          onSelectChat={onSelectChat}
        />

        <div className="flex flex-1 flex-col">
          <div className="sticky top-0 z-10">
            {currentChatUser && (
              <ChatHeader
                user={users.filter((item) => item.chatRoomID === chatRoomID)}
              />
            )}
          </div>
          {currentChatUser && (
            <div className="flex-1 overflow-y-auto">
              <MessageList
                onDeleteMessage={handleDeleteMessage}
                onEditMessage={handleEditMessage}
                messages={message}
                users={users.filter((item) => item.chatRoomID === chatRoomID)}
              />
            </div>
          )}

          <div className="sticky bottom-0 z-10">
            <MessageComposer onSendMessage={onSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
