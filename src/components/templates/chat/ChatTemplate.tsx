import ChatSidebar from "@/components/organisms/customer/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/customer/chat/ChatHeader";
import MessageList from "@/components/organisms/customer/chat/MessageList";
import MessageComposer from "@/components/molecules/customer/chat/MessageComposer";
import InfoAboutTheConversationTab from "@/components/organisms/customer/chat/InfoAboutTheConversationTab";
import { useState } from "react";

interface ChatTemplateProps {
  setShouldScroll: any;
  message: Message[];
  users: UserChat[];
  chatRoomID: string;
  onSelectChat: any;
  onSendMessage: (message: string) => void;
  shouldScrollToBottom: boolean;
  loadingMessage: boolean;
  onDeletMessage: any;
  onEditMessage: any;
}

export default function ChatTemplate({
  message,
  users,
  chatRoomID,
  onSelectChat,
  onSendMessage,
  onDeletMessage,
  onEditMessage,
}: ChatTemplateProps) {
  const currentChatUser = users[0];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSetIsOpen =()=>{
    setIsOpen(!isOpen)
  }
  return (
    <div className="bg-gray-200 py-3 px-1 h-screen">
      <div className=" flex w-full h-full overflow-hidden gap-4 p-3">
        <div className="flex-1.5 border border-solid rounded-xl bg-white">
          <ChatSidebar
            users={users}
            messages={message}
            activeChat={chatRoomID}
            onSelectChat={onSelectChat}
          />
        </div>

        <div className="flex flex-5 flex-col bg-white rounded-xl">
          <div className="sticky top-0 z-10">
            {currentChatUser && (
              <ChatHeader
              setIsOpen={handleSetIsOpen}
                user={users.filter((item) => item.chatRoomID === chatRoomID)}
              />
            )}
          </div>
          {currentChatUser && (
            <div className="flex-1 overflow-y-auto">
              <MessageList
                onDeleteMessage={onDeletMessage}
                onEditMessage={onEditMessage}
                messages={message}
                users={users.filter((item) => item.chatRoomID === chatRoomID)}
              />
            </div>
          )}
          {currentChatUser ? (
            <div className="sticky bottom-0 z-10">
              <MessageComposer onSendMessage={onSendMessage} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen">
              Chưa có ai để trò chuyện
            </div>
          )}
        </div>
        {isOpen && (
          <div className="flex flex-2 flex-col rounded-xl bg-white">
            <InfoAboutTheConversationTab />
          </div>
        )}
      </div>
    </div>
  );
}
