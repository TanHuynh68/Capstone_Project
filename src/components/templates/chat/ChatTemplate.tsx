import ChatSidebar from "@/components/organisms/customer/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/customer/chat/ChatHeader";
import MessageList from "@/components/organisms/customer/chat/MessageList";
import MessageComposer from "@/components/molecules/customer/chat/MessageComposer";
import InfoAboutTheConversationTab from "@/components/organisms/customer/chat/InfoAboutTheConversationTab";
import { useState } from "react";
import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar";
import { useCurrentUser } from "@/components/utils";
import { SidebarCollapseProps } from "@/components/atoms/custom/sidebar-collapse/SidebarCollapse";
import SidebarCollapses from "@/components/molecules/custom/sidebar-collapse/SidebarCollapses";
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
  posts: OfferDetail[];
  fetchOfferPhase: any;
  setOffersPhase: any;
  offersPhase: any
  fetchOffers: any
}

export default function ChatTemplate({
  message,
  users,
  chatRoomID,
  onSelectChat,
  onSendMessage,
  onDeletMessage,
  onEditMessage,
  posts,
  setOffersPhase,
  fetchOfferPhase,
  offersPhase,
  fetchOffers
}: ChatTemplateProps) {
  const currentChatUser = users[0];
  const userMain = useCurrentUser();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const handleSetIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const user = users.filter((item) => item.chatRoomID === chatRoomID);
  const [value, setValue] = useState<string>("");
  console.log("InfoAboutTheConversationTab: ", posts);
  const handleSetTabsContent = (valueItem: any) => {
    setValue(valueItem);
  };
  const items: SidebarCollapseProps[] = [
    {
      title: "Thông tin về đoạn chat",
      subItem: [
        { title: "Xem đề xuất", tabName: "offerPhase" },
        { title: "Timeline", tabName: "timeline" },
        { title: "Xem bài đăng", tabName: "viewPost" },
      ],
    },
    // { title: "File", subItem: ["File phương tiện", "File"] },
  ];
  return (
    <div className="bg-gray-200 py-3 px-1 h-[95%] ">
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
          <div className="flex-4 flex flex-col  rounded-xl bg-white max-w-[590px] min-w-[580px] px-3">

            <div className="flex-1">
              <div className="mt-10">
                <div className="">
                  <div className="flex justify-center">
                    <ChatAvatar
                      name=""
                      size="xxl"
                      src={
                        userMain.id != user[0]?.account1?.accountID
                          ? user[0]?.account1?.avatar
                          : user[0]?.account2?.avatar
                      }
                    />
                  </div>
                  <div className="text-2xl flex justify-center mt-2">
                    {userMain.id != user[0]?.account1?.accountID
                      ? user[0]?.account1?.accountName
                      : user[0]?.account2?.accountName}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <SidebarCollapses onClick={handleSetTabsContent} items={items} />
            </div>
            <div className="flex-4 overflow-y-auto ">
              <InfoAboutTheConversationTab 
              fetchOffers={fetchOffers}
              offersPhase={offersPhase}
              setOffersPhase={setOffersPhase}
              fetchOfferPhase={fetchOfferPhase}
              value={value} posts={posts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
