import ChatSidebar from "@/components/organisms/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/chat/ChatHeader";
import MessageList from "@/components/organisms/chat/MessageList";
import MessageComposer from "@/components/molecules/chat/MessageComposer";

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
          )
        : <div className="flex justify-center items-center h-screen">
          Chưa có ai để trò chuyện
        </div>
        }
        </div>
      </div>
    </div>
  );
}
