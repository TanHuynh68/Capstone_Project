"use client";

import ChatSidebar from "@/components/organisms/customer/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/customer/chat/ChatHeader";
import MessageList from "@/components/organisms/customer/chat/MessageList";
import MessageComposer from "@/components/molecules/customer/chat/MessageComposer";
import InfoAboutTheConversationTab from "@/components/organisms/customer/chat/InfoAboutTheConversationTab";
import { useState, useEffect } from "react";
import type { SidebarCollapseProps } from "@/components/atoms/custom/sidebar-collapse/SidebarCollapse";
import SidebarCollapses from "@/components/molecules/custom/sidebar-collapse/SidebarCollapses";
import "./index.css";
import ChatService from "@/services/ChatService";

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
  offersPhase: any;
  fetchOffers: any;
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
  fetchOffers,
}: ChatTemplateProps) {
  const currentChatUser = users[0];
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [images, setImages] = useState<ChatMediaItem[]>([]);
  const [designs, setDesigns] = useState<ChatMediaItem[]>([]);
  const { getFile } = ChatService();

  const handleSetIsOpen = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    // Reset state when hiding the info panel
    if (!newIsOpen) {
      setValue("");
      // Reset any other states if needed
      setOffersPhase([]);
      setImages([]);
      setDesigns([]);
    }
  };

  // Reset animation state after transition completes
  useEffect(() => {
    const timer = setTimeout(() => {}, 300); // Match the transition duration
    return () => clearTimeout(timer);
  }, [isOpen]);

  const [value, setValue] = useState<string>("");
  console.log("InfoAboutTheConversationTab: ", posts);

  const fetchChatImages = async () => {
    try {
      const response = await getFile({ chatRoomID, type: 1 }); // type 1 for images
      if (response?.responseRequestModel?.responseList) {
        setImages(response.responseRequestModel.responseList);
      }
    } catch (error) {
      console.error("Error fetching chat images:", error);
      setImages([]);
    }
  };

  const fetchChatDesigns = async () => {
    try {
      const response = await getFile({ chatRoomID, type: 2 }); // type 2 for designs
      if (response?.responseRequestModel?.responseList) {
        setDesigns(response.responseRequestModel.responseList);
      }
    } catch (error) {
      console.error("Error fetching chat designs:", error);
      setDesigns([]);
    }
  };

  const handleSetTabsContent = (valueItem: any) => {
    // Clear content when empty value is passed (section collapsed)
    if (!valueItem) {
      setValue("");
      return;
    }

    if (valueItem === "offerPhase" && posts.length === 0) {
      fetchOffers();
    }

    if (valueItem === "images" && images.length === 0) {
      fetchChatImages();
    }

    if (valueItem === "designs" && designs.length === 0) {
      fetchChatDesigns();
    }

    setValue(valueItem);
  };

  const items: SidebarCollapseProps[] = [
    {
      title: "Thông tin đoạn chat",
      subItem: [
        { title: "Xem đề xuất", tabName: "viewPost", fetch: fetchOffers },
        { title: "Ảnh", tabName: "images", fetch: fetchChatImages },
        { title: "Thiết kế", tabName: "designs", fetch: fetchChatDesigns },
      ],
    },
  ];

  return (
    <div className="py-3 px-4 h-full">
      <div className="flex w-full h-full overflow-hidden gap-4">
        {/* Sidebar */}
        <div
          className={`border border-solid rounded-xl transition-all duration-300 ease-in-out ${
            isOpen
              ? "flex-1.5 opacity-100 translate-x-0 hidden 2xl:block"
              : "flex-1.5 opacity-100 translate-x-0"
          }`}
        >
          <ChatSidebar
            users={users}
            messages={message}
            activeChat={chatRoomID}
            onSelectChat={onSelectChat}
          />
        </div>

        {/* Main Chat Area */}
        <div
          className={`flex flex-col border border-solid rounded-xl transition-all duration-300 ease-in-out ${
            isOpen ? "flex-5" : "flex-[8.5]"
          }`}
        >
          <div className="sticky top-0 z-10 rounded-t-xl overflow-hidden">
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
            <div className="sticky bottom-0 z-10 rounded-b-xl overflow-hidden">
              <MessageComposer onSendMessage={onSendMessage} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen">
              Chưa có ai để trò chuyện
            </div>
          )}
        </div>

        {/* Info Panel with Animation - Fixed border radius and scrolling */}
        <div
          className={`flex flex-col border border-solid rounded-xl transition-all duration-300 ease-in-out transform ${
            isOpen
              ? "flex-4 max-w-[490px] min-w-[490px] opacity-100 translate-x-0 scale-100"
              : "flex-0 max-w-0 min-w-0 opacity-0 translate-x-full scale-95 overflow-hidden"
          }`}
          style={{
            transitionProperty:
              "flex, max-width, min-width, opacity, transform",
          }}
        >
          <div
            className={`h-full flex flex-col transition-all duration-300 ease-in-out delay-100 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Sidebar Collapses - Fixed height */}
            <div
              className={`flex-shrink-0 px-4 transition-all duration-400 ease-out delay-300 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <SidebarCollapses onClick={handleSetTabsContent} items={items} />
            </div>

            {/* Info Content - Scrollable area */}
            <div
              className={`flex-1 min-h-0 transition-all duration-500 ease-out delay-400 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px- pb-4">
                <InfoAboutTheConversationTab
                  fetchOffers={fetchOffers}
                  offersPhase={offersPhase}
                  setOffersPhase={setOffersPhase}
                  fetchOfferPhase={fetchOfferPhase}
                  value={value}
                  posts={posts}
                  images={images}
                  designs={designs}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
