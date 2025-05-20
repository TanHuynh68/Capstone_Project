import ChatSidebar from "@/components/organisms/chat/ChatSidebar"
import ChatHeader from "@/components/organisms/chat/ChatHeader"
import MessageList from "@/components/organisms/chat/MessageList"
import MessageComposer from "@/components/molecules/chat/MessageComposer"

interface ChatTemplateProps {
  message: Message[]
  users: UserChat[]
  chatRoomID: string
  onSelectChat: (chatRoomID: string) => void
  onSendMessage: (message: string) => void
}

export default function ChatTemplate({ message, users, chatRoomID, onSelectChat, onSendMessage }: ChatTemplateProps) {
  console.log('users: ', users)
  const currentChatUser = users[0]
 console.log('messages: ', message)
  return (
    <div className="flex w-full h-screen  overflow-y-auto overflow-hidden border border-gray-800 bg-black text-white">
      <ChatSidebar users={users} messages={message} activeChat={chatRoomID} onSelectChat={onSelectChat} />

      <div className="flex flex-1 flex-col">
        <ChatHeader  user={currentChatUser} />

        {currentChatUser && <MessageList messages={message} users={users.filter(item=>item.chatRoomID===chatRoomID )} />}

        <MessageComposer onSendMessage={onSendMessage} />
      </div>
    </div>
  )
}
