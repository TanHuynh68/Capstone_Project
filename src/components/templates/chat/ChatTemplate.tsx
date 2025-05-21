import ChatSidebar from "@/components/organisms/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/chat/ChatHeader";
import MessageList from "@/components/organisms/chat/MessageList";
import MessageComposer from "@/components/molecules/chat/MessageComposer";

interface ChatTemplateProps {
  setShouldScroll: any;
  message: Message[];
  users: UserChat[];
  chatRoomID: string;
  onSelectChat: (chatRoomID: string) => void;
  onSendMessage: (message: string) => void;
  shouldScrollToBottom: boolean;
}

export default function ChatTemplate({
  message,
  users,
  chatRoomID,
  onSelectChat,
  onSendMessage,
  shouldScrollToBottom,
  setShouldScroll
}: ChatTemplateProps) {
  const currentChatUser = users[0];

  return (
    <div className="flex  w-full h-screen  overflow-hidden border border-gray-800 bg-gray-950 text-white">
      <ChatSidebar
        users={users}
        messages={message}
        activeChat={chatRoomID}
        onSelectChat={onSelectChat}
      />

      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10 bg-gray-950">
          <ChatHeader user={currentChatUser} />
        </div>

        {currentChatUser && (
          <div className="overflow-y-auto">
            <MessageList
            setShouldScroll={setShouldScroll}
              shouldScrollToBottom={shouldScrollToBottom}
              messages={message}
              users={users.filter((item) => item.chatRoomID === chatRoomID)}
            />
          </div>
        )}

        <div className="sticky bottom-0 z-10 bg-gray-950">
          <MessageComposer onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
}
