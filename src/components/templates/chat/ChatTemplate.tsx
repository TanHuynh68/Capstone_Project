"use client"

import ChatSidebar from "@/components/organisms/customer/chat/ChatSidebar"
import ChatHeader from "@/components/organisms/customer/chat/ChatHeader"
import MessageList from "@/components/organisms/customer/chat/MessageList"
import MessageComposer from "@/components/molecules/customer/chat/MessageComposer"
import InfoAboutTheConversationTab from "@/components/organisms/customer/chat/InfoAboutTheConversationTab"
import { useState, useEffect } from "react"
import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar"
import { useCurrentUser } from "@/components/utils"
import type { SidebarCollapseProps } from "@/components/atoms/custom/sidebar-collapse/SidebarCollapse"
import SidebarCollapses from "@/components/molecules/custom/sidebar-collapse/SidebarCollapses"
import './index.css'
interface ChatTemplateProps {
  setShouldScroll: any
  message: Message[]
  users: UserChat[]
  chatRoomID: string
  onSelectChat: any
  onSendMessage: (message: string) => void
  shouldScrollToBottom: boolean
  loadingMessage: boolean
  onDeletMessage: any
  onEditMessage: any
  posts: OfferDetail[]
  fetchOfferPhase: any
  setOffersPhase: any
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
  fetchOffers,
}: ChatTemplateProps) {
  const currentChatUser = users[0]
  const userMain = useCurrentUser()
  const [isOpen, setIsOpen] = useState<boolean>(true)

  const handleSetIsOpen = () => {
    setIsOpen(!isOpen)
  }
  //
  // Reset animation state after transition completes
  useEffect(() => {
    const timer = setTimeout(() => {
    }, 300) // Match the transition duration

    return () => clearTimeout(timer)
  }, [isOpen])

  const user = users.filter((item) => item.chatRoomID === chatRoomID)
  const [value, setValue] = useState<string>("")
  console.log("InfoAboutTheConversationTab: ", posts)

  const handleSetTabsContent = (valueItem: any) => {
    setValue(valueItem)
  }

  const items: SidebarCollapseProps[] = [
    {
      title: "Thông tin về đoạn chat",
      subItem: [
        { title: "Xem đề xuất", tabName: "offerPhase" },
        { title: "Timeline", tabName: "timeline" },
        { title: "Xem bài đăng", tabName: "viewPost" },
      ],
    },
  ]

  return (
    <div className="bg-gray-200 py-3 pl-4 h-[95%]">
      <div className="flex w-full h-full overflow-hidden gap-4 ">
        {/* Sidebar */}
        <div
          className={`border border-solid rounded-xl bg-white transition-all duration-300 ease-in-out ${
            isOpen ? "flex-1.5 opacity-100 translate-x-0 hidden 2xl:block" : "flex-1.5 opacity-100 translate-x-0"
          }`}
        >
          <ChatSidebar users={users} messages={message} activeChat={chatRoomID} onSelectChat={onSelectChat} />
        </div>

        {/* Main Chat Area */}
        <div
          className={`flex flex-col bg-white rounded-xl transition-all duration-300 ease-in-out ${
            isOpen ? "flex-5" : "flex-[8]"
          }`}
        >
          <div className="sticky top-0 z-10">
            {currentChatUser && (
              <ChatHeader setIsOpen={handleSetIsOpen} user={users.filter((item) => item.chatRoomID === chatRoomID)} />
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
            <div className="flex justify-center items-center h-screen">Chưa có ai để trò chuyện</div>
          )}
        </div>

        {/* Info Panel with Animation */}
        <div
          className={`flex flex-col rounded-xl bg-white px- transition-all duration-300 ease-in-out transform ${
            isOpen
              ? "flex-4 max-w-[510px] min-w-[510px] opacity-100 translate-x-0 scale-100"
              : "flex-0 max-w-0 min-w-0 opacity-0 translate-x-full scale-95 overflow-hidden"
          }`}
          style={{
            transitionProperty: "flex, max-width, min-width, opacity, transform",
          }}
        >
          <div
            className={`transition-all duration-300 ease-in-out delay-100 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Avatar Section */}
            <div className="flex-1">
              <div className="mt-10">
                <div className="">
                  <div className="flex justify-center">
                    <div
                      className={`transition-all duration-500 ease-out ${
                        isOpen ? "scale-100 rotate-0" : "scale-75 rotate-12"
                      }`}
                    >
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
                  </div>
                  <div
                    className={`text-2xl flex justify-center mt-2 transition-all duration-400 ease-out delay-200 ${
                      isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {userMain.id !== user[0]?.account1?.accountID
                      ? user[0]?.account1?.accountName
                      : user[0]?.account2?.accountName}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Collapses */}
            <div
              className={`flex-1 transition-all duration-400 ease-out delay-300 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <SidebarCollapses onClick={handleSetTabsContent} items={items} />
            </div>

            {/* Info Content */}
            <div
              className={`flex-4 overflow-y-auto transition-all duration-500 ease-out delay-400 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <InfoAboutTheConversationTab
                fetchOffers={fetchOffers}
                offersPhase={offersPhase}
                setOffersPhase={setOffersPhase}
                fetchOfferPhase={fetchOfferPhase}
                value={value}
                posts={posts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
