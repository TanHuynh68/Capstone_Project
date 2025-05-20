import ChatSidebar from "@/components/organisms/chat/ChatSidebar"
import ChatHeader from "@/components/organisms/chat/ChatHeader"
import MessageList from "@/components/organisms/chat/MessageList"
import MessageComposer from "@/components/molecules/chat/MessageComposer"

interface ChatTemplateProps {
  chats: Chat[]
  users: UserChat[]
  activeChat: string
  onSelectChat: (chatId: string) => void
  onSendMessage: (message: string) => void
}

export default function ChatTemplate({ chats, users, activeChat, onSelectChat, onSendMessage }: ChatTemplateProps) {
  const currentChat = chats.find((chat) => chat.id === activeChat)
  const currentChatUser = currentChat?.users.find((user) => user.id !== "current-user")

  return (
    <div className="flex w-full h-screen overflow-hidden border border-gray-800 bg-black text-white">
      <ChatSidebar chats={chats} activeChat={activeChat} onSelectChat={onSelectChat} />

      <div className="flex flex-1 flex-col">
        <ChatHeader user={currentChatUser} />

        {currentChat && <MessageList messages={currentChat.messages} users={users} />}

        <MessageComposer onSendMessage={onSendMessage} />
      </div>
    </div>
  )
}
