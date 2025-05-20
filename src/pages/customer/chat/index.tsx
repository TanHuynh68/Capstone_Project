"use client"

import { useState } from "react"
import ChatTemplate from "@/components/templates/chat/ChatTemplate"

const Chat=()=> {
  const [activeChat, setActiveChat] = useState<string>("1")
  const [chats, setChats] = useState<Chat[]>(initialChats)

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return

    // In a real app, you would send this message to your backend
    console.log("Đang gửi tin nhắn:", message)

    // Update the chat with the new message
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChat) {
          const newMessage = {
            id: `msg-${Date.now()}`,
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            senderId: "current-user",
          }

          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: `Bạn: ${message}`,
          }
        }
        return chat
      }),
    )
  }

  return (
    <ChatTemplate
      chats={chats}
      users={users}
      activeChat={activeChat}
      onSelectChat={setActiveChat}
      onSendMessage={handleSendMessage}
    />
  )
}
export default Chat;
// Sample data
const users: UserChat[] = [
  {
    id: "1",
    fullName: "Nguyễn Thị Hoa",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-orange-500",
    status: "Hoạt động 2 phút trước",
  },
  { id: "2", fullName: "Trần Văn Nam", avatar: "/placeholder.svg?height=40&width=40", color: "bg-pink-500" },
  { id: "3", fullName: "Lê Thị Hương", avatar: "/placeholder.svg?height=40&width=40", color: "bg-yellow-500" },
  { id: "4", fullName: "Phạm Văn Đức", avatar: "/placeholder.svg?height=40&width=40", color: "bg-green-500" },
]

const initialChats: Chat[] = [
  {
    id: "1",
    users: [
      users[0],
      { id: "current-user", fullName: "Bạn", avatar: "/placeholder.svg?height=40&width=40", color: "bg-blue-500" },
    ],
    messages: [
      { id: "1", content: "Thật tốt khi nghe điều đó!", timestamp: "10:05", senderId: "current-user" },
      { id: "2", content: "Hôm nay bạn thế nào?", timestamp: "10:06", senderId: "1" },
      {
        id: "3",
        content: "Tôi khỏe. Sáng nay tôi đi chạy bộ và sau đó ăn sáng ngon lành. Còn bạn thì sao?",
        timestamp: "10:10",
        senderId: "current-user",
      },
      { id: "4", content: "Tuyệt vời! Tôi đang thư giãn ở ngoài trời.", timestamp: "11:47", senderId: "1" },
    ],
    typing: true,
    lastMessage: "Nguyễn Thị Hoa: Đang nhập...",
  },
  {
    id: "2",
    users: [
      users[1],
      { id: "current-user", fullName: "Bạn", avatar: "/placeholder.svg?height=40&width=40", color: "bg-blue-500" },
    ],
    messages: [],
    lastMessage: "Bạn: Hẹn gặp lại sau nhé",
  },
  {
    id: "3",
    users: [
      users[2],
      { id: "current-user", fullName: "Bạn", avatar: "/placeholder.svg?height=40&width=40", color: "bg-blue-500" },
    ],
    messages: [],
    lastMessage: "Lê Thị Hương: Cảm ơn vì đã giúp đỡ!",
  },
  {
    id: "4",
    users: [
      users[3],
      { id: "current-user", fullName: "Bạn", avatar: "/placeholder.svg?height=40&width=40", color: "bg-blue-500" },
    ],
    messages: [],
    lastMessage: "Phạm Văn Đức: Hẹn gặp lại ngày mai",
  },
]
