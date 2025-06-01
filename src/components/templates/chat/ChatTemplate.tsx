import ChatSidebar from "@/components/organisms/customer/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/customer/chat/ChatHeader";
import MessageList from "@/components/organisms/customer/chat/MessageList";
import MessageComposer from "@/components/molecules/customer/chat/MessageComposer";
import InfoAboutTheConversationTab from "@/components/organisms/customer/chat/InfoAboutTheConversationTab";
import { useState } from "react";
import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar";
import { useCurrentUser } from "@/components/utils";

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
  const userMain = useCurrentUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSetIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const user = users.filter((item) => item.chatRoomID === chatRoomID);

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

          <div className="flex flex-col flex-2 rounded-xl bg-white ">
            <div className="flex-1">
              <div className="mt-10">
                <div className="">
                  <div className="flex justify-center">
                    <ChatAvatar
                    name=""
                    size="xxl"
                    src={
                      userMain.id != user[0].id
                        ? user[0].avatar2
                        : user[0].avatar1
                    }
                  />
                  </div>
                  <div className="text-2xl flex justify-center mt-2">
                    {userMain.id === user[0].id
                      ? user[0].account1Name
                      : user[0].account2Name}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-2 overflow-y-auto">
              <InfoAboutTheConversationTab />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
